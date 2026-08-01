import { Level } from '.';

export const crypto: Level[] = [
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
];
