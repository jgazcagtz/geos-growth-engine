import { useEngine } from './state/EngineContext';
import { Header } from './components/Header';
import { SystemView } from './components/views/SystemView';
import { OperationsView } from './components/views/OperationsView';
import { ImpactView } from './components/views/ImpactView';
import { Toasts } from './components/Toasts';
import { DetailPanel } from './components/panel/DetailPanel';

export default function App() {
  const { motionAllowed, view, stage } = useEngine();

  return (
    <div className={`app${motionAllowed ? '' : ' reduce-motion'}`} data-stage={stage}>
      <Header />
      <div className="main">
        {view === 'system' ? (
          <SystemView />
        ) : view === 'ops' ? (
          <OperationsView />
        ) : (
          <ImpactView />
        )}
        <DetailPanel />
      </div>
      <Toasts />
    </div>
  );
}
