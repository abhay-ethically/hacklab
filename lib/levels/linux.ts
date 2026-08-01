import { Level } from '.';

export const linux: Level[] = [
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
    id: '27',
    title: 'Cron Backdoor',
    category: 'Linux Privilege Escalation',
    description:
      'A cron job runs as root and uses a wildcard in a writable directory, allowing command injection.',
    objective: 'Inspect /etc/crontab and find the wildcard cron that exposes the flag.',
    target: '/etc/crontab',
    type: 'terminal',
    flag: 'FLAG{cron_wildcard_g0d}',
    xp: 120,
    hints: ['Run `cat /etc/crontab`', 'Look for a wildcard `*` in a root-owned cron job.'],
  },
  {
    id: '32',
    title: 'Process Environment Leak',
    category: 'Linux Privilege Escalation',
    description:
      'A running process inherited a secret from its parent. Read the process environment to find it.',
    objective: 'Inspect /proc/self/environ to find the hidden API key and flag.',
    target: '/proc/self/environ',
    type: 'terminal',
    flag: 'FLAG{pr0c_3nv_l34k}',
    xp: 100,
    hints: ['Run `cat /proc/self/environ`', 'Look for the `SECRET=` variable.'],
  },
];
