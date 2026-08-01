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
  {
    id: '29',
    title: 'AS-REP Roasting',
    category: 'Active Directory',
    description:
      'A user account does not require Kerberos pre-authentication. Request an AS-REP and crack it offline.',
    objective: 'Use GetNPUsers to retrieve the crackable AS-REP for a no-preauth account.',
    target: 'victim@CORP.LOCAL',
    type: 'terminal',
    flag: 'FLAG{asrep_roast_g0lden}',
    xp: 140,
    hints: [
      'Run `impacket-GetNPUsers.py -dc-ip 10.0.0.10 -request CORP.LOCAL/victim`',
      'Accounts with "Do not require Kerberos preauthentication" are vulnerable.',
    ],
  },
];
