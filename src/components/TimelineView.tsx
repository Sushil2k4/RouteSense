import { TimelineEvent } from '@/lib/fraud-engine';

interface Props {
  events: TimelineEvent[];
}

export default function TimelineView({ events }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Behavioral Timeline</h3>
      <div className="relative pl-4">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        {events.map((e, i) => (
          <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
            <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 ${
              e.isAnomaly
                ? 'border-destructive bg-destructive/20 animate-score-pulse'
                : 'border-muted-foreground/30 bg-secondary'
            }`} />
            <div>
              <span className={`text-xs font-mono font-semibold ${e.isAnomaly ? 'trust-red' : 'text-muted-foreground'}`}>
                {e.label}
              </span>
              <p className={`text-sm mt-0.5 ${e.isAnomaly ? 'text-foreground font-medium' : 'text-secondary-foreground'}`}>
                {e.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
