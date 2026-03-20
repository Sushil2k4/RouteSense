export interface ClaimInput {
  city: string;
  weather: 'normal' | 'rain' | 'storm';
  movementSpeed: number; // 0-200 km/h
  movementPattern: 'normal' | 'static' | 'teleporting';
  deviceIntegrity: 'trusted' | 'suspicious';
  networkProfile: 'unique' | 'shared_cluster';
  claimFrequency: 'low' | 'medium' | 'high';
  historicalConsistency: 'consistent' | 'inconsistent';
}

export interface TrustComponent {
  name: string;
  score: number;
  explanation: string;
  factors: string[];
}

export interface FraudRing {
  detected: boolean;
  clusterSize: number;
  sharedAttributes: string[];
}

export interface TimelineEvent {
  label: string;
  value: string;
  isAnomaly: boolean;
}

export interface AnalysisResult {
  trustScore: number;
  status: 'legitimate' | 'needs_review' | 'fraud_suspected';
  components: {
    behavioral: TrustComponent;
    device: TrustComponent;
    network: TrustComponent;
    environmental: TrustComponent;
  };
  reasons: string[];
  timeline: TimelineEvent[];
  fraudRing: FraudRing;
}

export function analyzeClaim(input: ClaimInput): AnalysisResult {
  // Behavioral Trust
  let behavioralScore = 100;
  const behavioralFactors: string[] = [];

  if (input.movementPattern === 'teleporting') {
    behavioralScore -= 55;
    behavioralFactors.push('Teleportation pattern detected — impossible human movement');
  } else if (input.movementPattern === 'static') {
    behavioralScore -= 20;
    if (input.weather === 'storm') {
      behavioralScore -= 15;
      behavioralFactors.push('Static position during severe weather event — inconsistent with claimed risk');
    }
    behavioralFactors.push('No movement detected over claim period');
  }

  if (input.movementSpeed > 150) {
    behavioralScore -= 30;
    behavioralFactors.push(`Speed of ${input.movementSpeed} km/h exceeds plausible delivery velocity`);
  } else if (input.movementSpeed > 80) {
    behavioralScore -= 10;
    behavioralFactors.push('Elevated movement speed detected');
  }

  if (input.historicalConsistency === 'inconsistent') {
    behavioralScore -= 25;
    behavioralFactors.push('Current behavior deviates significantly from historical baseline');
  }

  if (input.claimFrequency === 'high') {
    behavioralScore -= 20;
    behavioralFactors.push('Abnormally high claim frequency detected');
  } else if (input.claimFrequency === 'medium') {
    behavioralScore -= 8;
    behavioralFactors.push('Moderate claim frequency noted');
  }

  behavioralScore = Math.max(0, behavioralScore);

  // Device Trust
  let deviceScore = 100;
  const deviceFactors: string[] = [];

  if (input.deviceIntegrity === 'suspicious') {
    deviceScore -= 45;
    deviceFactors.push('Device sensor readings conflict with reported GPS coordinates');
    deviceFactors.push('Possible mock location or rooted device detected');
  }

  if (input.movementPattern === 'teleporting' && input.deviceIntegrity === 'suspicious') {
    deviceScore -= 20;
    deviceFactors.push('Combined GPS spoof + device tampering signature');
  }

  if (deviceFactors.length === 0) {
    deviceFactors.push('Device attestation passed — sensors consistent');
  }

  deviceScore = Math.max(0, deviceScore);

  // Network Trust
  let networkScore = 100;
  const networkFactors: string[] = [];

  if (input.networkProfile === 'shared_cluster') {
    networkScore -= 40;
    networkFactors.push('IP address belongs to a known shared cluster');
    networkFactors.push('Multiple simultaneous claims detected from same network origin');
  }

  if (input.networkProfile === 'shared_cluster' && input.claimFrequency === 'high') {
    networkScore -= 20;
    networkFactors.push('High-frequency claims from coordinated network — fraud ring indicator');
  }

  if (networkFactors.length === 0) {
    networkFactors.push('Unique network fingerprint — no cluster association');
  }

  networkScore = Math.max(0, networkScore);

  // Environmental Trust
  let envScore = 100;
  const envFactors: string[] = [];

  if (input.weather === 'storm' && input.movementPattern === 'static') {
    envScore -= 30;
    envFactors.push('Claimed storm damage without evidence of movement through affected area');
  }

  if (input.weather === 'normal' && input.movementPattern === 'teleporting') {
    envScore -= 15;
    envFactors.push('No environmental hazard to justify anomalous movement pattern');
  }

  if (input.weather === 'storm' && input.movementSpeed > 100) {
    envScore -= 20;
    envFactors.push('Unrealistic travel speed during severe weather conditions');
  }

  if (envFactors.length === 0) {
    envFactors.push('Environmental signals consistent with claimed scenario');
  }

  envScore = Math.max(0, envScore);

  // Composite score
  const trustScore = Math.round(
    behavioralScore * 0.35 +
    deviceScore * 0.25 +
    networkScore * 0.25 +
    envScore * 0.15
  );

  const status: AnalysisResult['status'] =
    trustScore >= 70 ? 'legitimate' :
    trustScore >= 40 ? 'needs_review' :
    'fraud_suspected';

  // Reasons
  const reasons: string[] = [];
  if (input.movementPattern === 'teleporting') reasons.push('Movement pattern inconsistent with human mobility');
  if (input.deviceIntegrity === 'suspicious') reasons.push('Device sensors conflict with GPS data');
  if (input.networkProfile === 'shared_cluster') reasons.push('Multiple claims detected from shared IP cluster');
  if (input.weather === 'storm' && input.movementPattern === 'static') reasons.push('Weather conditions do not match claimed risk zone activity');
  if (input.historicalConsistency === 'inconsistent') reasons.push('Behavioral pattern breaks from historical profile');
  if (input.claimFrequency === 'high') reasons.push('Claim frequency exceeds statistical baseline by 3.2σ');
  if (input.movementSpeed > 150) reasons.push(`Reported speed of ${input.movementSpeed} km/h exceeds vehicle limits for delivery`);
  if (reasons.length === 0) reasons.push('All signals within expected parameters');

  // Timeline
  const timeline: TimelineEvent[] = [
    { label: '7 days ago', value: 'Avg. 28 km/day, 4 deliveries', isAnomaly: false },
    { label: '3 days ago', value: 'Avg. 32 km/day, 5 deliveries', isAnomaly: false },
    { label: '1 day ago', value: 'Avg. 25 km/day, 3 deliveries', isAnomaly: false },
    {
      label: 'Current claim',
      value: input.movementPattern === 'teleporting'
        ? `Sudden teleport detected — ${input.movementSpeed} km/h spike`
        : input.movementPattern === 'static'
        ? 'Zero movement — device stationary'
        : `Normal activity — ${input.movementSpeed} km/h avg`,
      isAnomaly: input.movementPattern !== 'normal'
    },
  ];

  // Fraud Ring
  const fraudRing: FraudRing = {
    detected: input.networkProfile === 'shared_cluster',
    clusterSize: input.networkProfile === 'shared_cluster' ? 87 : 0,
    sharedAttributes: input.networkProfile === 'shared_cluster'
      ? ['IP subnet 192.168.4.x', 'Device model: Generic Android 12', 'Claim window: 14:00–14:12 UTC', 'Geohash prefix: tdr1w']
      : [],
  };

  return {
    trustScore,
    status,
    components: {
      behavioral: { name: 'Behavioral Trust', score: behavioralScore, explanation: 'Movement patterns, speed, frequency, and historical consistency.', factors: behavioralFactors },
      device: { name: 'Device Trust', score: deviceScore, explanation: 'Hardware attestation, sensor integrity, and tamper detection.', factors: deviceFactors },
      network: { name: 'Network Trust', score: networkScore, explanation: 'IP fingerprint, cluster analysis, and coordination detection.', factors: networkFactors },
      environmental: { name: 'Environmental Trust', score: envScore, explanation: 'Weather correlation, geographic plausibility, and hazard verification.', factors: envFactors },
    },
    reasons,
    timeline,
    fraudRing,
  };
}

export function generateLegitimate(): ClaimInput {
  return {
    city: 'Mumbai',
    weather: 'rain',
    movementSpeed: 35,
    movementPattern: 'normal',
    deviceIntegrity: 'trusted',
    networkProfile: 'unique',
    claimFrequency: 'low',
    historicalConsistency: 'consistent',
  };
}

export function generateFraud(): ClaimInput {
  return {
    city: 'Delhi',
    weather: 'storm',
    movementSpeed: 180,
    movementPattern: 'teleporting',
    deviceIntegrity: 'suspicious',
    networkProfile: 'shared_cluster',
    claimFrequency: 'high',
    historicalConsistency: 'inconsistent',
  };
}
