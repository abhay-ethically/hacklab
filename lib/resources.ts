export interface Resource {
  title: string;
  href: string;
  description: string;
}

export interface CategoryResources {
  category: string;
  description: string;
  resources: Resource[];
}

export const resourcesByCategory: CategoryResources[] = [
  {
    category: 'Linux Privilege Escalation',
    description: 'Tools and references for enumerating Linux systems and escalating privileges.',
    resources: [
      { title: 'GTFOBins', href: 'https://gtfobins.github.io/', description: 'A curated list of Unix binaries that can be exploited to bypass local security restrictions.' },
      { title: 'LinPEAS', href: 'https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS', description: 'Linux privilege escalation awesome script.' },
      { title: 'Linux Privilege Escalation - HackTricks', href: 'https://book.hacktricks.xyz/linux-hardening/privilege-escalation', description: 'Comprehensive cheat sheet for Linux privesc.' },
    ],
  },
  {
    category: 'Web Exploitation',
    description: 'Reference material for SQLi, XSS, IDOR, command injection and JWT abuse.',
    resources: [
      { title: 'OWASP Testing Guide', href: 'https://owasp.org/www-project-web-security-testing-guide/', description: 'Industry standard web application testing guide.' },
      { title: 'PortSwigger Web Security Academy', href: 'https://portswigger.net/web-security', description: 'Free, hands-on web security labs and tutorials.' },
      { title: 'PayloadsAllTheThings', href: 'https://github.com/swisskyrepo/PayloadsAllTheThings', description: 'Useful lists of payloads for web attacks.' },
    ],
  },
  {
    category: 'Cryptography & Hash Cracking',
    description: 'Resources for cracking hashes, JWT manipulation and RSA basics.',
    resources: [
      { title: 'John the Ripper', href: 'https://www.openwall.com/john/', description: 'Fast password cracker supporting many hash types.' },
      { title: 'CrackStation', href: 'https://crackstation.net/', description: 'Online hash cracking lookup service.' },
      { title: 'jwt.io', href: 'https://jwt.io/', description: 'Debugger and library references for JSON Web Tokens.' },
    ],
  },
  {
    category: 'Network & Traffic Analysis',
    description: 'Tools for packet capture, port scanning and protocol inspection.',
    resources: [
      { title: 'Wireshark', href: 'https://www.wireshark.org/', description: 'World’s most popular network protocol analyzer.' },
      { title: 'Nmap', href: 'https://nmap.org/', description: 'Network discovery and security auditing utility.' },
      { title: 'tcpdump', href: 'https://www.tcpdump.org/', description: 'Powerful command-line packet analyzer.' },
    ],
  },
  {
    category: 'Active Directory',
    description: 'References for AD enumeration, Kerberos attacks and lateral movement.',
    resources: [
      { title: 'BloodHound', href: 'https://github.com/BloodHoundAD/BloodHound', description: 'Active Directory attack path visualizer.' },
      { title: 'Impacket', href: 'https://github.com/fortra/impacket', description: 'Collection of Python classes for working with network protocols.' },
      { title: 'HackTricks AD', href: 'https://book.hacktricks.xyz/windows-hardening/active-directory-methodology', description: 'Active Directory methodology and attacks.' },
    ],
  },
];
