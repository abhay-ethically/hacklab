import { Level } from '.';

export const forensics: Level[] = [
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
];
