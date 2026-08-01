import { VFSState, getNode, listNodes, resolveAbsolute, findSuid, findFiles } from './vfs';
import { Level } from './levelData';

export interface CommandResult {
  output: string;
  cwd?: string;
  flag?: { correct: boolean; value: string };
}

export interface CommandContext {
  vfs: VFSState;
  level?: Level;
  submitFlag?: (flag: string) => Promise<boolean>;
}

function splitArgs(input: string): string[] {
  const args: string[] = [];
  let cur = '';
  let quote: string | null = null;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      } else {
        cur += c;
      }
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (/\s/.test(c)) {
      if (cur) {
        args.push(cur);
        cur = '';
      }
    } else {
      cur += c;
    }
  }
  if (cur) args.push(cur);
  return args;
}

function modeString(mode: number): string {
  const perms = (m: number) =>
    'rwxrwxrwx'.split('').reduce((acc, ch, i) => {
      return acc + (m & (1 << (8 - i)) ? ch : '-');
    }, '');
  const type = (m: number) => (m & 0o40000 ? 'd' : '-');
  return type(mode) + perms(mode & 0o777);
}

function pseudoMd5(input: string): string {
  if (input === 'password') return '5f4dcc3b5aa765d61d8327deb882cf99';
  if (input === 'admin') return '21232f297a57a5a743894a0e4a801fc3';
  // deterministic fake hex for anything else
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  const hex = Math.abs(h).toString(16).padStart(32, '0');
  return hex.slice(-32);
}

function base64Encode(s: string): string {
  try {
    return btoa(s);
  } catch {
    return '';
  }
}

function base64Decode(s: string): string {
  try {
    return atob(s);
  } catch {
    return 'base64: invalid input';
  }
}

function fileExists(ctx: CommandContext, path: string): boolean {
  const n = getNode(ctx.vfs.root, ctx.vfs.cwd, path);
  return !!n && n.node.type === 'file';
}

function readFile(ctx: CommandContext, path: string): string | null {
  const n = getNode(ctx.vfs.root, ctx.vfs.cwd, path);
  return n && n.node.type === 'file' ? (n.node.content ?? '') : null;
}

export async function runCommand(raw: string, ctx: CommandContext): Promise<CommandResult> {
  const input = raw.trim();
  if (!input) return { output: '' };

  ctx.vfs.history.push(input);
  if (ctx.vfs.history.length > 100) ctx.vfs.history.shift();

  const args = splitArgs(input);
  const cmd = args[0];

  switch (cmd) {
    case 'help':
      return {
        output:
          'Built-in commands:\n' +
          '  ls [-la] [dir]   cd <dir>   cat <file>   grep <pattern> <file>\n' +
          '  find <path> -perm -4000   echo <text>   clear   help   whoami\n' +
          '  pwd   sudo -l   history   submit-flag <FLAG{...}>\n' +
          'Cyber tools:\n' +
          '  nmap <ip>   dirb <url>   gobuster dir -u <url>   exiftool <file>\n' +
          '  strings <file>   base64 [-d] <string>   md5 <string>   john <file>\n' +
          '  curl <url>   aws s3 ls <bucket>   GetUserSPNs.py -dc-ip <ip> -request\n' +
          '  ssh -i <key> root@target   vim -c \'!sh\'   sudo python3 -c "..."\n',
      };

    case 'whoami':
      return { output: 'user' };

    case 'pwd':
      return { output: ctx.vfs.cwd };

    case 'cd': {
      if (!args[1]) return { output: '', cwd: ctx.vfs.cwd };
      const target = resolveAbsolute(ctx.vfs.cwd, args[1]);
      const n = getNode(ctx.vfs.root, '/', target);
      if (!n) return { output: `cd: ${args[1]}: No such file or directory` };
      if (n.node.type !== 'dir') return { output: `cd: ${args[1]}: Not a directory` };
      return { output: '', cwd: target };
    }

    case 'ls': {
      let all = false;
      let long = false;
      let path = ctx.vfs.cwd;
      for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('-')) {
          if (args[i].includes('a')) all = true;
          if (args[i].includes('l')) long = true;
        } else {
          path = resolveAbsolute(ctx.vfs.cwd, args[i]);
        }
      }
      const entries = listNodes(ctx.vfs.root, ctx.vfs.cwd, path, all);
      if (!entries) return { output: `ls: cannot access ${path}: No such file or directory` };
      const max = Math.max(...entries.map((e) => e.name.length));
      const now = new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      if (long) {
        return {
          output: entries
            .map((e) => {
              const perms = modeString(e.node.mode | (e.node.type === 'dir' ? 0o40000 : 0));
              const size = e.node.type === 'file' ? (e.node.content?.length ?? 0) : 4096;
              return `${perms} ${e.node.owner} ${e.node.owner} ${size.toString().padStart(8)} ${now} ${e.name}`;
            })
            .join('\n'),
        };
      }
      return { output: entries.map((e) => e.name).join('  ') };
    }

    case 'cat': {
      if (!args[1]) return { output: 'cat: missing operand' };
      if (ctx.level?.id === '2' && (args[1] === '.secret' || args[1].endsWith('/.secret'))) {
        return { output: ctx.level.flag };
      }
      if (ctx.level?.id === '1' && (args[1] === '/var/log/syslog' || args[1] === 'syslog')) {
        return {
          output:
            'Jan 01 00:00:01 target sshd[123]: Failed password for root from 10.0.0.99\n' +
            'Jan 01 00:00:02 target app[456]: user=admin password=supersecret\n' +
            `Jan 01 00:00:03 target app[456]: leak detected: ${ctx.level.flag}\n`,
        };
      }
      const content = readFile(ctx, args[1]);
      if (content === null) return { output: `cat: ${args[1]}: No such file or directory` };
      return { output: content };
    }

    case 'grep': {
      if (args.length < 3) return { output: 'usage: grep <pattern> <file>' };
      if (ctx.level?.id === '1' && (args[2] === '/var/log/syslog' || args[2] === 'syslog')) {
        return {
          output:
            'Jan 01 00:00:01 target sshd[123]: Failed password for root from 10.0.0.99\n' +
            'Jan 01 00:00:02 target app[456]: user=admin password=supersecret\n' +
            `Jan 01 00:00:03 target app[456]: leak detected: ${ctx.level.flag}\n`,
        };
      }
      const content = readFile(ctx, args[2]);
      if (content === null) return { output: `grep: ${args[2]}: No such file or directory` };
      const pattern = args[1];
      const lines = content.split('\n').filter((l) => l.includes(pattern));
      return { output: lines.join('\n') };
    }

    case 'find': {
      const path = args[1] || '/';
      const perm = args.includes('-perm') && args.includes('-4000');
      if (perm) {
        if (ctx.level?.id === '10') {
          return { output: `/usr/bin/vim\n${ctx.level.flag}` };
        }
        const matches = findSuid(ctx.vfs.root);
        return { output: matches.join('\n') };
      }
      return { output: findFiles(ctx.vfs.root, path).join('\n') };
    }

    case 'echo':
      return { output: input.slice(cmd.length).trim() };

    case 'history':
      return { output: ctx.vfs.history.map((h, i) => `${(i + 1).toString().padStart(3)} ${h}`).join('\n') };

    case 'clear':
      return { output: '\x1bc' };

    case 'sudo': {
      const rest = args.slice(1);
      if (rest[0] === '-l') {
        return { output: 'User user may run the following commands on target:\n    (root) NOPASSWD: /usr/bin/python3' };
      }
      if (rest[0] === 'python3' && rest[1] === '-c' && rest[2]?.includes('os.system')) {
        return { output: 'root@target:/# whoami\nroot\nFLAG{sudo_python_privesc}' };
      }
      return { output: `Sorry, user user is not allowed to run '${rest.join(' ')}' as root on target.` };
    }

    case 'nmap':
      return {
        output:
          'Starting Nmap 7.94 ( https://nmap.org )\n' +
          'Nmap scan report for target (10.0.0.1)\n' +
          'Host is up (0.0001s latency).\n' +
          'Not shown: 996 closed ports\n' +
          'PORT     STATE SERVICE  VERSION\n' +
          '21/tcp   open  ftp      vsftpd 2.3.4\n' +
          '22/tcp   open  ssh      OpenSSH 8.9\n' +
          '80/tcp   open  http     Apache httpd 2.4.41\n' +
          '3306/tcp open  mysql    MySQL 5.7.38\n' +
          '\nService detection performed.\n' +
          'FLAG{nmap_service_discovery}',
      };

    case 'dirb':
      return {
        output:
          '-----------------\n' +
          'DIRB v2.22\nBy The Dark Raver\n' +
          '-----------------\n' +
          'START_TIME: now\n' +
          `URL_BASE: ${args[1] || 'http://target/'}\n` +
          'WORDLIST_FILES: common.txt\n' +
          '---- Scanning URL ----\n' +
          '+ http://target/admin_panel_v2/ (CODE:200|SIZE:1234)\n' +
          '+ http://target/robots.txt (CODE:200|SIZE:42)\n' +
          '-----------------\n' +
          'END_TIME: now\n' +
          'FLAG{dirb_hidden_d00r}',
      };

    case 'gobuster': {
      const urlIdx = args.indexOf('-u') + 1;
      const url = urlIdx > 0 ? args[urlIdx] : 'http://target/';
      return {
        output:
          'Gobuster v3.6\n' +
          `Starting gobuster in directory enumeration mode on ${url}\n` +
          '/admin_panel_v2/        (Status: 200) [Size: 1234]\n' +
          '/api/v1/                (Status: 200) [Size: 256]\n' +
          '/config.bak             (Status: 200) [Size: 89]\n' +
          'FLAG{gobuster_f0rce}',
      };
    }

    case 'exiftool': {
      const target = args[1] || 'secret.jpg';
      if (!fileExists(ctx, target) && target !== 'secret.jpg') {
        return { output: `Error: File not found - ${target}` };
      }
      return {
        output:
          `ExifTool Version Number         : 12.00\n` +
          `File Name                       : ${target}\n` +
          `File Size                       : 12 kB\n` +
          `MIME Type                       : image/jpeg\n` +
          `GPS Latitude                    : 37 deg 46' 29.64" N\n` +
          `GPS Longitude                   : 122 deg 25' 9.82" W\n` +
          `GPS Position                    : 37.7749 N, 122.4194 W\n` +
          `Comment                         : FLAG{exif_undercover}\n` +
          `-----END-----`,
      };
    }

    case 'strings': {
      if (!args[1]) return { output: 'usage: strings <file>' };
      if (ctx.level?.id === '18' && (args[1] === '/var/backups/capture.pcap' || args[1] === 'capture.pcap')) {
        return {
          output:
            'POST /login HTTP/1.1\n' +
            'Host: target\n' +
            'Content-Length: 35\n' +
            '\n' +
            'username=admin&password=AdminPass1!\n' +
            `\n${ctx.level.flag}\n`,
        };
      }
      const content = readFile(ctx, args[1]);
      if (content === null) return { output: `strings: ${args[1]}: No such file or directory` };
      // Strip non-printable, return printable lines
      return {
        output: content
          .split(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]+/)
          .filter((s) => s.trim().length > 2)
          .join('\n'),
      };
    }

    case 'base64': {
      if (args[1] === '-d') {
        return { output: base64Decode(args[2] || '') };
      }
      return { output: base64Encode(args.slice(1).join(' ')) };
    }

    case 'md5':
      return { output: pseudoMd5(args.slice(1).join(' ')) };

    case 'john': {
      const file = args[1] || 'hash.txt';
      if (ctx.level?.id === '9' && file.toLowerCase().includes('hash')) {
        return {
          output:
            'Loaded 1 password hash (Raw MD5 [MD5 128/128])\n' +
            'password         (?)\n' +
            '1g 0:00:00:00 DONE (2024-01-01 00:00) 100.00%\n' +
            `${ctx.level.flag}\n`,
        };
      }
      if (ctx.level?.id === '20' && (file.toLowerCase().includes('tgs') || file.toLowerCase().includes('spn'))) {
        return {
          output:
            'Loaded 1 password hash (Kerberos 5, etype 23, TGS-REP [BSB])\n' +
            'AdminPass1!      (MSSQLService)\n' +
            '1g 0:00:00:05 DONE (2024-01-01 00:00) 0.20g/s\n' +
            `${ctx.level.flag}\n`,
        };
      }
      const content = readFile(ctx, file);
      if (content === null) return { output: `john: ${file}: No such file or directory` };
      if (content.includes('5f4dcc3b5aa765d61d8327deb882cf99')) {
        return {
          output:
            'Loaded 1 password hash (Raw MD5 [MD5 128/128])\n' +
            'password         (?)\n' +
            '1g 0:00:00:00 DONE (2024-01-01 00:00) 100.00%\n' +
            'FLAG{john_the_ripper_hash}',
        };
      }
      if (content.toLowerCase().includes('mssqlservice') || file.toLowerCase().includes('spn') || file.toLowerCase().includes('tgs')) {
        return {
          output:
            'Loaded 1 password hash (Kerberos 5, etype 23, TGS-REP [BSB])\n' +
            'AdminPass1!      (MSSQLService)\n' +
            '1g 0:00:00:05 DONE (2024-01-01 00:00) 0.20g/s\n' +
            'FLAG{kerberoasting_db_admin}',
        };
      }
      return { output: '0 password hashes cracked\nNo matches found in wordlist.' };
    }

    case 'curl': {
      const url = args[args.length - 1] || '';
      const dataIdx = args.indexOf('-d') + 1;
      const payload = dataIdx > 0 ? args[dataIdx] || '' : '';

      if (url.includes('api/v1/internal/config')) {
        return { output: '{"status":"ok","debug":true,"aws_key":"AKIAIOSFODNN7EXAMPLE","flag":"FLAG{api_internal_exposed}"}' };
      }
      if (url.includes('fetch?url=') && url.includes('169.254.169.254')) {
        return {
          output:
            '{"Code":"Success","LastUpdated":"2024-01-01","Type":"AWS-HACKED",' +
            '"AccessKeyId":"AKIAIOSFODNN7EXAMPLE","SecretAccessKey":"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",' +
            '"flag":"FLAG{ssrf_cloud_metadata}"}',
        };
      }
      if (url.includes('api/import') && (payload.includes('<!DOCTYPE') || payload.includes('SYSTEM')) && payload.includes('/etc/passwd')) {
        return {
          output:
            '<?xml version="1.0"?>\n' +
            '<result>\n' +
            'root:x:0:0:root:/root:/bin/bash\n' +
            'user:x:1000:1000:user:/home/user:/bin/bash\n' +
            '</result>\n' +
            'FLAG{xxe_internal_leak}',
        };
      }
      if (url.includes('download?file=') && (url.includes('..') || url.includes('etc/passwd'))) {
        return {
          output:
            'root:x:0:0:root:/root:/bin/bash\n' +
            'user:x:1000:1000:user:/home/user:/bin/bash\n' +
            'FLAG{lfi_path_traversal}',
        };
      }
      if (url.includes('nosql-login') && (payload.includes('"$ne"') || payload.includes("'$ne'"))) {
        return { output: '{"status":"ok","user":"admin","message":"Welcome admin"}\nFLAG{nosql_operator_bypass}' };
      }
      if (url.includes('.git/HEAD')) {
        return { output: 'ref: refs/heads/main\nFLAG{git_exposed_head}' };
      }
      if (url.includes('s3') || url.includes('company-public-assets')) {
        return { output: '<?xml version="1.0"?>\n<ListBucketResult>\n  <Contents><Key>.env</Key></Contents>\n  <Contents><Key>logo.png</Key></Contents>\n</ListBucketResult>\nFLAG{s3_bucket_leak}' };
      }
      return { output: `<html><body>Welcome to ${url || 'target'}</body></html>` };
    }

    case 'aws': {
      if (args[1] === 's3' && args[2] === 'ls' && args[3]) {
        return {
          output:
            `2024-01-01 00:00:00       4096 ${args[3]}/public/\n` +
            '2024-01-01 00:00:00        256 .env\n' +
            '2024-01-01 00:00:00       1024 logo.png\n' +
            'FLAG{s3_bucket_leak}',
        };
      }
      if (args[1] === 's3' && args[2] === 'cp' && args[3]?.includes('.env')) {
        return {
          output:
            'download: s3://company-public-assets/.env to ./.env\n' +
            'DATABASE_URL=mysql://db:secret@target/db\n' +
            'AWS_SECRET=super-secret-key\n' +
            'FLAG{s3_bucket_leak}',
        };
      }
      return { output: 'usage: aws s3 ls <bucket> | aws s3 cp <s3-object> <local>' };
    }

    case 'ssh': {
      const iIdx = args.indexOf('-i') + 1;
      const key = iIdx > 0 ? args[iIdx] : '';
      const keyPath = resolveAbsolute(ctx.vfs.cwd, key || 'id_rsa');
      const keyNode = getNode(ctx.vfs.root, '/', keyPath);
      if ((key && keyNode && keyNode.node.type === 'file' && args.some((a) => a.includes('root@target'))) ||
          (ctx.level?.id === '19' && args.some((a) => a.includes('root@target')))) {
        return { output: `root@target:~# whoami\nroot\n${ctx.level ? ctx.level.flag : 'FLAG{ssh_key_hijack_achieved}'}` };
      }
      if (args.some((a) => a.includes('root@target'))) {
        return { output: 'Permission denied (publickey,password).\nTry using an identity file: ssh -i <key> root@target' };
      }
      return { output: 'ssh: Could not resolve hostname' };
    }

    case 'vim': {
      if (args[1] === '-c' && args[2]?.includes('!sh')) {
        return { output: 'root@target:/# whoami\nroot\nFLAG{suid_vim_escalation}' };
      }
      return { output: 'VIM - Vi IMproved 9.0\n~\n~\n~\nType :q<Enter> to quit' };
    }

    case 'GetUserSPNs.py':
    case 'impacket-GetUserSPNs.py':
    case 'GetUserSPNs': {
      return {
        output:
          'Impacket v0.12.0 - Copyright 2023 Fortra\n' +
          'ServicePrincipalName  Name           MemberOf  PasswordLastSet  LastLogon  Delegation\n' +
          'MSSQLService          db.corp.local            2024-01-01        never\n' +
          '\n$krb5tgs$23$*MSSQLService$CORP.LOCAL$MSSQLSvc/db.corp.local*...\n' +
          'Saved to /home/user/tgs.hash\n' +
          'FLAG{kerberoasting_db_admin}',
      };
    }

    case 'submit-flag': {
      const flag = input.slice('submit-flag'.length).trim();
      if (!flag) return { output: 'usage: submit-flag <FLAG{...}>' };
      if (!ctx.level) return { output: 'No active level to submit a flag against.' };
      const correct = ctx.submitFlag ? await ctx.submitFlag(flag) : flag === ctx.level.flag;
      return { output: correct ? 'Flag accepted. Great work, operator.' : 'Invalid flag. Try harder.', flag: { correct, value: flag } };
    }

    case 'chmod':
      return { output: 'chmod: permissions updated (simulated)' };

    case 'touch':
      return { output: '' };

    case 'rm':
      return { output: 'rm: command disabled in simulation' };

    default:
      return { output: `${cmd}: command not found` };
  }
}
