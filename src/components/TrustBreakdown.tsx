import { TrustComponent } from '@/lib/fraud-engine';
import { Activity, Smartphone, Wifi, Cloud } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  'Behavioral Trust': <Activity className="w-4 h-4" />,
  'Device Trust': <Smartphone className="w-4 h-4" />,
  'Network Trust': <Wifi className="w-4 h-4" />,
  'Environmental Trust': <Cloud className="w-4 h-4" />,
};

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? 'bg-trust-green' :
    score >= 40 ? 'bg-trust-yellow' :
    'bg-trust-red';

  return (
    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color} animate-bar-fill`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function ComponentCard({ component, delay }: { component: TrustComponent; delay: number }) {
  const scoreColor =
    component.score >= 70 ? 'trust-green' :
    component.score >= 40 ? 'trust-yellow' :
    'trust-red';

  return (
    <div
      className="bg-card border border-border rounded-lg p-4 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          {ICONS[component.name]}
          <span className="text-xs font-semibold uppercase tracking-wider">{component.name}</span>
        </div>
        <span className={`font-mono font-bold text-sm ${scoreColor}`}>{component.score}</span>
      </div>
      <ScoreBar score={component.score} />
      <p className="text-xs text-muted-foreground mt-2">{component.explanation}</p>
      <ul className="mt-2 space-y-1">
        {component.factors.map((f, i) => (
          <li key={i} className="text-xs text-secondary-foreground flex items-start gap-1.5">
            <span className="text-muted-foreground mt-0.5">·</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface Props {
  components: {
    behavioral: TrustComponent;
    device: TrustComponent;
    network: TrustComponent;
    environmental: TrustComponent;
  };
}

export default function TrustBreakdown({ components }: Props) {
  const items = [components.behavioral, components.device, components.network, components.environmental];

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Multi-Layer Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((c, i) => (
          <ComponentCard key={c.name} component={c} delay={100 + i * 80} />
        ))}
      </div>
    </div>
  );
}
