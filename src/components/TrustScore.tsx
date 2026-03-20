import { AnalysisResult } from '@/lib/fraud-engine';

interface Props {
  result: AnalysisResult;
}

export default function TrustScore({ result }: Props) {
  const { trustScore, status } = result;

  const statusConfig = {
    legitimate: { label: 'Legitimate', colorClass: 'trust-green', bgClass: 'bg-trust-green\\/10', glowClass: 'card-glow-green' },
    needs_review: { label: 'Needs Review', colorClass: 'trust-yellow', bgClass: 'bg-trust-yellow\\/10', glowClass: 'card-glow-yellow' },
    fraud_suspected: { label: 'Fraud Suspected', colorClass: 'trust-red', bgClass: 'bg-trust-red\\/10', glowClass: 'card-glow-red' },
  };

  const config = statusConfig[status];

  return (
    <div className={`rounded-lg p-6 bg-card ${config.glowClass} animate-fade-in-up text-center`}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Composite Trust Score</p>
      <div className={`text-6xl font-bold font-mono ${config.colorClass} leading-none`}>
        {trustScore}
      </div>
      <div className="mt-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bgClass} ${config.colorClass}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
}
