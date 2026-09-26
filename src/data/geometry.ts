import type { EdgeGeom, EdgeSpec, Pt, Rect, Side, SystemNode } from '../types';

/** Point on the border of a rect for a given side + fraction along that side. */
export function anchor(r: Rect, side: Side, offset = 0.5): Pt {
  switch (side) {
    case 'top':
      return { x: r.x + r.w * offset, y: r.y };
    case 'bottom':
      return { x: r.x + r.w * offset, y: r.y + r.h };
    case 'left':
      return { x: r.x, y: r.y + r.h * offset };
    case 'right':
      return { x: r.x + r.w, y: r.y + r.h * offset };
  }
}

/** Outward normal of a side — control points extend along these. */
function normal(side: Side): Pt {
  switch (side) {
    case 'top':
      return { x: 0, y: -1 };
    case 'bottom':
      return { x: 0, y: 1 };
    case 'left':
      return { x: -1, y: 0 };
    case 'right':
      return { x: 1, y: 0 };
  }
}

function cubicAt(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y,
  };
}

function buildPath(spec: EdgeSpec, nodeMap: Record<string, SystemNode>): { d: string; mid: Pt } {
  const from = nodeMap[spec.from];
  const to = nodeMap[spec.to];
  const a = anchor(from.rect, spec.fromSide, spec.fromOffset ?? 0.5);
  const b = anchor(to.rect, spec.toSide, spec.toOffset ?? 0.5);

  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const auto = Math.min(Math.max(dist * 0.42, 14), 110);
  const c = spec.cLen ?? auto;

  const n1 = normal(spec.fromSide);
  const n2 = normal(spec.toSide);
  const c1 = { x: a.x + n1.x * c, y: a.y + n1.y * c };
  const c2 = { x: b.x + n2.x * c, y: b.y + n2.y * c };

  return {
    d: `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
    mid: cubicAt(a, c1, c2, b, 0.5),
  };
}

/** Edge geometry computed for a specific layout — cached per layout id upstream. */
export function computeGeoms(
  edges: EdgeSpec[],
  nodeMap: Record<string, SystemNode>,
): EdgeGeom[] {
  return edges.map((spec) => {
    const { d, mid } = buildPath(spec, nodeMap);
    return {
      id: spec.id,
      kind: spec.kind,
      d,
      labelAt: { x: mid.x + (spec.labelDx ?? 0), y: mid.y + (spec.labelDy ?? 0) },
      hasLabel: Boolean(spec.label),
      labelVertical: spec.labelVertical ?? false,
    };
  });
}
