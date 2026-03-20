import { useState } from 'react';
import { ClaimInput, AnalysisResult, analyzeClaim } from '@/lib/fraud-engine';
import ClaimInputPanel from '@/components/ClaimInputPanel';
import FraudDashboard from '@/components/FraudDashboard';
import { Shield } from 'lucide-react';

export default function Index() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (input: ClaimInput) => {
    setResult(analyzeClaim(input));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight text-foreground">RouteSense</span>
          <span className="text-xs text-muted-foreground font-mono ml-1">v2.4</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">GPS Spoofing Detection · Parametric Insurance</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-score-pulse" />
        </div>
      </header>

      {/* Main 2-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Claim Input */}
        <aside className="w-[380px] shrink-0 border-r border-border p-5 overflow-y-auto">
          <ClaimInputPanel onAnalyze={handleAnalyze} />
        </aside>

        {/* Right: Dashboard */}
        <main className="flex-1 p-5 overflow-y-auto">
          <FraudDashboard result={result} />
        </main>
      </div>
    </div>
  );
}
