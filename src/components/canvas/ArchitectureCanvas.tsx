import { useEffect, useMemo, useState } from 'react';
import { EDGE_FLOW } from '../../data/workflows';
import type { EdgeId } from '../../types';
import { useElementSize } from '../../hooks/useElementSize';
import { useEngine } from '../../state/EngineContext';
import { NodeShell } from './NodeShell';
import { Edges } from './Edges';
import { GovernanceBar } from './GovernanceBar';
import { SignalsNode } from './nodeviews/SignalsNode';
import { AccountGraphNode } from './nodeviews/AccountGraphNode';
import { OrchestratorNode } from './nodeviews/OrchestratorNode';
import { ChannelsNode, ExperimentsNode, HumanNode, LifecycleNode, OutcomesNode } from './nodeviews/ExecutionNodes';
import { VerticalFlow } from '../compact/VerticalFlow';
import { SCENARIO_MAP } from '../../data/simulations';

export function ArchitectureCanvas() {
  const { sim, focusNodes, motionAllowed, feedbackPulse, compact, setCompact, graph } = useEngine();
  const [stageRef, size] = useElementSize<HTMLDivElement>();
  const [hoverEdge, setHoverEdge] = useState<EdgeId | null>(null);

  useEffect(() => {
    setCompact(size.w > 0 && size.w < 760);
  }, [size.w, setCompact]);

  const scale = Math.min(size.w / graph.w, size.h / graph.h, 1);
  const focusSet = useMemo(() => (focusNodes ? new Set(focusNodes) : null), [focusNodes]);

  const step = sim.status !== 'idle' && sim.scenarioId ? SCENARIO_MAP[sim.scenarioId].steps[sim.stepIndex] : null;
  const microRect = step?.micro ? graph.nodeMap[step.node].rect : null;

  /* tooltip anchor in unscaled stage coords */
  const tipInfo = (() => {
    if (!hoverEdge) return null;
    const flow = EDGE_FLOW[hoverEdge];
    if (!flow) return null;
    const geom = graph.geoms.find((g) => g.id === hoverEdge);
    if (!geom) return null;
    return {
      flow,
      pos: { x: (geom.labelAt.x - graph.w / 2) * scale, y: (geom.labelAt.y - graph.h / 2) * scale },
    };
  })();

  return (
    <div className="stage" ref={stageRef}>
      {size.w === 0 ? null : compact ? (
        <VerticalFlow />
      ) : (
        <>
          <div
            key={graph.id}
            className="stage-inner"
            style={{
              width: graph.w,
              height: graph.h,
              marginLeft: -graph.w / 2,
              marginTop: -graph.h / 2,
              transform: `scale(${scale})`,
            }}
          >
            <Edges
              activeEdge={sim.activeEdge}
              packetKey={sim.stepIndex}
              focusSet={focusSet}
              simActive={sim.status === 'running' || sim.status === 'paused'}
              motionAllowed={motionAllowed}
              feedbackPulse={feedbackPulse}
              onHover={setHoverEdge}
            />

            <NodeShell id="signals-1p" bootIndex={0} label="First-party signals — website, product, CRM, marketing, sales, support, email, activity, spend">
              <SignalsNode groupId="signals-1p" />
            </NodeShell>

            <NodeShell id="signals-ext" bootIndex={1} label="External signals — company data, funding, hiring, firmographics, technographics, intent, market">
              <SignalsNode groupId="signals-ext" />
            </NodeShell>

            <NodeShell id="account-graph" bootIndex={2} label="Account Graph — company-level memory with identity resolution, enrichment and scoring">
              <AccountGraphNode />
            </NodeShell>

            <NodeShell id="orchestrator" bootIndex={3} className="node--orch" label="AI Growth Orchestrator — who matters, why now, what to do, which channel">
              <OrchestratorNode />
            </NodeShell>

            <NodeShell id="lifecycle" bootIndex={4} label="Growth lifecycle — acquire, activate, retain, expand playbooks">
              <LifecycleNode />
            </NodeShell>

            <NodeShell id="channels" bootIndex={5} label="Channel orchestration — email, WhatsApp, in-product, CRM tasks, alerts, paid, human outreach">
              <ChannelsNode />
            </NodeShell>

            <NodeShell id="human" bootIndex={6} label="Human-in-the-loop — approval gates for consequential actions">
              <HumanNode />
            </NodeShell>

            <NodeShell id="outcomes" bootIndex={7} label="Outcomes — pipeline, adoption and revenue influenced">
              <OutcomesNode />
            </NodeShell>

            <NodeShell id="experiments" bootIndex={8} label="Experimentation and measurement — the learning loop">
              <ExperimentsNode />
            </NodeShell>

            <GovernanceBar bootIndex={9} />

            {/* micro-event: a tiny consequence appearing at the node where it lands */}
            {step?.micro && microRect ? (
              <div
                key={`${sim.stepIndex}-${step.micro}`}
                className={`micro-chip mono${step.microTone === 'blocked' ? ' micro-chip--blocked' : ''}`}
                style={{ left: microRect.x + microRect.w, top: microRect.y - 2 }}
              >
                {step.micro}
              </div>
            ) : null}
          </div>

          {/* edge hover preview — unscaled so it stays readable at any zoom */}
          {tipInfo ? (
            <div
              className="edge-tip"
              style={{ left: `calc(50% + ${tipInfo.pos.x}px)`, top: `calc(50% + ${tipInfo.pos.y}px)` }}
            >
              <span className="edge-tip-event mono">{tipInfo.flow.event}</span>
              <span className="edge-tip-meta">
                {tipInfo.flow.latency} · {tipInfo.flow.mode}
              </span>
              <span className="edge-tip-open">click to inspect workflow</span>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
