import { motion } from 'framer-motion';
import type { NodeId } from '../../types';
import {
  Activity,
  Ban,
  CheckCircle2,
  EyeOff,
  Fingerprint,
  Lock,
  ScrollText,
  ShieldCheck,
  Timer,
  UserCog,
} from 'lucide-react';
import { useEngine } from '../../state/EngineContext';

/** Each control maps to the nodes where it is enforced — hover to see it. */
const CONTROLS: { key: string; label: string; icon: typeof Lock; protects: NodeId[] }[] = [
  { key: 'rbac', label: 'RBAC', icon: Lock, protects: ['human', 'orchestrator'] },
  { key: 'audit', label: 'Audit logs', icon: ScrollText, protects: ['human', 'outcomes', 'experiments'] },
  { key: 'consent', label: 'Consent', icon: CheckCircle2, protects: ['signals-1p', 'channels'] },
  { key: 'pii', label: 'PII protection', icon: Fingerprint, protects: ['signals-1p', 'account-graph'] },
  { key: 'privacy', label: 'Data privacy', icon: EyeOff, protects: ['signals-ext', 'account-graph'] },
  { key: 'gates', label: 'Approval gates', icon: ShieldCheck, protects: ['human', 'orchestrator'] },
  { key: 'caps', label: 'Frequency caps', icon: Timer, protects: ['channels'] },
  { key: 'suppression', label: 'Suppression', icon: Ban, protects: ['orchestrator', 'channels'] },
  { key: 'monitor', label: 'Model monitoring', icon: Activity, protects: ['orchestrator', 'experiments'] },
  { key: 'review', label: 'Human review', icon: UserCog, protects: ['human'] },
];

export function GovernanceBar({ bootIndex = 0 }: { bootIndex?: number }) {
  const { selected, select, setHighlight, motionAllowed, graph, t } = useEngine();
  const rect = graph.nodeMap.governance.rect;
  const isSelected = selected === 'governance';

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Governance layer — controls that apply to every layer of the engine"
      aria-pressed={isSelected}
      className={`gov-bar${isSelected ? ' node--selected' : ''}`}
      style={{ position: 'absolute', left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
      initial={motionAllowed ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={motionAllowed ? { duration: 0.45, delay: 0.12 + bootIndex * 0.06 } : { duration: 0 }}
      onClick={() => select('governance')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select('governance');
        }
      }}
    >
      <span className="gov-label">
        <Lock aria-hidden />
        {t('n.gov')}
      </span>
      <div className="gov-chips">
        {CONTROLS.map((c) => (
          <span
            key={c.label}
            className="gov-chip gov-chip--live"
            data-tip={t(`gov.${c.key}`)}
            tabIndex={0}
            title={`Highlights where “${c.label}” is enforced`}
            onMouseEnter={() => setHighlight(c.protects)}
            onMouseLeave={() => setHighlight(null)}
            onFocus={() => setHighlight(c.protects)}
            onBlur={() => setHighlight(null)}
          >
            {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
