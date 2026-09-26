import { useEffect, useRef } from 'react';
import type { EdgeId, EdgeKind, NodeId, PacketKind } from '../../types';
import { EDGE_STAGE, topoDistance, isSubdued } from '../../data/architecture';
import { EDGE_FLOW } from '../../data/workflows';
import { useEngine } from '../../state/EngineContext';

interface EdgesProps {
  /** current simulation edge (or null) */
  activeEdge: EdgeId | null;
  /** changes per simulation step — re-fires the packet animation */
  packetKey: number;
  /** focus mode: edges touching these nodes stay lit */
  focusSet: Set<NodeId> | null;
  /** simulation running → non-active edges recede */
  simActive: boolean;
  motionAllowed: boolean;
  /** increments when a learning ships; fires a feedback-edge packet */
  feedbackPulse: number;
  /** hover/inspect callback for the edge tooltip */
  onHover?: (edge: EdgeId | null) => void;
}

const MARKER: Record<EdgeKind, string> = {
  data: 'url(#m-data)',
  action: 'url(#m-action)',
  feedback: 'url(#m-feedback)',
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (1 - t) * (1 - t) * 2);

interface ShapeEl {
  el: SVGElement | null;
  shape: 'circle' | 'rect';
  w: number;
  h: number;
}

export function Edges({
  activeEdge,
  packetKey,
  focusSet,
  simActive,
  motionAllowed,
  feedbackPulse,
  onHover,
}: EdgesProps) {
  const { selectEdge, selectedEdge, selected, stage, sim, graph } = useEngine();
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const busyRef = useRef(false);
  const simActiveRef = useRef(simActive);
  simActiveRef.current = simActive;
  const graphRef = useRef(graph);
  graphRef.current = graph;

  /* packet group — fully DOM-driven, never re-renders during flight */
  const groupRef = useRef<SVGGElement | null>(null);
  const labelBgRef = useRef<SVGRectElement | null>(null);
  const labelTextRef = useRef<SVGTextElement | null>(null);
  const shapes = useRef<ShapeEl[]>([]);

  const reg = (shape: 'circle' | 'rect', w: number, h: number) => (el: SVGElement | null) => {
    shapes.current = shapes.current.filter((s) => s.el !== el);
    if (el) shapes.current.push({ el, shape, w, h });
  };

  const place = (el: SVGElement | null, x: number, y: number) => {
    if (!el) return;
    const meta = shapes.current.find((s) => s.el === el);
    if (!meta) return;
    if (meta.shape === 'circle') {
      el.setAttribute('cx', String(x));
      el.setAttribute('cy', String(y));
    } else {
      el.setAttribute('x', String(x - meta.w / 2));
      el.setAttribute('y', String(y - meta.h / 2));
    }
  };

  const setLabel = (text: string | null) => {
    const t = labelTextRef.current;
    const bg = labelBgRef.current;
    if (!t || !bg) return;
    if (!text) {
      t.setAttribute('display', 'none');
      bg.setAttribute('display', 'none');
      return;
    }
    t.setAttribute('display', '');
    bg.setAttribute('display', '');
    t.textContent = text;
    const w = text.length * 5.1 + 14;
    bg.setAttribute('width', String(w));
    bg.setAttribute('height', '15');
  };

  const moveLabel = (x: number, y: number) => {
    const t = labelTextRef.current;
    const bg = labelBgRef.current;
    if (!t || !bg || t.getAttribute('display') === 'none') return;
    const w = Number(bg.getAttribute('width') ?? 60);
    const lx = Math.min(Math.max(x, w / 2 + 4), graphRef.current.w - w / 2 - 4);
    t.setAttribute('x', String(lx));
    t.setAttribute('y', String(y - 13));
    bg.setAttribute('x', String(lx - w / 2));
    bg.setAttribute('y', String(y - 25));
  };

  const runPacket = (edgeId: EdgeId, duration: number, opts?: { label?: string; ambient?: boolean }) => {
    const g = graphRef.current;
    const path = pathRefs.current.get(edgeId);
    const group = groupRef.current;
    if (!path || !group || busyRef.current) return;
    busyRef.current = true;
    /* the connector itself reacts while its event is in flight */
    path.classList.add('edge--live');
    const settlePath = () => path.classList.remove('edge--live');
    const len = path.getTotalLength();
    const spec = g.edges.find((e) => e.id === edgeId);
    const kind: PacketKind = spec?.flow ?? 'event';
    group.setAttribute('data-kind', kind);
    group.setAttribute('data-ambient', opts?.ambient ? '1' : '0');
    /* packets on not-yet-built connectors stay subdued at the current stage */
    const low = spec ? isSubdued(EDGE_STAGE[edgeId], stage) : false;
    group.setAttribute('data-low', low ? '1' : '0');
    setLabel(opts?.label ?? null);
    const groupOpacity = opts?.ambient ? '0.55' : low ? '0.4' : '1';

    if (!motionAllowed || len <= 0) {
      // reduced motion: brief highlight at the midpoint, then settle
      const mid = path.getPointAtLength(len / 2);
      shapes.current.forEach((s) => place(s.el, mid.x, mid.y));
      moveLabel(mid.x, mid.y);
      group.setAttribute('opacity', groupOpacity);
      const t = window.setTimeout(() => {
        group.setAttribute('opacity', '0');
        busyRef.current = false;
        settlePath();
      }, 700);
      return () => window.clearTimeout(t);
    }

    const t0 = performance.now();
    group.setAttribute('opacity', groupOpacity);
    let raf = 0;
    const tick = (now: number) => {
      const raw = Math.min((now - t0) / duration, 1);
      const t = easeInOut(raw);
      const pt = path.getPointAtLength(t * len);
      shapes.current.forEach((s) => place(s.el, pt.x, pt.y));
      moveLabel(pt.x, pt.y);
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        group.setAttribute('opacity', '0');
        busyRef.current = false;
        settlePath();
        /* arrival: destination node acknowledges (color follows packet kind) */
        const dest = spec ? document.querySelector(`[data-nodeid="${spec.to}"]`) : null;
        if (dest && !opts?.ambient) {
          dest.classList.add('node--recv', `recv-${kind}`);
          window.setTimeout(() => {
            dest.classList.remove('node--recv', `recv-${kind}`);
          }, 700);
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      group.setAttribute('opacity', '0');
      busyRef.current = false;
      settlePath();
    };
  };

  /* occasional ambient traffic — one semantic packet at a time, never a swarm */
  useEffect(() => {
    if (!motionAllowed) return;
    const order = graphRef.current.edges.map((e) => e.id);
    let i = Math.floor(Math.random() * order.length);
    const iv = window.setInterval(() => {
      if (simActiveRef.current || document.hidden) return;
      const id = order[i++ % order.length];
      runPacket(id, 2100, { ambient: true });
    }, 4200);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionAllowed, graph.id]);

  /* simulation step packet — labelled with the event it carries */
  useEffect(() => {
    if (!activeEdge) return;
    return runPacket(activeEdge, 1050, { label: EDGE_FLOW[activeEdge].event.split(' ·')[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packetKey, activeEdge]);

  /* learning returns to the orchestrator */
  useEffect(() => {
    if (feedbackPulse === 0) return;
    return runPacket('e-experiments-orch', 1300, { label: 'learning.shipped' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackPulse]);

  /* connector states: idle / focus grades / sim recede (neighbors stay legible) / hover */
  const stateCls = (from: NodeId, to: NodeId, id: EdgeId): string => {
    if (selectedEdge === id) return 'edge--selected';
    if (focusSet) return focusSet.has(from) && focusSet.has(to) ? '' : 'edge--dim';
    if (simActive) {
      if (id === activeEdge) return 'edge--active';
      const anchor = sim.activeNode;
      if (anchor && Math.min(topoDistance(anchor, from), topoDistance(anchor, to)) === 1) return 'edge--focus2';
      return 'edge--dim';
    }
    if (selected) {
      const d = Math.min(topoDistance(selected, from), topoDistance(selected, to));
      if (d === 0) return 'edge--focus1';
      if (d === 1) return 'edge--focus2';
      return 'edge--dim';
    }
    return '';
  };

  return (
    <svg
      className="edges-svg"
      width={graph.w}
      height={graph.h}
      viewBox={`0 0 ${graph.w} ${graph.h}`}
      aria-hidden="true"
    >
      <defs>
        <marker id="m-data" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path className="mk mk--data" d="M 0 1 L 7 4 L 0 7 Z" />
        </marker>
        <marker id="m-action" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path className="mk mk--action" d="M 0 1 L 7 4 L 0 7 Z" />
        </marker>
        <marker id="m-feedback" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path className="mk mk--feedback" d="M 0 1 L 7 4 L 0 7 Z" />
        </marker>
        <marker id="m-active" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse">
          <path className="mk mk--active" d="M 0 1 L 7 4 L 0 7 Z" />
        </marker>
      </defs>

      {graph.geoms.map((geom, i) => {
        const spec = graph.edges[i];
        const cls = ['edge', `edge--${geom.kind}`, stateCls(spec.from, spec.to, geom.id)].join(' ');
        return (
          <path
            key={geom.id}
            ref={(el) => {
              if (el) pathRefs.current.set(geom.id, el);
            }}
            className={cls}
            d={geom.d}
            data-stage={EDGE_STAGE[geom.id]}
            markerEnd={simActive && geom.id === activeEdge ? 'url(#m-active)' : MARKER[geom.kind]}
          />
        );
      })}

      {/* invisible wide hit-areas: every edge opens its workflow inspector */}
      {graph.geoms.map((geom) => (
        <path
          key={`hit-${geom.id}`}
          className="edge-hit"
          d={geom.d}
          tabIndex={0}
          role="button"
          aria-label={`Inspect workflow: ${EDGE_FLOW[geom.id].event}`}
          onClick={(e) => {
            e.stopPropagation();
            selectEdge(geom.id);
          }}
          onMouseEnter={() => onHover?.(geom.id)}
          onMouseLeave={() => onHover?.(null)}
          onFocus={() => onHover?.(geom.id)}
          onBlur={() => onHover?.(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              selectEdge(geom.id);
            }
          }}
        >
          <title>{`Inspect workflow — ${EDGE_FLOW[geom.id].event}`}</title>
        </path>
      ))}

      {graph.geoms.filter((g) => g.hasLabel).map((geom) => (
        <text
          key={`lbl-${geom.id}`}
          className="edge-label"
          x={geom.labelAt.x}
          y={geom.labelAt.y}
          transform={geom.labelVertical ? `rotate(-90 ${geom.labelAt.x} ${geom.labelAt.y})` : undefined}
          dominantBaseline="central"
        >
          {graph.edges.find((e) => e.id === geom.id)?.label}
        </text>
      ))}

      {/* semantic signal packet — shape follows what it carries */}
      <g ref={groupRef} className="packet-g" data-kind="event" data-ambient="0" opacity="0">
        <circle className="p-halo" r={8} cx={-30} cy={-30} />
        <circle className="p-trail p-t3" r={1.6} cx={-30} cy={-30} opacity={0.18} />
        <circle className="p-trail p-t2" r={2.2} cx={-30} cy={-30} opacity={0.32} />
        <circle className="p-trail p-t1" r={2.8} cx={-30} cy={-30} opacity={0.5} />
        <rect ref={reg('rect', 11, 6)} rx={3} className="p-main p-shape p-shape-event" width={11} height={6} x={-30} y={-30} />
        <rect ref={reg('rect', 7, 7)} rx={1.5} className="p-main p-shape p-shape-data" width={7} height={7} x={-30} y={-30} />
        <circle ref={reg('circle', 14, 14)} className="p-ring" r={7} cx={-30} cy={-30} />
        <circle ref={reg('circle', 8, 8)} className="p-main p-shape p-shape-ai" r={4} cx={-30} cy={-30} />
        <rect ref={reg('rect', 10, 6)} rx={3} className="p-main p-shape p-shape-action" width={10} height={6} x={-30} y={-30} />
        <circle ref={reg('circle', 8, 8)} className="p-main p-shape p-shape-result" r={4} cx={-30} cy={-30} />
        <circle ref={reg('circle', 9, 9)} className="p-main p-shape p-shape-learning" r={4.5} cx={-30} cy={-30} />
        <rect ref={labelBgRef} className="p-label-bg" rx={4} width={60} height={15} x={-30} y={-30} display="none" />
        <text ref={labelTextRef} className="p-label-text" textAnchor="middle" x={-30} y={-30} display="none" />
      </g>
    </svg>
  );
}
