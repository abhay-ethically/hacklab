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
  {
    id: '36',
    title: 'Caesar Cipher',
    category: 'Cryptography',
    description:
      'An ancient shift cipher was used to hide a message. The ciphertext is in /home/user/caesar.txt and uses a shift of 3.',
    objective: 'Decode the Caesar-encrypted file to recover the flag.',
    target: '/home/user/caesar.txt',
    type: 'terminal',
    flag: 'FLAG{caesar_shift_three}',
    xp: 100,
    hints: ['Try `cat /home/user/caesar.txt`', 'A Caesar shift of 3 moves every letter 3 positions back in the alphabet.'],
  },
  {
    id: '28',
    title: 'XOR Ciphertext',
    category: 'Cryptography',
    description:
      'A secret message was encrypted with a single-byte XOR key. The key is hidden in the filename.',
    objective: 'Use the known XOR key to decode /home/user/xor_secret.bin and recover the flag.',
    target: '/home/user/xor_secret.bin',
    type: 'terminal',
    flag: 'FLAG{xor_single_byte_k3y}',
    xp: 120,
    hints: ['Try `strings /home/user/xor_secret.bin`', 'The key is the single character `k`.'],
  },
];
