import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  reasons: string[];
  status: 'legitimate' | 'needs_review' | 'fraud_suspected';
}

export default function DecisionPanel({ reasons, status }: Props) {
  const isClean = status === 'legitimate';

  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '450ms' }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Decision Explainability</h3>
      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            {isClean ? (
              <CheckCircle className="w-4 h-4 mt-0.5 trust-green shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 trust-red shrink-0" />
            )}
            <span className="text-secondary-foreground">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
