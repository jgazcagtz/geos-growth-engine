import {
  Activity,
  Banknote,
  Briefcase,
  Building2,
  Cpu,
  CreditCard,
  Database,
  Globe,
  LifeBuoy,
  Mail,
  Megaphone,
  MessagesSquare,
  MousePointerClick,
  Radar,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { SIGNAL_GROUPS } from '../../../data/signals';
import { useEngine } from '../../../state/EngineContext';

const ICONS: Record<string, LucideIcon> = {
  web: Globe,
  product: MousePointerClick,
  crm: Database,
  marketing: Megaphone,
  sales: MessagesSquare,
  support: LifeBuoy,
  email: Mail,
  activity: Activity,
  spend: CreditCard,
  company: Building2,
  funding: Banknote,
  hiring: UserPlus,
  firmo: Briefcase,
  techno: Cpu,
  intent: Radar,
  market: TrendingUp,
};

export function SignalsNode({ groupId }: { groupId: 'signals-1p' | 'signals-ext' }) {
  const { t } = useEngine();
  const group = SIGNAL_GROUPS.find((g) => g.id === groupId);
  if (!group) return null;
  const HeadIcon = groupId === 'signals-1p' ? Database : Radar;
  const titleKey = groupId === 'signals-1p' ? 'n.signals1p' : 'n.signalsExt';
  const subKey = groupId === 'signals-1p' ? 'n.signals1p.s' : 'n.signalsExt.s';

  return (
    <>
      <div className="node-head">
        <span className="node-head-icon">
          <HeadIcon size={13} aria-hidden />
        </span>
        <div>
          <div className="node-title">{t(titleKey)}</div>
          <div className="node-sub">{t(subKey)}</div>
        </div>
      </div>
      <div className="node-body">
        <div className="chip-cloud">
          {group.items.map((item) => {
            const Icon = ICONS[item.id];
            const later = item.status === 'potential';
            return (
              <span
                key={item.id}
                className={`chip${groupId === 'signals-ext' ? ' chip--ext' : ''}${later ? ' chip--later' : ''}`}
                data-stage={item.stage ?? 'mvp'}
                title={later ? `${item.note} — potential · connect over time` : item.note}
              >
                {Icon ? <Icon aria-hidden /> : null}
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="node-foot">
        <span className="cadence">{group.cadence}</span> → resolved into the Account Graph ·{' '}
        <span className="later-note">dashed = connect over time</span>
      </div>
    </>
  );
}
