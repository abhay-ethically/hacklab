import { Level } from '.';

export const ad: Level[] = [
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
];
