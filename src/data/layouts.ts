import type { EdgeGeom, EdgeSpec, NodeId, SystemNode } from '../types';
import { computeGeoms } from './geometry';

export type LayoutId = 'columns' | 'orbit' | 'loop';

export interface LayoutDef {
  id: LayoutId;
  nodes: SystemNode[];
  edges: EdgeSpec[];
  w: number;
  h: number;
  geoms: EdgeGeom[];
  nodeMap: Record<string, SystemNode>;
}

function mk(id: LayoutId, w: number, h: number, nodes: SystemNode[], edges: EdgeSpec[]): LayoutDef {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, SystemNode>;
  return { id, w, h, nodes, edges, geoms: computeGeoms(edges, nodeMap), nodeMap };
}

/* ------------------------------ V1 · COLUMNS ------------------------------ */

const COLUMNS_NODES: SystemNode[] = [
  { id: 'signals-1p', kind: 'sources', title: 'First-party signals', rect: { x: 8, y: 26, w: 200, h: 318 } },
  { id: 'signals-ext', kind: 'sources', title: 'External signals', rect: { x: 8, y: 366, w: 200, h: 246 } },
  { id: 'account-graph', kind: 'intelligence', title: 'Account Graph', rect: { x: 246, y: 140, w: 208, h: 452 } },
  { id: 'orchestrator', kind: 'decision', title: 'AI Growth Orchestrator', rect: { x: 492, y: 92, w: 262, h: 512 } },
  { id: 'lifecycle', kind: 'execution', title: 'Growth lifecycle', rect: { x: 790, y: 26, w: 284, h: 172 } },
  { id: 'channels', kind: 'execution', title: 'Channel orchestration', rect: { x: 790, y: 218, w: 284, h: 132 } },
  { id: 'human', kind: 'execution', title: 'Human-in-the-loop', rect: { x: 790, y: 370, w: 284, h: 174 } },
  { id: 'outcomes', kind: 'outcome', title: 'Pipeline · adoption · revenue', rect: { x: 790, y: 564, w: 284, h: 116 } },
  { id: 'experiments', kind: 'learning', title: 'Experimentation & measurement', rect: { x: 492, y: 624, w: 262, h: 106 } },
  { id: 'governance', kind: 'control', title: 'Governance', rect: { x: 8, y: 738, w: 1064, h: 40 } },
];

const COLUMNS_EDGES: EdgeSpec[] = [
  { id: 'e-signals-1p', from: 'signals-1p', fromSide: 'right', fromOffset: 0.5, to: 'account-graph', toSide: 'left', toOffset: 0.28, kind: 'data', flow: 'event', particles: 0 },
  { id: 'e-signals-ext', from: 'signals-ext', fromSide: 'right', fromOffset: 0.5, to: 'account-graph', toSide: 'left', toOffset: 0.74, kind: 'data', flow: 'data', particles: 0 },
  { id: 'e-graph-orch', from: 'account-graph', fromSide: 'right', fromOffset: 0.5, to: 'orchestrator', toSide: 'left', toOffset: 0.5, kind: 'data', flow: 'ai', label: 'account intelligence', labelVertical: true, particles: 0 },
  { id: 'e-orch-lanes', from: 'orchestrator', fromSide: 'right', fromOffset: 0.3, to: 'lifecycle', toSide: 'left', toOffset: 0.3, kind: 'action', flow: 'action', label: 'next best action', labelVertical: true, labelDy: 36, particles: 0 },
  { id: 'e-lanes-channels', from: 'lifecycle', fromSide: 'bottom', fromOffset: 0.25, to: 'channels', toSide: 'top', toOffset: 0.25, kind: 'action', flow: 'action', particles: 0 },
  { id: 'e-channels-human', from: 'channels', fromSide: 'bottom', fromOffset: 0.5, to: 'human', toSide: 'top', toOffset: 0.5, kind: 'action', flow: 'governance', label: 'approval gates', particles: 0 },
  { id: 'e-human-outcomes', from: 'human', fromSide: 'bottom', fromOffset: 0.5, to: 'outcomes', toSide: 'top', toOffset: 0.5, kind: 'action', flow: 'result', particles: 0 },
  { id: 'e-channels-outcomes', from: 'channels', fromSide: 'left', fromOffset: 0.72, to: 'outcomes', toSide: 'left', toOffset: 0.8, kind: 'action', flow: 'result', label: 'low-risk · automated', labelVertical: true, labelDx: -6, cLen: 34, particles: 0 },
  { id: 'e-outcomes-experiments', from: 'outcomes', fromSide: 'left', fromOffset: 0.3, to: 'experiments', toSide: 'top', toOffset: 0.8, kind: 'data', flow: 'result', label: 'results measured', labelVertical: true, labelDx: 42, particles: 0 },
  { id: 'e-experiments-orch', from: 'experiments', fromSide: 'left', fromOffset: 0.3, to: 'orchestrator', toSide: 'left', toOffset: 0.82, kind: 'feedback', flow: 'learning', label: 'learnings', labelVertical: true, labelDy: 26, cLen: 34, particles: 0 },
];

/* ------------------------------ V2 · ORBIT ------------------------------ */

const ORBIT_NODES: SystemNode[] = [
  { id: 'signals-1p', kind: 'sources', title: 'First-party signals', rect: { x: 40, y: 20, w: 230, h: 310 } },
  { id: 'signals-ext', kind: 'sources', title: 'External signals', rect: { x: 300, y: 20, w: 240, h: 220 } },
  { id: 'account-graph', kind: 'intelligence', title: 'Account Graph', rect: { x: 30, y: 340, w: 250, h: 460 } },
  { id: 'orchestrator', kind: 'decision', title: 'AI Growth Orchestrator', rect: { x: 560, y: 150, w: 280, h: 500 } },
  { id: 'lifecycle', kind: 'execution', title: 'Growth lifecycle', rect: { x: 880, y: 20, w: 330, h: 172 } },
  { id: 'channels', kind: 'execution', title: 'Channel orchestration', rect: { x: 930, y: 212, w: 290, h: 150 } },
  { id: 'human', kind: 'execution', title: 'Human-in-the-loop', rect: { x: 920, y: 382, w: 300, h: 280 } },
  { id: 'outcomes', kind: 'outcome', title: 'Pipeline · adoption · revenue', rect: { x: 560, y: 682, w: 340, h: 130 } },
  { id: 'experiments', kind: 'learning', title: 'Experimentation & measurement', rect: { x: 240, y: 682, w: 240, h: 130 } },
  { id: 'governance', kind: 'control', title: 'Governance', rect: { x: 30, y: 828, w: 1190, h: 32 } },
];

const ORBIT_EDGES: EdgeSpec[] = [
  { id: 'e-signals-1p', from: 'signals-1p', fromSide: 'bottom', fromOffset: 0.4, to: 'account-graph', toSide: 'top', toOffset: 0.3, kind: 'data', flow: 'event', particles: 0 },
  { id: 'e-signals-ext', from: 'signals-ext', fromSide: 'bottom', fromOffset: 0.6, to: 'account-graph', toSide: 'top', toOffset: 0.75, kind: 'data', flow: 'data', particles: 0 },
  { id: 'e-graph-orch', from: 'account-graph', fromSide: 'right', fromOffset: 0.4, to: 'orchestrator', toSide: 'left', toOffset: 0.45, kind: 'data', flow: 'ai', label: 'account intelligence', labelDy: -34, particles: 0 },
  { id: 'e-orch-lanes', from: 'orchestrator', fromSide: 'right', fromOffset: 0.12, to: 'lifecycle', toSide: 'left', toOffset: 0.5, kind: 'action', flow: 'action', label: 'next best action', labelVertical: true, particles: 0 },
  { id: 'e-lanes-channels', from: 'lifecycle', fromSide: 'bottom', fromOffset: 0.35, to: 'channels', toSide: 'top', toOffset: 0.35, kind: 'action', flow: 'action', particles: 0 },
  { id: 'e-channels-human', from: 'channels', fromSide: 'bottom', fromOffset: 0.4, to: 'human', toSide: 'top', toOffset: 0.5, kind: 'action', flow: 'governance', label: 'approval gates', labelDx: 46, particles: 0 },
  { id: 'e-channels-outcomes', from: 'channels', fromSide: 'left', fromOffset: 0.8, to: 'outcomes', toSide: 'right', toOffset: 0.35, kind: 'action', flow: 'result', label: 'low-risk · automated', labelVertical: true, labelDx: -12, particles: 0 },
  { id: 'e-human-outcomes', from: 'human', fromSide: 'left', fromOffset: 0.6, to: 'outcomes', toSide: 'right', toOffset: 0.75, kind: 'action', flow: 'result', particles: 0 },
  { id: 'e-outcomes-experiments', from: 'outcomes', fromSide: 'left', fromOffset: 0.4, to: 'experiments', toSide: 'right', toOffset: 0.5, kind: 'data', flow: 'result', label: 'results measured', labelVertical: true, particles: 0 },
  { id: 'e-experiments-orch', from: 'experiments', fromSide: 'top', fromOffset: 0.5, to: 'orchestrator', toSide: 'bottom', toOffset: 0.25, kind: 'feedback', flow: 'learning', label: 'learnings', labelDx: 30, labelDy: 8, particles: 0 },
];

/* ------------------------------ V3 · LOOP ------------------------------ */

const LOOP_NODES: SystemNode[] = [
  { id: 'governance', kind: 'control', title: 'Governance', rect: { x: 8, y: 8, w: 1064, h: 36 } },
  { id: 'signals-1p', kind: 'sources', title: 'First-party signals', rect: { x: 8, y: 56, w: 200, h: 330 } },
  { id: 'signals-ext', kind: 'sources', title: 'External signals', rect: { x: 8, y: 406, w: 200, h: 250 } },
  { id: 'account-graph', kind: 'intelligence', title: 'Account Graph', rect: { x: 232, y: 96, w: 208, h: 452 } },
  { id: 'orchestrator', kind: 'decision', title: 'AI Growth Orchestrator', rect: { x: 464, y: 56, w: 262, h: 530 } },
  { id: 'lifecycle', kind: 'execution', title: 'Growth lifecycle', rect: { x: 756, y: 56, w: 316, h: 168 } },
  { id: 'channels', kind: 'execution', title: 'Channel orchestration', rect: { x: 756, y: 244, w: 316, h: 132 } },
  { id: 'human', kind: 'execution', title: 'Human-in-the-loop', rect: { x: 756, y: 396, w: 316, h: 174 } },
  { id: 'outcomes', kind: 'outcome', title: 'Pipeline · adoption · revenue', rect: { x: 756, y: 590, w: 316, h: 130 } },
  { id: 'experiments', kind: 'learning', title: 'Experimentation & measurement', rect: { x: 464, y: 616, w: 262, h: 110 } },
];

const LOOP_EDGES: EdgeSpec[] = [
  { id: 'e-signals-1p', from: 'signals-1p', fromSide: 'right', fromOffset: 0.4, to: 'account-graph', toSide: 'left', toOffset: 0.25, kind: 'data', flow: 'event', particles: 0 },
  { id: 'e-signals-ext', from: 'signals-ext', fromSide: 'right', fromOffset: 0.5, to: 'account-graph', toSide: 'left', toOffset: 0.74, kind: 'data', flow: 'data', particles: 0 },
  { id: 'e-graph-orch', from: 'account-graph', fromSide: 'right', fromOffset: 0.5, to: 'orchestrator', toSide: 'left', toOffset: 0.5, kind: 'data', flow: 'ai', particles: 0 },
  { id: 'e-orch-lanes', from: 'orchestrator', fromSide: 'right', fromOffset: 0.3, to: 'lifecycle', toSide: 'left', toOffset: 0.3, kind: 'action', flow: 'action', particles: 0 },
  { id: 'e-lanes-channels', from: 'lifecycle', fromSide: 'bottom', fromOffset: 0.25, to: 'channels', toSide: 'top', toOffset: 0.25, kind: 'action', flow: 'action', particles: 0 },
  { id: 'e-channels-human', from: 'channels', fromSide: 'bottom', fromOffset: 0.5, to: 'human', toSide: 'top', toOffset: 0.5, kind: 'action', flow: 'governance', label: 'approval gates', labelDy: 0, particles: 0 },
  { id: 'e-human-outcomes', from: 'human', fromSide: 'bottom', fromOffset: 0.5, to: 'outcomes', toSide: 'top', toOffset: 0.5, kind: 'action', flow: 'result', particles: 0 },
  { id: 'e-channels-outcomes', from: 'channels', fromSide: 'left', fromOffset: 0.72, to: 'outcomes', toSide: 'left', toOffset: 0.8, kind: 'action', flow: 'result', cLen: 34, particles: 0 },
  { id: 'e-outcomes-experiments', from: 'outcomes', fromSide: 'left', fromOffset: 0.3, to: 'experiments', toSide: 'right', toOffset: 0.4, kind: 'data', flow: 'result', particles: 0 },
  { id: 'e-experiments-orch', from: 'experiments', fromSide: 'top', fromOffset: 0.4, to: 'orchestrator', toSide: 'bottom', toOffset: 0.15, kind: 'feedback', flow: 'learning', particles: 0 },
];

/* ------------------------------ registry ------------------------------ */

const CACHE = new Map<LayoutId, LayoutDef>();

export function getLayout(id: LayoutId): LayoutDef {
  const hit = CACHE.get(id);
  if (hit) return hit;
  const def =
    id === 'orbit'
      ? mk('orbit', 1240, 860, ORBIT_NODES, ORBIT_EDGES)
      : id === 'loop'
        ? mk('loop', 1080, 780, LOOP_NODES, LOOP_EDGES)
        : mk('columns', 1080, 780, COLUMNS_NODES, COLUMNS_EDGES);
  CACHE.set(id, def);
  return def;
}

export const LAYOUTS: { id: LayoutId; label: string }[] = [
  { id: 'columns', label: 'Columns' },
  { id: 'orbit', label: 'Orbit' },
  { id: 'loop', label: 'Loop' },
];

/** Node display titles are layout-independent. */
export const NODE_TITLES: Record<NodeId, string> = Object.fromEntries(
  COLUMNS_NODES.map((n) => [n.id, n.title]),
) as Record<NodeId, string>;

/** The canonical left-to-right story order used by the compact vertical flow. */
export const FLOW_ORDER: NodeId[] = [
  'signals-1p',
  'signals-ext',
  'account-graph',
  'orchestrator',
  'lifecycle',
  'channels',
  'human',
  'outcomes',
  'experiments',
];
