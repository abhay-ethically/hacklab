import { Level } from '.';

export const recon: Level[] = [
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
  {
    id: '26',
    title: 'Subdomain Enumeration',
    category: 'Reconnaissance',
    description:
      'Discover hidden subdomains for target.com using a passive subdomain finder.',
    objective: 'Run subfinder and extract the flag from the admin panel subdomain.',
    target: 'target.com',
    type: 'terminal',
    flag: 'FLAG{subdomain_recon_hunter}',
    xp: 120,
    hints: ['Run `subfinder -d target.com`', 'Look for `admin.target.com` in the output.'],
  },
];
