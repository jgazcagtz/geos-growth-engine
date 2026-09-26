import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { NODE_TITLES } from '../../data/layouts';
import { WORKFLOW_MAP } from '../../data/workflows';
import { SCENARIO_MAP } from '../../data/simulations';
import { useEngine } from '../../state/EngineContext';
import { MetricsHome } from './MetricsHome';
import { NodeDetail } from './NodeDetail';
import { WorkflowInspector } from './WorkflowInspector';
import { InspectView } from './InspectView';
import { ExecHome } from './ExecHome';

export function DetailPanel() {
  const { selected, selectedEdge, inspectStep, closePanel, panelOpen, motionAllowed, mode, sim, t } = useEngine();
  const bodyRef = useRef<HTMLDivElement>(null);

  const viewKey = selectedEdge ? `wf-${selectedEdge}` : inspectStep !== null ? `inspect-${inspectStep}` : (selected ?? 'home');

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [viewKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel]);

  let eyebrow = 'Growth operating system';
  let title = mode === 'executive' ? t('panel.exec') : t('panel.home');
  if (selected) {
    eyebrow = t('panel.node');
    title = NODE_TITLES[selected];
  } else if (selectedEdge) {
    eyebrow = t('panel.wf');
    title = WORKFLOW_MAP[selectedEdge].name;
  } else if (inspectStep !== null && sim.scenarioId) {
    eyebrow = t('panel.event');
    title = SCENARIO_MAP[sim.scenarioId].steps[Math.min(inspectStep, SCENARIO_MAP[sim.scenarioId].steps.length - 1)].title;
  }

  return (
    <aside className={`panel-col${panelOpen ? ' open' : ''}`} aria-label="Details panel">
      <div className="panel-head">
        <div>
          <div className="panel-eyebrow">{eyebrow}</div>
          <div className="panel-title">{title}</div>
        </div>
        <button type="button" className="btn btn-icon panel-close" onClick={closePanel} aria-label="Close details panel">
          <X size={14} aria-hidden />
        </button>
      </div>
      <div className="panel-body" ref={bodyRef}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={viewKey}
            initial={motionAllowed ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionAllowed ? { opacity: 0, y: -6 } : undefined}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {selectedEdge ? (
              <WorkflowInspector edge={selectedEdge} />
            ) : inspectStep !== null ? (
              <InspectView />
            ) : selected ? (
              <NodeDetail id={selected} />
            ) : mode === 'executive' ? (
              <ExecHome />
            ) : (
              <MetricsHome />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
}
