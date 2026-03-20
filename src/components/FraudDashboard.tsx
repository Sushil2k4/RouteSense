import { AnalysisResult } from '@/lib/fraud-engine';
import TrustScore from './TrustScore';
import TrustBreakdown from './TrustBreakdown';
import DecisionPanel from './DecisionPanel';
import TimelineView from './TimelineView';
import FraudRingPanel from './FraudRingPanel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Eye } from 'lucide-react';

interface Props {
  result: AnalysisResult | null;
}

function ScoreChart({ result }: { result: AnalysisResult }) {
  const data = [
    { name: 'Behavioral', score: result.components.behavioral.score },
    { name: 'Device', score: result.components.device.score },
    { name: 'Network', score: result.components.network.score },
    { name: 'Environ.', score: result.components.environmental.score },
  ];

  const getColor = (score: number) =>
    score >= 70 ? 'hsl(152, 60%, 48%)' :
    score >= 40 ? 'hsl(38, 92%, 55%)' :
    'hsl(0, 72%, 56%)';

  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Score Distribution</h3>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barSize={24}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(215, 12%, 50%)', fontSize: 10 }} />
          <YAxis domain={[0, 100]} hide />
          <Tooltip
            contentStyle={{ background: 'hsl(220, 18%, 10%)', border: '1px solid hsl(220, 14%, 18%)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'hsl(210, 20%, 80%)' }}
            cursor={{ fill: 'hsl(220, 14%, 14%)' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function FraudDashboard({ result }: Props) {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3 animate-fade-in-up">
          <Eye className="w-10 h-10 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">Configure a claim and click Analyze</p>
          <p className="text-xs text-muted-foreground/60">or use a preset scenario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto h-full pr-1">
      <TrustScore result={result} />
      <ScoreChart result={result} />
      <TrustBreakdown components={result.components} />
      <DecisionPanel reasons={result.reasons} status={result.status} />
      <TimelineView events={result.timeline} />
      <FraudRingPanel fraudRing={result.fraudRing} />

      {/* System Insight */}
      <div className="bg-secondary/50 border border-border rounded-lg p-4 animate-fade-in-up" style={{ animationDelay: '750ms' }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">System Insight</p>
        <p className="text-sm text-secondary-foreground italic">
          "We do not verify location. We verify behavioral and environmental consistency."
        </p>
      </div>
    </div>
  );
}
