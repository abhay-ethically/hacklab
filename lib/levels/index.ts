import { WALKTHROUGHS } from '../walkthroughs';
import { ad } from './ad';
import { cloud } from './cloud';
import { crypto } from './crypto';
import { forensics } from './forensics';
import { linux } from './linux';
import { network } from './network';
import { recon } from './recon';
import { web } from './web';

export type LevelType = 'terminal' | 'web';

export interface WebComponentSpec {
  type: string;
  data: Record<string, any>;
}

export interface Level {
  id: string;
  title: string;
  category: string;
  description: string;
  objective: string;
  target: string;
  type: LevelType;
  flag: string;
  xp: number;
  hints: string[];
  guide?: string[];
  webComponent?: WebComponentSpec;
}

export const levels: Level[] = [...recon, ...linux, ...crypto, ...network, ...web, ...cloud, ...forensics, ...ad].sort(
  (a, b) => parseInt(a.id) - parseInt(b.id)
);

export function getLevel(id: string): Level | undefined {
  const l = levels.find((l) => l.id === id);
  return l ? { ...l, guide: WALKTHROUGHS[id] } : undefined;
}
