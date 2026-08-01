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
];
