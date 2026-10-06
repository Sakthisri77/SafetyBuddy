import { IncidentRecord, RiskLevel } from '../types/safety';

export interface PostIncidentReportData {
  incidentId: string;
  date: string;
  time: string;
  durationFormatted: string;
  trigger: string;
  riskLevel: RiskLevel;
  confidenceScore: number;
  signalsDetected: string[];
  actionsTaken: string[];
  contactsNotified: string[];
  outcome: string;
  timeline: Array<{
    time: string;
    step: string;
    description: string;
    status: 'info' | 'warning' | 'danger' | 'success';
  }>;
  safetyInsights: string[];
}

export function generatePostIncidentReport(params: {
  triggerReason?: string;
  confidenceScore?: number;
  riskLevel?: RiskLevel;
  durationSeconds?: number;
  contactsNotified?: string[];
  signals?: string[];
}): PostIncidentReportData {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const incId = `INC-${Date.now().toString(36).toUpperCase()}`;

  const durationSec = params.durationSeconds || 195;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;
  const durationFormatted = `${minutes}m ${seconds}s`;

  return {
    incidentId: incId,
    date: dateStr,
    time: timeStr,
    durationFormatted,
    trigger: params.triggerReason || 'Unexplained Route Deviation & Lack of Response to Safety Check',
    riskLevel: params.riskLevel || 'HIGH',
    confidenceScore: params.confidenceScore || 87,
    signalsDetected: params.signals || [
      'Unexpected path deviation from learned route (College → Hostel)',
      'Entry into Central Road risk cluster (15 historical reports)',
      '5-minute "Are you safe?" verification timed out with no user acknowledgment',
      'Wearable physiological anomaly: Heart rate accelerated to 134 BPM',
      'High acute stress index detected by smartwatch biometric sensors',
    ],
    actionsTaken: [
      'Automated 5-minute safety check initiated at T+0s',
      'Multi-signal AI safety confidence matrix re-evaluated: 87% confidence',
      'Emergency escalation triggered at T+45s',
      'High-priority push notifications and SMS dispatches transmitted to designated contacts',
      'Encrypted emergency location channel enabled for authorized contacts',
      'Emergency audio/video evidence buffer armed on device',
      'Safety check marked resolved after user verification',
    ],
    contactsNotified: params.contactsNotified || [
      'Sarah Chen (Mom) - SMS & Urgent App Push',
      'Campus Safety Dispatch - Priority Security Feed',
      'Nearby Verified SafetyBuddy Network (2 users in 500m radius)',
    ],
    outcome: 'Resolved Safe: User confirmed well-being; precise sharing revoked to privacy baseline.',
    timeline: [
      {
        time: 'T - 04:15',
        step: 'Normal Route',
        description: 'User initiated journey from Tech University Campus along standard learned routine.',
        status: 'info',
      },
      {
        time: 'T - 02:40',
        step: 'Risk Area Entered',
        description: 'Proximity detection alerted to Central Road sector with 15 previous safety reports.',
        status: 'warning',
      },
      {
        time: 'T - 01:50',
        step: 'Route Deviation',
        description: 'User coordinates diverged >120m off typical route towards unlit service corridor.',
        status: 'warning',
      },
      {
        time: 'T - 01:30',
        step: 'Safety Check Initiated',
        description: 'System triggered proactive "Are You Safe?" verification with 5-minute timer.',
        status: 'warning',
      },
      {
        time: 'T - 00:45',
        step: 'No Response Detected',
        description: 'Verification prompt unacknowledged; automated escalation sequence engaged.',
        status: 'danger',
      },
      {
        time: 'T - 00:30',
        step: 'Watch Anomaly',
        description: 'Smartwatch telemetry spiked: HR reached 134 BPM (>140% resting baseline).',
        status: 'danger',
      },
      {
        time: 'T - 00:15',
        step: 'AI Risk Assessment',
        description: 'Multi-signal fusion engine rated emergency confidence at 87% (HIGH RISK).',
        status: 'danger',
      },
      {
        time: 'T + 00:00',
        step: 'Emergency Activated',
        description: 'Emergency Mode engaged: siren visual cues and evidence recording buffer armed.',
        status: 'danger',
      },
      {
        time: 'T + 00:05',
        step: 'Contacts Notified',
        description: 'Dispatched instant emergency alerts to primary trusted contact and campus security.',
        status: 'danger',
      },
      {
        time: 'T + 00:10',
        step: 'Authorized Location Shared',
        description: 'Temporary high-precision GPS stream securely authorized for parent.',
        status: 'warning',
      },
      {
        time: `T + ${durationFormatted}`,
        step: 'Resolved',
        description: 'Incident verified and marked safe. Exact coordinates sealed under privacy protocol.',
        status: 'success',
      },
    ],
    safetyInsights: [
      'Multiple reports (15) already existed in the affected Central Road area.',
      'Route deviation occurred before physiological spike and emergency escalation.',
      'Wearable biometric signals substantially increased AI emergency confidence from 55% to 87%.',
      'Zero-knowledge-inspired architecture prevented exposure of exact route until emergency was confirmed.',
    ],
  };
}

export function toIncidentRecord(report: PostIncidentReportData): IncidentRecord {
  return {
    id: report.incidentId,
    date: report.date,
    time: report.time,
    type: 'Emergency Alert Escalation & Resolution',
    riskLevel: report.riskLevel,
    outcome: 'Resolved Safe',
    durationSeconds: 195,
    signalsDetected: report.signalsDetected,
    contactsNotified: report.contactsNotified,
    notes: `${report.trigger} - resolved with full post-incident audit.`,
  };
}
