export interface VFSNode {
  type: 'file' | 'dir';
  mode: number;
  owner: string;
  content?: string;
  suid?: boolean;
  children?: Record<string, VFSNode>;
}

export interface VFSState {
  root: VFSNode;
  cwd: string;
  history: string[];
}

function makeDir(
  children: Record<string, VFSNode> = {},
  mode = 0o755,
  owner = 'root'
): VFSNode {
  return { type: 'dir', mode, owner, children };
}

function makeFile(
  content: string,
  mode = 0o644,
  owner = 'root',
  suid = false
): VFSNode {
  return { type: 'file', mode, owner, content, suid };
}

export function createVFS(): VFSState {
  const root: VFSNode = makeDir({
    home: makeDir({
      user: makeDir({
        '.bashrc': makeFile('export PS1="\\u@\\h:\\w\\$ "\nalias ll="ls -la"'),
        '.hidden_flag': makeFile(
          'You found the hidden artifact!\nFLAG{dotfile_hunter_7h3_d4rk}',
          0o600,
          'user'
        ),
        notes: makeDir({
          'todo.txt': makeFile(
            'TODO:\n- rotate database password\n- remove backup keys\n- check /var/backups'
          ),
        }),
        'hash.txt': makeFile(
          '5f4dcc3b5aa765d61d8327deb882cf99',
          0o644,
          'user'
        ),
        'spn.hash': makeFile(
          '$krb5tgs$23$*MSSQLService$CORP.LOCAL$MSSQLSvc/db.corp.local*$...hash...',
          0o644,
          'user'
        ),
        'tgs.hash': makeFile('', 0o644, 'user'),
      }),
      root: makeDir({
        '.secret': makeFile('root crown jewel\nFLAG{root_secrets_buried}'),
      }),
    }),
    etc: makeDir({
      passwd: makeFile(
        'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\nftp:x:101:101:ftp:/srv/ftp:/bin/false'
      ),
      shadow: makeFile(
        'root:$6$xyz$hash:0:0:99999:7:::\nuser:$6$abc$hash:0:0:99999:7:::'
      ),
      'sudoers': makeFile(
        'user ALL=(root) NOPASSWD: /usr/bin/python3\n%admin ALL=(ALL) ALL'
      ),
    }),
    var: makeDir({
      log: makeDir({
        syslog: makeFile(
          'Jan  1 10:01:01 server sshd[123]: Accepted password for user from 10.0.0.50\n' +
            'Jan  1 10:02:15 server cron[42]: backup completed\n' +
            'Jan  1 10:05:33 server app[88]: WARN password=SuperS3cret! for admin leaked in log\n' +
            'Jan  1 10:06:00 server app[88]: FLAG{log_watcher_2024}'
        ),
        auth: makeFile(
          'auth login: user, secret: FLAG{auth_log_inspector}'
        ),
      }),
      backups: makeDir({
        'id_rsa': makeFile(
          '-----BEGIN OPENSSH PRIVATE KEY-----\n' +
            'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\n' +
            'QyNTUxOQAAACBZ5YAsQ2d3/xyz...\n' +
            '-----END OPENSSH PRIVATE KEY-----\nFLAG{ssh_key_hijack_achieved}',
          0o600,
          'root'
        ),
        'capture.pcap': makeFile(
          '\x00\x00POST /login HTTP/1.1\r\n' +
            'Host: target\r\n' +
            'username=admin&password=PlainTextPwned123&submit=login\r\n' +
            '\r\nFLAG{pcap_password_plains}'
        ),
      }),
    }),
    bin: makeDir({
      vim: makeFile('ELF binary placeholder', 0o4755, 'root', true),
      python3: makeFile('ELF binary placeholder', 0o755, 'root'),
      strings: makeFile('ELF binary placeholder', 0o755, 'root'),
      base64: makeFile('ELF binary placeholder', 0o755, 'root'),
      john: makeFile('ELF binary placeholder', 0o755, 'root'),
      nmap: makeFile('ELF binary placeholder', 0o755, 'root'),
    }),
    tmp: makeDir({}, 0o777, 'root'),
    srv: makeDir({
      ftp: makeDir({
        'backup.zip': makeFile(
          'PK\x03\x04\n\nFLAG{ftp_anonymous_l00t}',
          0o644,
          'root'
        ),
      }),
    }),
    'secret.jpg': makeFile(
      'JFIF binary placeholder',
      0o644,
      'root'
    ),
    'flag.txt': makeFile('You should not be here, go back to the levels.', 0o644, 'root'),
  });

  return { root, cwd: '/home/user', history: [] };
}

function clean(path: string): string {
  const parts = path
    .split('/')
    .filter((p) => p && p !== '.')
    .reduce<string[]>((acc, p) => {
      if (p === '..') {
        acc.pop();
      } else {
        acc.push(p);
      }
      return acc;
    }, []);
  return '/' + parts.join('/');
}

export function resolveAbsolute(cwd: string, input: string): string {
  if (input.startsWith('/')) return clean(input);
  if (input.startsWith('~')) return clean('/home/user' + input.slice(1));
  return clean(cwd + '/' + input);
}

export function getNode(
  root: VFSNode,
  cwd: string,
  path: string
): { node: VFSNode; abs: string } | null {
  const abs = resolveAbsolute(cwd, path);
  const parts = abs.split('/').filter(Boolean);
  let node = root;
  for (const p of parts) {
    if (!node.children || !node.children[p]) return null;
    node = node.children[p];
  }
  return { node, abs };
}

export function listNodes(
  root: VFSNode,
  cwd: string,
  path: string,
  all = false
): { name: string; node: VFSNode; abs: string }[] | null {
  const target = getNode(root, cwd, path);
  if (!target || target.node.type !== 'dir') return null;
  const entries = Object.entries(target.node.children || {})
    .filter(([name]) => all || !name.startsWith('.'))
    .map(([name, node]) => ({ name, node, abs: target.abs + '/' + name }));
  return entries;
}

export function findSuid(root: VFSNode): string[] {
  const out: string[] = [];
  function walk(prefix: string, node: VFSNode) {
    if (node.type === 'file' && node.suid) {
      out.push(prefix);
    }
    if (node.children) {
      for (const [name, child] of Object.entries(node.children)) {
        walk(prefix === '/' ? '/' + name : prefix + '/' + name, child);
      }
    }
  }
  walk('/', root);
  return out;
}

export function findFiles(root: VFSNode, path: string): string[] {
  const start = getNode(root, '/', path);
  const out: string[] = [];
  if (!start || start.node.type !== 'dir') return out;
  function walk(prefix: string, node: VFSNode) {
    if (node.type === 'file') out.push(prefix);
    if (node.children) {
      for (const [name, child] of Object.entries(node.children)) {
        walk(prefix === '/' ? '/' + name : prefix + '/' + name, child);
      }
    }
  }
  walk(start.abs, start.node);
  return out;
}
