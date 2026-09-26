import type { CSSProperties, ReactNode } from 'react';
import type { NodeId, ViewStage } from '../../types';
import { NODE_STAGE, isSubdued, topoDistance } from '../../data/architecture';
import { useEngine } from '../../state/EngineContext';

interface NodeShellProps {
  id: NodeId;
  label: string;
  className?: string;
  style?: CSSProperties;
  bootIndex?: number;
  children: ReactNode;
}

/**
 * Shared frame for every architecture node: position comes from the ACTIVE
 * LAYOUT via context, so the same component renders in every graph variant.
 */
export function NodeShell({ id, label, className = '', style, bootIndex = 0, children }: NodeShellProps) {
  const { selected, select, sim, focusNodes, graph, stage, t } = useEngine();
  const rect = graph.nodeMap[id].rect;

  /* explicit status, not just opacity: elements not yet built at this stage */
  const subduedStage: ViewStage | null =
    id !== 'governance' && isSubdued(NODE_STAGE[id], stage) ? NODE_STAGE[id] : null;

  const isActive = sim.status !== 'idle' && sim.status !== 'done' && sim.activeNode === id;
  const isSelected = selected === id;

  /* during a run, direct neighbors of the active node stay legible (related ≈ 75%) */
  const simLive = sim.status === 'running' || sim.status === 'paused';
  const simNear = simLive && sim.activeNode !== null && topoDistance(sim.activeNode, id) === 1;

  /* topology focus: selecting a node reveals its upstream/downstream context */
  let topoCls = '';
  if (selected !== null && !focusNodes && sim.status === 'idle' && id !== 'governance') {
    const d = topoDistance(selected, id);
    if (d === 1) topoCls = 'node--near';
    else if (d === 2) topoCls = 'node--mid';
    else if (d > 2) topoCls = 'node--far';
  }

  const dimmed =
    id !== 'governance' &&
    !isActive &&
    !simNear &&
    !topoCls &&
    (focusNodes ? !focusNodes.includes(id) : simLive);

  const cls = [
    'node',
    className,
    isActive ? 'node--active' : '',
    isSelected && !isActive ? 'node--selected' : '',
    simNear ? 'node--near' : '',
    topoCls,
    dimmed ? 'node--dim' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      role="button"
      tabIndex={0}
      data-nodeid={id}
      data-stage={NODE_STAGE[id]}
      aria-label={label}
      aria-pressed={isSelected}
      className={cls}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, '--boot': bootIndex, ...style } as CSSProperties}
      onClick={() => select(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select(id);
        }
      }}
    >
      {subduedStage ? (
        <span className="node-later" title={t('later.tip')}>
          {t('later')} · {subduedStage === 'scale' ? t('stage.scale') : t('stage.vision')}
        </span>
      ) : null}
      {children}
    </div>
  );
}
