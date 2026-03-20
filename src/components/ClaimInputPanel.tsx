import { useState } from 'react';
import { ClaimInput, generateLegitimate, generateFraud } from '@/lib/fraud-engine';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, UserCheck, AlertTriangle } from 'lucide-react';

interface Props {
  onAnalyze: (input: ClaimInput) => void;
}

type SelectField = 'weather' | 'movementPattern' | 'deviceIntegrity' | 'networkProfile' | 'claimFrequency' | 'historicalConsistency';

const OPTIONS: Record<SelectField, { value: string; label: string }[]> = {
  weather: [
    { value: 'normal', label: 'Normal' },
    { value: 'rain', label: 'Rain' },
    { value: 'storm', label: 'Storm' },
  ],
  movementPattern: [
    { value: 'normal', label: 'Normal' },
    { value: 'static', label: 'Static' },
    { value: 'teleporting', label: 'Teleporting' },
  ],
  deviceIntegrity: [
    { value: 'trusted', label: 'Trusted' },
    { value: 'suspicious', label: 'Suspicious' },
  ],
  networkProfile: [
    { value: 'unique', label: 'Unique' },
    { value: 'shared_cluster', label: 'Shared Cluster' },
  ],
  claimFrequency: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  historicalConsistency: [
    { value: 'consistent', label: 'Consistent' },
    { value: 'inconsistent', label: 'Inconsistent' },
  ],
};

const FIELD_LABELS: Record<SelectField, string> = {
  weather: 'Weather Conditions',
  movementPattern: 'Movement Pattern',
  deviceIntegrity: 'Device Integrity',
  networkProfile: 'Network Profile',
  claimFrequency: 'Claim Frequency',
  historicalConsistency: 'Historical Consistency',
};

function ToggleGroup({ field, value, onChange }: { field: SelectField; value: string; onChange: (v: string) => void }) {
  const opts = OPTIONS[field];
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{FIELD_LABELS[field]}</label>
      <div className="flex gap-1.5">
        {opts.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 active:scale-[0.97] ${
              value === opt.value
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'bg-secondary text-secondary-foreground border border-transparent hover:bg-accent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ClaimInputPanel({ onAnalyze }: Props) {
  const [input, setInput] = useState<ClaimInput>({
    city: 'Mumbai',
    weather: 'normal',
    movementSpeed: 30,
    movementPattern: 'normal',
    deviceIntegrity: 'trusted',
    networkProfile: 'unique',
    claimFrequency: 'low',
    historicalConsistency: 'consistent',
  });

  const setField = <K extends keyof ClaimInput>(key: K, value: ClaimInput[K]) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const handleGenLegit = () => {
    const data = generateLegitimate();
    setInput(data);
    onAnalyze(data);
  };

  const handleGenFraud = () => {
    const data = generateFraud();
    setInput(data);
    onAnalyze(data);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Claim Simulator</h2>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
          <Input
            value={input.city}
            onChange={e => setField('city', e.target.value)}
            placeholder="City name"
            className="bg-secondary border-border text-foreground h-9 text-sm"
          />
        </div>

        <ToggleGroup field="weather" value={input.weather} onChange={v => setField('weather', v as ClaimInput['weather'])} />
        
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Movement Speed — <span className="font-mono text-foreground">{input.movementSpeed} km/h</span>
          </label>
          <Slider
            value={[input.movementSpeed]}
            onValueChange={v => setField('movementSpeed', v[0])}
            min={0}
            max={200}
            step={5}
            className="py-2"
          />
        </div>

        <ToggleGroup field="movementPattern" value={input.movementPattern} onChange={v => setField('movementPattern', v as ClaimInput['movementPattern'])} />
        <ToggleGroup field="deviceIntegrity" value={input.deviceIntegrity} onChange={v => setField('deviceIntegrity', v as ClaimInput['deviceIntegrity'])} />
        <ToggleGroup field="networkProfile" value={input.networkProfile} onChange={v => setField('networkProfile', v as ClaimInput['networkProfile'])} />
        <ToggleGroup field="claimFrequency" value={input.claimFrequency} onChange={v => setField('claimFrequency', v as ClaimInput['claimFrequency'])} />
        <ToggleGroup field="historicalConsistency" value={input.historicalConsistency} onChange={v => setField('historicalConsistency', v as ClaimInput['historicalConsistency'])} />
      </div>

      <div className="pt-4 mt-4 border-t border-border space-y-2">
        <Button
          onClick={() => onAnalyze(input)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold active:scale-[0.98] transition-transform"
        >
          Analyze Claim
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={handleGenLegit}
            variant="secondary"
            className="flex-1 text-xs active:scale-[0.97] transition-transform"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1" />
            Real User
          </Button>
          <Button
            onClick={handleGenFraud}
            variant="secondary"
            className="flex-1 text-xs active:scale-[0.97] transition-transform"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Fraud Scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
