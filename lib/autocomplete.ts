import { VFSState, listNodes, resolveAbsolute } from './vfs';

const COMMANDS = [
  'aws',
  'base64',
  'cat',
  'cd',
  'chmod',
  'clear',
  'curl',
  'dirb',
  'echo',
  'exiftool',
  'find',
  'ftp',
  'gobuster',
  'grep',
  'help',
  'history',
  'john',
  'ls',
  'md5',
  'nmap',
  'pwd',
  'rm',
  'ssh',
  'strings',
  'submit-flag',
  'sudo',
  'touch',
  'vim',
  'whoami',
  'GetUserSPNs.py',
  'GetUserSPNs',
  'impacket-GetUserSPNs.py',
];

export interface AutocompleteResult {
  newInput?: string;
  output?: string;
}

export function autocomplete(input: string, vfs: VFSState): AutocompleteResult {
  const trimmed = input;
  const firstSpace = trimmed.indexOf(' ');

  // command completion
  if (firstSpace === -1) {
    const matches = COMMANDS.filter((c) => c.startsWith(trimmed));
    if (matches.length === 1) {
      return { newInput: matches[0] + ' ' };
    }
    if (matches.length > 1) {
      return { output: matches.join('  ') };
    }
    return {};
  }

  // path completion on the last token
  const beforeLast = trimmed.slice(0, trimmed.length - (trimmed.endsWith(' ') ? 0 : 1)); // not used
  // split at the last space to get the last token
  const lastSpace = trimmed.lastIndexOf(' ');
  const prefix = trimmed.slice(0, lastSpace + 1);
  const token = trimmed.slice(lastSpace + 1);

  const slashIndex = token.lastIndexOf('/');
  const dirPart = slashIndex >= 0 ? token.slice(0, slashIndex + 1) : '';
  const base = slashIndex >= 0 ? token.slice(slashIndex + 1) : token;

  const searchDir = resolveAbsolute(vfs.cwd, dirPart || '.');
  const showHidden = base.startsWith('.');
  const entries = listNodes(vfs.root, vfs.cwd, searchDir, showHidden);
  if (!entries) return {};

  const matches = entries
    .filter((e) => e.name.startsWith(base))
    .map((e) => `${dirPart}${e.name}${e.node.type === 'dir' ? '/' : ''}`);

  if (matches.length === 1) {
    return { newInput: prefix + matches[0] };
  }

  if (matches.length > 1) {
    const common = matches.reduce((acc, m) => {
      let i = 0;
      while (i < acc.length && i < m.length && acc[i] === m[i]) i++;
      return acc.slice(0, i);
    });
    if (common.length > base.length) {
      return { newInput: prefix + dirPart + common };
    }
    return { output: matches.join('  ') };
  }

  return {};
}
