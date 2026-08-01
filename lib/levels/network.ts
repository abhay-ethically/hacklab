import { Level } from '.';

export const network: Level[] = [
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
];
