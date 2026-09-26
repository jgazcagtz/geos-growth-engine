import { FlaskConical } from 'lucide-react';
import { EXPERIMENTS } from '../../data/experiments';
import { ExperimentCard } from './ExperimentCard';

export function ExperimentLab() {
  return (
    <section className="section">
      <div className="section-title">
        <FlaskConical size={12} aria-hidden /> Experiment lab — close the loop yourself
      </div>
      <p>
        Play an experiment, read the statistics, then ship the winning learning — and watch it travel the dashed
        feedback edge back into the Orchestrator. Losing experiments get killed with a written reason — that is the
        job.
      </p>
      <p className="fold-note">
        Synthetic fixtures: results are internally consistent illustrations, not computed statistics. No significance
        is claimed.
      </p>
      {EXPERIMENTS.map((exp) => (
        <ExperimentCard key={exp.id} exp={exp} />
      ))}
    </section>
  );
}
