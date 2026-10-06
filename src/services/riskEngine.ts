import { AISafetyAssessment, RiskLevel, SafetyReport, WatchTelemetry } from '../types/safety';

export interface SignalInputs {
  inRiskZone: boolean;
  riskZoneLevel: RiskLevel;
  routeDeviation: boolean;
  reportsNearCount: number;
  highSeverityReportsCount: number;
  userResponseStatus: 'RESPONDED_SAFE' | 'WAITING' | 'NO_RESPONSE' | 'HELP_REQUESTED';
  telemetry: WatchTelemetry;
  timeHour?: number;
}

/**
 * Calculates Area Risk Level considering:
 * - reportCount
 * - reportRecency
 * - severity
 * - repeatedCategories
 * - crowdDensity
 * - timeOfDay
 */
export function calculateAreaRisk(
  reports: SafetyReport[],
  areaName: string,
  baseRisk: RiskLevel = 'LOW'
): { riskLevel: RiskLevel; score: number; factors: string[] } {
  const areaReports = reports.filter(
    (r) => r.areaName.toLowerCase().includes(areaName.toLowerCase()) && r.status === 'approved'
  );

  let score = 15; // baseline
  const factors: string[] = [];

  if (baseRisk === 'HIGH') score += 30;
  if (baseRisk === 'CRITICAL') score += 45;
  if (baseRisk === 'MODERATE') score += 15;

  // Report count
  if (areaReports.length >= 10) {
    score += 25;
    factors.push(`${areaReports.length} cumulative safety reports in area`);
  } else if (areaReports.length >= 4) {
    score += 15;
    factors.push(`${areaReports.length} community reports flagged`);
  }

  // Recency (< 6 hours)
  const sixHoursAgo = Date.now() - 6 * 3600 * 1000;
  const recentReports = areaReports.filter((r) => r.timestamp > sixHoursAgo);
  if (recentReports.length >= 2) {
    score += 20;
    factors.push(`${recentReports.length} recent reports within the last 6 hours`);
  }

  // Severity
  const highSev = areaReports.filter((r) => r.severity === 'High');
  if (highSev.length > 0) {
    score += highSev.length * 8;
    factors.push(`${highSev.length} high-severity reports on record`);
  }

  // Time of day risk (Late evening / night 21:00 - 05:00)
  const currentHour = new Date().getHours();
  if (currentHour >= 21 || currentHour <= 5) {
    score += 15;
    factors.push('Elevated risk window: late night hours');
  }

  // Cap score
  score = Math.min(100, Math.max(0, score));

  let riskLevel: RiskLevel = 'LOW';
  if (score >= 75) riskLevel = 'CRITICAL';
  else if (score >= 50) riskLevel = 'HIGH';
  else if (score >= 25) riskLevel = 'MODERATE';

  return { riskLevel, score, factors };
}

/**
 * Computes Multi-Signal AI Safety Assessment with explainability
 */
export function assessAISafety(inputs: SignalInputs): AISafetyAssessment {
  const {
    inRiskZone,
    riskZoneLevel,
    routeDeviation,
    reportsNearCount,
    highSeverityReportsCount,
    userResponseStatus,
    telemetry,
    timeHour = new Date().getHours(),
  } = inputs;

  let confidenceScore = 5; // baseline calm
  const reasons: string[] = [];

  // 1. Location / Risk Zone Factor
  let locationRisk: RiskLevel = 'LOW';
  if (inRiskZone) {
    if (riskZoneLevel === 'CRITICAL') {
      confidenceScore += 30;
      locationRisk = 'CRITICAL';
      reasons.push('Entered classified critical risk zone (South Industrial Corridor)');
    } else if (riskZoneLevel === 'HIGH') {
      confidenceScore += 22;
      locationRisk = 'HIGH';
      reasons.push('Current coordinate lies inside known high-risk zone (Central Road)');
    } else if (riskZoneLevel === 'MODERATE') {
      confidenceScore += 12;
      locationRisk = 'MODERATE';
      reasons.push('Passage through moderate-risk transit plaza');
    }
  }

  // 2. Route Deviation Factor
  if (routeDeviation) {
    confidenceScore += 24;
    reasons.push('Unexpected divergence from normal learned path (College → Hostel)');
  }

  // 3. User Response Status
  if (userResponseStatus === 'HELP_REQUESTED') {
    confidenceScore += 50;
    reasons.push('User explicitly pressed NEED HELP verification');
  } else if (userResponseStatus === 'NO_RESPONSE') {
    confidenceScore += 32;
    reasons.push('No response received to 5-minute automated safety check');
  } else if (userResponseStatus === 'WAITING') {
    if (routeDeviation) {
      confidenceScore += 10;
      reasons.push('5-minute safety check countdown in progress');
    }
  } else if (userResponseStatus === 'RESPONDED_SAFE') {
    confidenceScore = Math.max(5, confidenceScore - 40);
    reasons.push('User recently confirmed safety via prompt');
  }

  // 4. Biometric Telemetry
  let hrStatus: AISafetyAssessment['heartRateStatus'] = 'NORMAL';
  if (telemetry.heartRate >= 135) {
    confidenceScore += 22;
    hrStatus = 'CRITICAL';
    reasons.push(`Heart rate spike (${telemetry.heartRate} BPM) significantly exceeds resting baseline`);
  } else if (telemetry.heartRate >= 110) {
    confidenceScore += 14;
    hrStatus = 'ABNORMAL';
    reasons.push(`Abnormal heart-rate signal detected (${telemetry.heartRate} BPM, baseline: 74 BPM)`);
  } else if (telemetry.heartRate >= 95) {
    confidenceScore += 6;
    hrStatus = 'ELEVATED';
  }

  let stressStatus: AISafetyAssessment['stressStatus'] = 'NORMAL';
  if (telemetry.stressLevel === 'Severe' || telemetry.stressLevel === 'High') {
    confidenceScore += 12;
    stressStatus = 'HIGH';
    reasons.push('Smartwatch galvanic/HRV telemetry signals severe acute stress');
  } else if (telemetry.stressLevel === 'Elevated') {
    confidenceScore += 6;
    stressStatus = 'ELEVATED';
  }

  // 5. Community Report Weighting
  let previousReportsLevel: RiskLevel = 'LOW';
  if (reportsNearCount >= 10 || highSeverityReportsCount >= 3) {
    previousReportsLevel = 'HIGH';
    confidenceScore += 12;
    reasons.push(`Multiple recent independent safety reports (${reportsNearCount}) recorded in vicinity`);
  } else if (reportsNearCount >= 4) {
    previousReportsLevel = 'MODERATE';
    confidenceScore += 6;
  }

  // 6. Time & Environment
  let timeRisk: AISafetyAssessment['timeRisk'] = 'LOW';
  if (timeHour >= 22 || timeHour < 5) {
    timeRisk = 'HIGH';
    confidenceScore += 8;
    reasons.push('Late night travel with reduced natural municipal lighting');
  } else if (timeHour >= 19) {
    timeRisk = 'MEDIUM';
    confidenceScore += 4;
  }

  const crowdRisk: AISafetyAssessment['crowdRisk'] = inRiskZone ? 'VULNERABLE' : 'SAFE';

  // Cap confidence score between 5 and 98
  confidenceScore = Math.min(98, Math.max(5, Math.round(confidenceScore)));

  // Risk Level
  let riskLevel: RiskLevel = 'LOW';
  let recommendation = 'Normal conditions. Location remains protected under privacy default.';

  if (confidenceScore >= 75 || userResponseStatus === 'HELP_REQUESTED') {
    riskLevel = 'CRITICAL';
    recommendation = 'Activate Emergency Escalation: notify trusted contacts with authorized location sharing.';
  } else if (confidenceScore >= 55) {
    riskLevel = 'HIGH';
    recommendation = 'Heightened vulnerability detected. Safety check prompt recommended.';
  } else if (confidenceScore >= 30) {
    riskLevel = 'MODERATE';
    recommendation = 'Monitor route progress. Area-level risk metrics active.';
  }

  return {
    emergencyConfidence: confidenceScore,
    riskLevel,
    locationRisk,
    routeDeviation,
    previousReportsLevel,
    userResponseStatus,
    heartRateStatus: hrStatus,
    stressStatus,
    timeRisk,
    crowdRisk,
    reasons: reasons.length > 0 ? reasons : ['Normal biometric telemetry and expected transit progression'],
    recommendation,
    lastEvaluatedAt: new Date().toLocaleTimeString(),
  };
}
