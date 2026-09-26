import type { LifecycleLane } from '../types';

export const LANES: LifecycleLane[] = [
  {
    id: 'acquire',
    name: 'Acquire',
    color: 'var(--lane-acquire)',
    flow: 'ICP → research → meeting',
    scenario: 'acquisition',
  },
  {
    id: 'activate',
    name: 'Activate',
    color: 'var(--lane-activate)',
    flow: 'onboard → adopt → value',
    scenario: 'activation',
  },
  {
    id: 'retain',
    name: 'Retain',
    color: 'var(--lane-retain)',
    flow: 'monitor → intervene',
    scenario: 'retention',
  },
  {
    id: 'expand',
    name: 'Expand',
    color: 'var(--lane-expand)',
    flow: 'usage ↑ → new revenue',
    scenario: 'expansion',
  },
];

export const LANE_MAP: Record<string, LifecycleLane> = Object.fromEntries(LANES.map((l) => [l.id, l]));
