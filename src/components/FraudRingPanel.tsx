import { FraudRing } from '@/lib/fraud-engine';
import { Network } from 'lucide-react';

interface Props {
  fraudRing: FraudRing;
}

export default function FraudRingPanel({ fraudRing }: Props) {
  if (!fraudRing.detected) return null;

  return (
    <div className="bg-card border border-destructive/30 rounded-lg p-4 card-glow-red animate-fade-in-up" style={{ animationDelay: '650ms' }}>
      <div className="flex items-center gap-2 mb-3">
        <Network className="w-4 h-4 trust-red" />
        <h3 className="text-xs font-semibold uppercase tracking-wider trust-red">Fraud Ring Detected</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold font-mono trust-red">{fraudRing.clusterSize}</span>
        <span className="text-xs text-muted-foreground">linked accounts in cluster</span>
      </div>
      <div className="bg-secondary/50 rounded-md p-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shared Attributes</p>
        <ul className="space-y-1.5">
          {fraudRing.sharedAttributes.map((attr, i) => (
            <li key={i} className="text-xs font-mono text-secondary-foreground flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-destructive shrink-0" />
              {attr}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground mt-3 italic">
        Coordinated behavior detected — escalate for manual review.
      </p>
    </div>
  );
}
