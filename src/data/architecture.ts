import type { EdgeId, NodeId, ViewStage } from '../types';
import { getLayout } from './layouts';

/**
 * Topology & build-progression metadata — node/edge identity is stable across
 * graph layouts, so these maps are layout-independent. The layouts themselves
 * (rects + edge routing per variant) live in `layouts.ts`.
 */

export const NODE_STAGE: Record<NodeId, ViewStage> = {
  'signals-1p': 'mvp',
  'account-graph': 'mvp',
  orchestrator: 'mvp',
  channels: 'mvp',
  human: 'mvp',
  outcomes: 'mvp',
  'signals-ext': 'scale',
  lifecycle: 'scale',
  experiments: 'scale',
  governance: 'mvp',
};

export const EDGE_STAGE: Record<EdgeId, ViewStage> = {
  'e-signals-1p': 'mvp',
  'e-graph-orch': 'mvp',
  'e-orch-lanes': 'mvp',
  'e-lanes-channels': 'mvp',
  'e-channels-human': 'mvp',
  'e-human-outcomes': 'mvp',
  'e-channels-outcomes': 'mvp',
  'e-signals-ext': 'scale',
  'e-outcomes-experiments': 'scale',
  'e-experiments-orch': 'scale',
};

const STAGE_RANK: Record<ViewStage, number> = { mvp: 0, scale: 1, vision: 2 };
export function stageRank(s: ViewStage): number {
  return STAGE_RANK[s];
}
/** true when the element is not yet switched on at the current stage */
export function isSubdued(elementStage: ViewStage, current: ViewStage): boolean {
  return stageRank(elementStage) > stageRank(current);
}

/** Direct adjacency for topology focus mode (identical across layouts). */
export const NEIGHBORS: Record<NodeId, NodeId[]> = (() => {
  const canonical = getLayout('columns');
  const map = Object.fromEntries(canonical.nodes.map((n) => [n.id, [] as NodeId[]])) as Record<NodeId, NodeId[]>;
  for (const e of canonical.edges) {
    if (!map[e.from].includes(e.to)) map[e.from].push(e.to);
    if (!map[e.to].includes(e.from)) map[e.to].push(e.from);
  }
  return map;
})();

/** 0 = self, 1 = direct dependency, 2 = second-order, 9 = unrelated. */
export function topoDistance(from: NodeId, to: NodeId): number {
  if (from === to) return 0;
  if (NEIGHBORS[from].includes(to)) return 1;
  for (const n of NEIGHBORS[from]) {
    if (NEIGHBORS[n].includes(to)) return 2;
  }
  return 9;
}
