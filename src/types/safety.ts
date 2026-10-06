export type SafetyStatus = 'safe' | 'monitoring' | 'warning' | 'emergency';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface LiveLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  notifyOnDeviation: boolean;
  notifyOnEmergency: boolean;
  canViewLiveEmergency: boolean;
}

export interface NearbyUser {
  id: string;
  codename: string;
  distanceMeters: number;
  available: boolean;
  verified: boolean;
  latOffset: number;
  lngOffset: number;
}

export interface SmartwatchModel {
  id: string;
  name: string;
  series: string;
  manufacturer: string;
  bleAddress: string;
  rssi: number;
  batteryPct: number;
  firmware: string;
  sensors: string[];
  sampleRateHz: number;
  characteristics: {
    baselineHrMin: number;
    baselineHrMax: number;
    latencySeconds: number;
    stressSensitivity: 'High' | 'Very High' | 'Moderate';
    fallDetection: boolean;
    ecgChannels: number;
    specialty: string;
    description: string;
  };
  security: {
    pairingType: string;
    encryption: string;
    certStatus: string;
  };
}

export interface WatchTelemetry {
  heartRate: number;
  baselineHeartRate: number;
  spo2: number;
  temperature: number;
  stressLevel: 'Normal' | 'Elevated' | 'High' | 'Severe';
  activity: 'Resting' | 'Walking' | 'Running' | 'Erratic' | 'Stationary';
  connected: boolean;
  batteryPct: number;
  timestamp: number;
  history: Array<{
    time: string;
    heartRate: number;
    stress: number;
    temp: number;
  }>;
}

export interface SafetyReport {
  id: string;
  areaName: string;
  category: 'Harassment' | 'Theft' | 'Suspicious Activity' | 'Poor Lighting' | 'Unsafe Road' | 'Accident' | 'Other';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  reportedAt: string;
  timestamp: number;
  upvotes: number;
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  approxLat: number;
  approxLng: number;
  hasEvidence: boolean;
}

export interface RiskZone {
  id: string;
  name: string;
  riskLevel: RiskLevel;
  reportCount: number;
  crowdDensity: 'High' | 'Moderate' | 'Sparse' | 'Isolated';
  lightingQuality: 'Good' | 'Fair' | 'Poor';
  recentIncidents: string[];
  lat: number;
  lng: number;
  radius: number; // meters
}

export interface DestinationOption {
  id: string;
  name: string;
  category: 'College' | 'Transit' | 'Hospital' | 'Hostel' | 'Landmark';
  address: string;
  distanceKm: number;
  lat: number;
  lng: number;
}

export interface SafeRouteOption {
  id: string;
  label: string; // 'ROUTE 1', 'ROUTE 2', 'ROUTE 3', etc.
  tag: 'RECOMMENDED' | 'FASTEST' | 'AVOID' | 'BALANCED';
  riskLevel: RiskLevel;
  durationMinutes: number;
  distanceKm: number;
  safetyScore: number;
  factors: {
    lighting: string;
    crowd: string;
    historicalRisk: string;
    policePresence: string;
  };
  areaRiskBreakdown?: {
    lowRiskAreas: number;
    moderateRiskAreas: number;
    highRiskAreas: number;
  };
  reportsNearRoute?: Array<{
    category: string;
    count: number;
  }>;
  whyThisRoute: string[];
  pathCoordinates: Array<[number, number]>;
}

export interface SafetyPatternZone {
  id: string;
  name: string;
  category: 'Home' | 'College' | 'Hostel' | 'Work' | 'Safe Haven';
  address: string;
  lat: number;
  lng: number;
  visitFrequency: string;
}

export interface SafetyPatternRoute {
  id: string;
  fromName: string;
  toName: string;
  typicalDurationMinutes: number;
  timeOfDay: string;
}

export interface IncidentRecord {
  id: string;
  date: string;
  time: string;
  type: string;
  riskLevel: RiskLevel;
  outcome: 'Resolved Safe' | 'Assistance Dispatched' | 'False Alarm' | 'Escalated to Contacts';
  durationSeconds: number;
  signalsDetected: string[];
  contactsNotified: string[];
  notes: string;
}

export interface AISafetyAssessment {
  emergencyConfidence: number; // 0 to 100
  riskLevel: RiskLevel;
  locationRisk: RiskLevel;
  routeDeviation: boolean;
  previousReportsLevel: RiskLevel;
  userResponseStatus: 'RESPONDED_SAFE' | 'WAITING' | 'NO_RESPONSE' | 'HELP_REQUESTED';
  heartRateStatus: 'NORMAL' | 'ELEVATED' | 'ABNORMAL' | 'CRITICAL';
  stressStatus: 'NORMAL' | 'ELEVATED' | 'HIGH';
  timeRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  crowdRisk: 'SAFE' | 'MODERATE' | 'VULNERABLE';
  reasons: string[];
  recommendation: string;
  lastEvaluatedAt: string;
}

export interface PrivacyPreferences {
  locationProcessingActive: boolean;
  exactLocationProtected: boolean;
  areaLevelRiskOnly: boolean;
  emergencySharingAuthorized: boolean;
  parentLiveVisibility: boolean;
  nearbyUserNetworkOptIn: boolean;
  routineLearningEnabled: boolean;
  reportAnonymityGuaranteed: boolean;
  evidenceLocalRetention: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  timestamp: number;
}

// Section 37 Data Models
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  phone: string;
  avatar?: string;
}

export type Route = SafeRouteOption;
export type SafeZone = SafetyPatternZone;
export type IncidentReport = IncidentRecord;

export interface EmergencyEvent {
  id: string;
  timestamp: number;
  trigger: string;
  riskLevel: RiskLevel;
  confidence: number;
  locationSharingAuthorized: boolean;
  contactsNotified: string[];
  resolved: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'info' | 'warning' | 'emergency';
}
