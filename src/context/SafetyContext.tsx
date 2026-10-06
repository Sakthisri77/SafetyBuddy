import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  SafetyStatus,
  RiskLevel,
  LiveLocation,
  TrustedContact,
  NearbyUser,
  SafetyReport,
  SafeRouteOption,
  SafetyPatternZone,
  SafetyPatternRoute,
  IncidentRecord,
  AISafetyAssessment,
  PrivacyPreferences,
  ToastMessage,
  SmartwatchModel,
} from '../types/safety';
import {
  INITIAL_RISK_ZONES,
  INITIAL_CONTACTS,
  INITIAL_NEARBY_USERS,
  INITIAL_SAFE_ZONES,
  INITIAL_FREQUENT_ROUTES,
  SAMPLE_SAFE_ROUTES,
  INITIAL_INCIDENT_HISTORY,
  AVAILABLE_SMARTWATCH_MODELS,
} from '../data/mockData';
import { useLiveLocation } from '../hooks/useLiveLocation';
import { useWatchTelemetry, WatchSimulationMode } from '../hooks/useWatchTelemetry';
import { assessAISafety, calculateAreaRisk } from '../services/riskEngine';
import { ReportService } from '../services/reportService';
import { generatePostIncidentReport, PostIncidentReportData, toIncidentRecord } from '../services/emergencyService';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'admin';
  phone: string;
  avatar?: string;
}

export interface EmergencyState {
  isActive: boolean;
  startedAt: number | null;
  triggerReason: string;
  locationSharingAuthorized: boolean;
  contactsAlerted: string[];
  nearbyAlertedCount: number;
  audioRecording: boolean;
  videoRecording: boolean;
  recordingDurationSeconds: number;
}

export interface SafetyCheckState {
  isOpen: boolean;
  countdownSeconds: number;
  startedAt: number;
  resolved: boolean;
}

export interface SafetyContextType {
  // User & Auth
  currentUser: UserProfile;
  isAuthenticated: boolean;
  loginAs: (role: 'student' | 'parent' | 'admin') => void;
  logout: () => void;

  // Live Location
  location: LiveLocation;
  latitude: number;
  longitude: number;
  accuracy: number;
  isTracking: boolean;
  locationStatus: string;
  requestLocationPermission: () => void;
  refreshLocation: () => void;
  setSimulatedCoords: (coords: { latitude: number; longitude: number }) => void;

  // Safety Status & Journey
  safetyStatus: SafetyStatus;
  riskLevel: RiskLevel;
  routeStatus: 'ON NORMAL ROUTE' | 'DEVIATED FROM ROUTE' | 'OFFLINE' | 'ARRIVED';
  isRouteDeviated: boolean;
  activeDestination: string;
  setActiveDestination: (d: string) => void;
  selectedRoute: SafeRouteOption | null;
  setSelectedRoute: (r: SafeRouteOption | null) => void;
  availableRoutes: SafeRouteOption[];
  calculateRoutesForDestination: (dest: string) => void;
  isJourneyActive: boolean;
  startJourney: (route?: SafeRouteOption) => void;
  endJourney: () => void;
  simulateRouteDeviation: () => void;
  startRoute: (route: SafeRouteOption) => void;
  endRoute: () => void;

  // Current Area & Reports
  currentAreaName: string;
  currentAreaRisk: { riskLevel: RiskLevel; score: number; factors: string[] };
  reports: SafetyReport[];
  addReport: (data: {
    areaName: string;
    category: SafetyReport['category'];
    severity: SafetyReport['severity'];
    description: string;
    hasEvidence?: boolean;
  }) => void;
  upvoteReport: (id: string) => void;
  updateReportStatus: (id: string, status: SafetyReport['status']) => void;

  // AI Assessment & Explainability
  aiAssessment: AISafetyAssessment;

  // Watch Telemetry
  watchTelemetry: ReturnType<typeof useWatchTelemetry>['telemetry'];
  watchSimulationMode: WatchSimulationMode;
  setWatchSimulationMode: (mode: WatchSimulationMode) => void;
  isWatchAboveBaseline: boolean;
  activeWatchModel: SmartwatchModel | null;
  pairedWatchModels: SmartwatchModel[];
  pairWatchModel: (model: SmartwatchModel) => void;
  unpairWatch: () => void;
  switchWatchModel: (modelId: string) => void;

  // Contacts & Network
  trustedContacts: TrustedContact[];
  updateContact: (id: string, updates: Partial<TrustedContact>) => void;
  addContact: (c: Omit<TrustedContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  nearbyUsers: NearbyUser[];
  toggleNearbyAvailability: (id: string) => void;

  // Emergency & Evidence
  emergencyState: EmergencyState;
  triggerEmergency: (reason?: string) => void;
  resolveEmergency: (outcomeNote?: string) => void;
  authorizeLocationSharing: () => void;
  revokeLocationSharing: () => void;
  startEvidenceRecording: (type: 'audio' | 'video') => void;
  stopEvidenceRecording: (type: 'audio' | 'video') => void;

  // 5-Minute Safety Check
  safetyCheck: SafetyCheckState;
  promptSafetyCheck: () => void;
  respondSafetyCheck: (isSafe: boolean) => void;
  simulateNoResponse: () => void;

  // Safety Patterns & Learning
  safeZones: SafetyPatternZone[];
  frequentRoutes: SafetyPatternRoute[];
  pauseRoutineLearning: () => void;
  clearLearnedPatterns: () => void;

  // Privacy Controls
  privacy: PrivacyPreferences;
  updatePrivacy: (updates: Partial<PrivacyPreferences>) => void;

  // History & Post-Incident
  incidentHistory: IncidentRecord[];
  postIncidentReport: PostIncidentReportData | null;
  setPostIncidentReport: (r: PostIncidentReportData | null) => void;

  // Demo Full Simulation Engine
  isFullSimRunning: boolean;
  fullSimStage: string;
  fullSimProgress: number; // 0 to 100
  runFullEmergencySimulation: () => void;
  cancelFullSimulation: () => void;
  setSimScenario: (
    scenario:
      | 'normal'
      | 'enter_risk_zone'
      | 'route_deviation'
      | 'ask_safe'
      | 'simulate_no_response'
      | 'abnormal_hr'
      | 'trigger_emergency'
      | 'resolve'
  ) => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Active Tab/Navigation
  activeView: string;
  setActiveView: (view: string) => void;
}

const SafetyContext = createContext<SafetyContextType | null>(null);

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  // Navigation View
  const [activeView, setActiveView] = useState<string>('dashboard');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-01',
    name: 'Maya Lin',
    email: 'maya.lin@student.edu',
    role: 'student',
    phone: '+1 (555) 432-1098',
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Live Location from Hook
  const liveLoc = useLiveLocation();

  // Watch Models State
  const [activeWatchModel, setActiveWatchModel] = useState<SmartwatchModel | null>(
    () => AVAILABLE_SMARTWATCH_MODELS[0]
  );
  const [pairedWatchModels, setPairedWatchModels] = useState<SmartwatchModel[]>(
    () => [AVAILABLE_SMARTWATCH_MODELS[0]]
  );

  // Watch Telemetry Hook
  const {
    telemetry: watchTelemetry,
    mode: watchSimulationMode,
    setSimulationMode: setWatchSimulationMode,
    applyModelCharacteristics,
    isAboveBaseline: isWatchAboveBaseline,
  } = useWatchTelemetry(AVAILABLE_SMARTWATCH_MODELS[0]);

  // Data states
  const [reports, setReports] = useState<SafetyReport[]>(() => ReportService.initialize());
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(INITIAL_CONTACTS);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>(INITIAL_NEARBY_USERS);
  const [safeZones, setSafeZones] = useState<SafetyPatternZone[]>(INITIAL_SAFE_ZONES);
  const [frequentRoutes, setFrequentRoutes] = useState<SafetyPatternRoute[]>(INITIAL_FREQUENT_ROUTES);
  const [incidentHistory, setIncidentHistory] = useState<IncidentRecord[]>(INITIAL_INCIDENT_HISTORY);
  const [postIncidentReport, setPostIncidentReport] = useState<PostIncidentReportData | null>(null);

  // Route & Journey
  const [selectedRoute, setSelectedRoute] = useState<SafeRouteOption | null>(SAMPLE_SAFE_ROUTES[0]);
  const [activeDestination, setActiveDestination] = useState<string>('SRM TRP Engineering College');
  const [availableRoutes, setAvailableRoutes] = useState<SafeRouteOption[]>(SAMPLE_SAFE_ROUTES);
  const [isJourneyActive, setIsJourneyActive] = useState<boolean>(false);
  const [isRouteDeviated, setIsRouteDeviated] = useState<boolean>(false);
  const [inRiskZone, setInRiskZone] = useState<boolean>(false);
  const [currentAreaName, setCurrentAreaName] = useState<string>('Tech Campus Sector');

  // Safety Status
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>('safe');
  const [userResponseStatus, setUserResponseStatus] = useState<
    'RESPONDED_SAFE' | 'WAITING' | 'NO_RESPONSE' | 'HELP_REQUESTED'
  >('RESPONDED_SAFE');

  // Emergency State
  const [emergencyState, setEmergencyState] = useState<EmergencyState>({
    isActive: false,
    startedAt: null,
    triggerReason: '',
    locationSharingAuthorized: false,
    contactsAlerted: [],
    nearbyAlertedCount: 0,
    audioRecording: false,
    videoRecording: false,
    recordingDurationSeconds: 0,
  });

  // 5-Minute Safety Check State
  const [safetyCheck, setSafetyCheck] = useState<SafetyCheckState>({
    isOpen: false,
    countdownSeconds: 300,
    startedAt: 0,
    resolved: false,
  });

  // Privacy State
  const [privacy, setPrivacy] = useState<PrivacyPreferences>({
    locationProcessingActive: true,
    exactLocationProtected: true,
    areaLevelRiskOnly: true,
    emergencySharingAuthorized: false,
    parentLiveVisibility: false,
    nearbyUserNetworkOptIn: true,
    routineLearningEnabled: true,
    reportAnonymityGuaranteed: true,
    evidenceLocalRetention: true,
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Demo Full Simulation State
  const [isFullSimRunning, setIsFullSimRunning] = useState<boolean>(false);
  const [fullSimStage, setFullSimStage] = useState<string>('Ready');
  const [fullSimProgress, setFullSimProgress] = useState<number>(0);
  const simTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev.slice(-4), { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pairWatchModel = useCallback(
    (model: SmartwatchModel) => {
      setActiveWatchModel(model);
      setPairedWatchModels((prev) =>
        prev.some((m) => m.id === model.id) ? prev : [...prev, model]
      );
      applyModelCharacteristics(model);
    },
    [applyModelCharacteristics]
  );

  const unpairWatch = useCallback(() => {
    setActiveWatchModel(null);
    applyModelCharacteristics(null);
    addToast(
      'Smartwatch Disconnected',
      'Biometric device has been unpaired from local safety monitor.',
      'warning'
    );
  }, [applyModelCharacteristics, addToast]);

  const switchWatchModel = useCallback(
    (modelId: string) => {
      const found = AVAILABLE_SMARTWATCH_MODELS.find((m) => m.id === modelId);
      if (found) {
        setActiveWatchModel(found);
        applyModelCharacteristics(found);
        addToast(
          'Watch Profile Switched',
          `Active model set to ${found.name} (${found.series}).`
        );
      }
    },
    [applyModelCharacteristics, addToast]
  );

  // Compute Area Risk
  const currentAreaRisk = calculateAreaRisk(
    reports,
    currentAreaName,
    inRiskZone ? 'HIGH' : 'LOW'
  );

  // Compute AI Assessment dynamically
  const aiAssessment = assessAISafety({
    inRiskZone,
    riskZoneLevel: inRiskZone ? 'HIGH' : 'LOW',
    routeDeviation: isRouteDeviated,
    reportsNearCount: currentAreaRisk.score > 40 ? 15 : 2,
    highSeverityReportsCount: currentAreaRisk.score > 60 ? 3 : 0,
    userResponseStatus,
    telemetry: watchTelemetry,
  });

  // Sync safetyStatus with AI Assessment & Emergency
  useEffect(() => {
    if (emergencyState.isActive) {
      setSafetyStatus('emergency');
    } else if (safetyCheck.isOpen) {
      setSafetyStatus('warning');
    } else if (isRouteDeviated || inRiskZone || aiAssessment.riskLevel === 'HIGH') {
      setSafetyStatus('monitoring');
    } else {
      setSafetyStatus('safe');
    }
  }, [emergencyState.isActive, safetyCheck.isOpen, isRouteDeviated, inRiskZone, aiAssessment.riskLevel]);

  // 5-Minute Safety Check Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (safetyCheck.isOpen && safetyCheck.countdownSeconds > 0 && !safetyCheck.resolved) {
      interval = setInterval(() => {
        setSafetyCheck((prev) => {
          if (prev.countdownSeconds <= 1) {
            // Timer expired without response!
            return { ...prev, countdownSeconds: 0 };
          }
          return { ...prev, countdownSeconds: prev.countdownSeconds - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [safetyCheck.isOpen, safetyCheck.countdownSeconds, safetyCheck.resolved]);

  // When timer hits 0 without response, escalate automatically
  useEffect(() => {
    if (safetyCheck.isOpen && safetyCheck.countdownSeconds === 0 && !safetyCheck.resolved) {
      setUserResponseStatus('NO_RESPONSE');
      addToast('Safety Check Timed Out', 'No response detected. Escalating to AI Emergency Analysis.', 'danger');
      // trigger emergency
      setTimeout(() => {
        triggerEmergency('No response to 5-Minute Safety Check during Route Deviation');
      }, 1200);
    }
  }, [safetyCheck.isOpen, safetyCheck.countdownSeconds, safetyCheck.resolved]);

  // Emergency Recording Duration Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emergencyState.isActive && (emergencyState.audioRecording || emergencyState.videoRecording)) {
      interval = setInterval(() => {
        setEmergencyState((prev) => ({
          ...prev,
          recordingDurationSeconds: prev.recordingDurationSeconds + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emergencyState.isActive, emergencyState.audioRecording, emergencyState.videoRecording]);

  // Auth Methods
  const loginAs = (role: 'student' | 'parent' | 'admin') => {
    if (role === 'student') {
      setCurrentUser({
        id: 'user-01',
        name: 'Maya Lin',
        email: 'maya.lin@student.edu',
        role: 'student',
        phone: '+1 (555) 432-1098',
      });
      setActiveView('dashboard');
    } else if (role === 'parent') {
      setCurrentUser({
        id: 'parent-01',
        name: 'Sarah Chen (Parent)',
        email: 'sarah.chen@example.com',
        role: 'parent',
        phone: '+1 (555) 234-8901',
      });
      setActiveView('dashboard');
    } else {
      setCurrentUser({
        id: 'admin-01',
        name: 'Campus Admin',
        email: 'admin@safetybuddy.io',
        role: 'admin',
        phone: '+1 (555) 000-9911',
      });
      setActiveView('admin');
    }
    setIsAuthenticated(true);
    addToast('Welcome back', `Logged in as ${role === 'student' ? 'Maya Lin' : role === 'parent' ? 'Sarah Chen (Parent)' : 'Campus Admin'}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
    addToast('Logged Out', 'You have been signed out safely.');
  };

  // Route & Journey methods
  const calculateRoutesForDestination = useCallback(
    (dest: string) => {
      setActiveDestination(dest);
      const customRoutes: SafeRouteOption[] = [
        {
          ...SAMPLE_SAFE_ROUTES[0],
          pathCoordinates: [
            [liveLoc.latitude, liveLoc.longitude],
            [liveLoc.latitude + 0.0015, liveLoc.longitude + 0.0018],
            [liveLoc.latitude + 0.003, liveLoc.longitude + 0.004],
            [liveLoc.latitude + 0.0045, liveLoc.longitude + 0.007],
            [liveLoc.latitude + 0.0055, liveLoc.longitude + 0.0084],
          ],
        },
        {
          ...SAMPLE_SAFE_ROUTES[1],
          pathCoordinates: [
            [liveLoc.latitude, liveLoc.longitude],
            [liveLoc.latitude + 0.002, liveLoc.longitude + 0.0025],
            [liveLoc.latitude + 0.004, liveLoc.longitude + 0.0055],
            [liveLoc.latitude + 0.0055, liveLoc.longitude + 0.0084],
          ],
        },
        {
          ...SAMPLE_SAFE_ROUTES[2],
          pathCoordinates: [
            [liveLoc.latitude, liveLoc.longitude],
            [liveLoc.latitude + 0.001, liveLoc.longitude + 0.0015],
            [37.778, -122.417],
            [liveLoc.latitude + 0.0055, liveLoc.longitude + 0.0084],
          ],
        },
      ];
      setAvailableRoutes(customRoutes);
      setSelectedRoute(customRoutes[0]);
      addToast(
        'Safe Routes Analyzed',
        `Evaluated 3 routes to ${dest}. Route 1 recommended (Safety Score 94/100).`,
        'info'
      );
    },
    [liveLoc.latitude, liveLoc.longitude, addToast]
  );

  const startJourney = useCallback(
    (route?: SafeRouteOption) => {
      const targetRoute = route || selectedRoute || availableRoutes[0];
      setSelectedRoute(targetRoute);
      setIsJourneyActive(true);
      setIsRouteDeviated(false);
      setUserResponseStatus('RESPONDED_SAFE');
      addToast(
        'Journey Active',
        `Live GPS tracking route to ${activeDestination}. ETA: ${targetRoute.durationMinutes} min. Route status: ON ROUTE.`,
        'success'
      );
    },
    [selectedRoute, availableRoutes, activeDestination, addToast]
  );

  const endJourney = useCallback(() => {
    setIsJourneyActive(false);
    setIsRouteDeviated(false);
    addToast('Journey Concluded', 'Destination reached safely. Protected location idle.', 'success');
  }, [addToast]);

  const simulateRouteDeviation = useCallback(() => {
    setIsRouteDeviated(true);
    setCurrentAreaName('South Industrial Service Alley');
    liveLoc.setSimulatedCoords({
      latitude: liveLoc.latitude + 0.0035,
      longitude: liveLoc.longitude - 0.0025,
    });
    addToast(
      'Route Deviation Detected',
      'Your current movement differs from the selected safe route. Initiating safety check.',
      'warning'
    );
    promptSafetyCheck();
  }, [liveLoc, addToast]);

  const startRoute = startJourney;
  const endRoute = endJourney;

  // Report methods
  const addReport = (data: {
    areaName: string;
    category: SafetyReport['category'];
    severity: SafetyReport['severity'];
    description: string;
    hasEvidence?: boolean;
  }) => {
    const newRep = ReportService.addReport({
      ...data,
      approxLat: liveLoc.latitude,
      approxLng: liveLoc.longitude,
    });
    setReports([...ReportService.getReports()]);
    addToast('Report submitted securely', 'Your identity will not be publicly displayed. Associated with approximate sector.', 'success');
  };

  const upvoteReport = (id: string) => {
    ReportService.upvoteReport(id);
    setReports([...ReportService.getReports()]);
  };

  const updateReportStatus = (id: string, status: SafetyReport['status']) => {
    ReportService.updateStatus(id, status);
    setReports([...ReportService.getReports()]);
    addToast('Report Updated', `Status changed to ${status}`, 'info');
  };

  // Contacts
  const updateContact = (id: string, updates: Partial<TrustedContact>) => {
    setTrustedContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    addToast('Contact Updated', 'Emergency contact preferences saved.');
  };

  const addContact = (c: Omit<TrustedContact, 'id'>) => {
    const newC: TrustedContact = { ...c, id: `c-${Date.now()}` };
    setTrustedContacts((prev) => [...prev, newC]);
    addToast('Contact Added', `${c.name} added to your trusted circle.`);
  };

  const deleteContact = (id: string) => {
    setTrustedContacts((prev) => prev.filter((c) => c.id !== id));
    addToast('Contact Removed', 'Contact deleted.');
  };

  const toggleNearbyAvailability = (id: string) => {
    setNearbyUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, available: !u.available } : u))
    );
  };

  // 5-Minute Safety Check methods
  const promptSafetyCheck = () => {
    setSafetyCheck({
      isOpen: true,
      countdownSeconds: 300,
      startedAt: Date.now(),
      resolved: false,
    });
    setUserResponseStatus('WAITING');
    addToast('Safety Check Sent', 'Are you safe? Movement differs from expected routine.', 'warning');
  };

  const respondSafetyCheck = (isSafe: boolean) => {
    setSafetyCheck((prev) => ({ ...prev, isOpen: false, resolved: true }));
    if (isSafe) {
      setUserResponseStatus('RESPONDED_SAFE');
      setIsRouteDeviated(false);
      setInRiskZone(false);
      addToast('Status Verified', 'Normal activity re-confirmed. Glad you are safe!', 'success');
    } else {
      setUserResponseStatus('HELP_REQUESTED');
      triggerEmergency('User pressed [NEED HELP] on safety verification');
    }
  };

  const simulateNoResponse = () => {
    setSafetyCheck((prev) => ({ ...prev, countdownSeconds: 0 }));
  };

  // Emergency methods
  const triggerEmergency = (reason = 'Proactive Emergency Detection') => {
    const notified = ['Sarah Chen (Mom)', 'Campus Safety Escort'];
    setEmergencyState({
      isActive: true,
      startedAt: Date.now(),
      triggerReason: reason,
      locationSharingAuthorized: false, // Privacy default: requires explicit authorization
      contactsAlerted: notified,
      nearbyAlertedCount: 2,
      audioRecording: false,
      videoRecording: false,
      recordingDurationSeconds: 0,
    });
    setSafetyStatus('emergency');
    setActiveView('emergency');
    addToast('EMERGENCY SOS ENGAGED', 'Trusted contacts and safety responders notified.', 'danger');
  };

  const authorizeLocationSharing = () => {
    setEmergencyState((prev) => ({ ...prev, locationSharingAuthorized: true }));
    setPrivacy((prev) => ({ ...prev, emergencySharingAuthorized: true }));
    addToast('Location Sharing Authorized', 'Precise GPS is now streaming to Sarah Chen (Mom) and Campus Safety.', 'success');
  };

  const revokeLocationSharing = () => {
    setEmergencyState((prev) => ({ ...prev, locationSharingAuthorized: false }));
    setPrivacy((prev) => ({ ...prev, emergencySharingAuthorized: false }));
    addToast('Location Re-Sealed', 'Precise GPS stream revoked. Privacy layer re-engaged.', 'info');
  };

  const startEvidenceRecording = (type: 'audio' | 'video') => {
    if (type === 'audio') {
      setEmergencyState((prev) => ({ ...prev, audioRecording: true }));
      addToast('Audio Evidence Capture Active', 'Simulated microphone recording securely buffered on-device.', 'warning');
    } else {
      setEmergencyState((prev) => ({ ...prev, videoRecording: true }));
      addToast('Video Evidence Capture Active', 'Simulated emergency camera feed buffering locally.', 'warning');
    }
  };

  const stopEvidenceRecording = (type: 'audio' | 'video') => {
    if (type === 'audio') {
      setEmergencyState((prev) => ({ ...prev, audioRecording: false }));
      addToast('Audio Capture Saved', 'Local encrypted audio buffer preserved.', 'info');
    } else {
      setEmergencyState((prev) => ({ ...prev, videoRecording: false }));
      addToast('Video Capture Saved', 'Local encrypted video file preserved.', 'info');
    }
  };

  const resolveEmergency = (outcomeNote = 'Resolved Safe') => {
    const elapsed = emergencyState.startedAt
      ? Math.round((Date.now() - emergencyState.startedAt) / 1000)
      : 195;

    // Generate post-incident report
    const report = generatePostIncidentReport({
      triggerReason: emergencyState.triggerReason,
      confidenceScore: aiAssessment.emergencyConfidence,
      riskLevel: aiAssessment.riskLevel,
      durationSeconds: Math.max(45, elapsed),
      contactsNotified: emergencyState.contactsAlerted,
    });

    const newIncRecord = toIncidentRecord(report);
    setIncidentHistory((prev) => [newIncRecord, ...prev]);
    setPostIncidentReport(report);

    // Reset emergency state
    setEmergencyState({
      isActive: false,
      startedAt: null,
      triggerReason: '',
      locationSharingAuthorized: false,
      contactsAlerted: [],
      nearbyAlertedCount: 0,
      audioRecording: false,
      videoRecording: false,
      recordingDurationSeconds: 0,
    });

    // Reset safety conditions
    setIsRouteDeviated(false);
    setInRiskZone(false);
    setUserResponseStatus('RESPONDED_SAFE');
    setWatchSimulationMode('normal');
    setSafetyStatus('safe');
    addToast('Emergency Alert Resolved', 'All contacts notified that user is safe. Post-incident report generated.', 'success');
  };

  // Learning / Safe Zone Controls
  const pauseRoutineLearning = () => {
    setPrivacy((prev) => {
      const newVal = !prev.routineLearningEnabled;
      addToast('Routine Learning', newVal ? 'Routine pattern learning resumed.' : 'Routine learning temporarily paused.');
      return { ...prev, routineLearningEnabled: newVal };
    });
  };

  const clearLearnedPatterns = () => {
    setSafeZones([]);
    setFrequentRoutes([]);
    addToast('Patterns Cleared', 'All locally learned safe zones and transit routes have been wiped.', 'warning');
  };

  const updatePrivacy = (updates: Partial<PrivacyPreferences>) => {
    setPrivacy((prev) => ({ ...prev, ...updates }));
    addToast('Privacy Settings Updated', 'Local privacy preferences successfully applied.');
  };

  // DEMO SIMULATION CENTER ENGINE
  const cancelFullSimulation = useCallback(() => {
    simTimeoutRef.current.forEach((t) => clearTimeout(t));
    simTimeoutRef.current = [];
    setIsFullSimRunning(false);
    setFullSimStage('Cancelled');
    setFullSimProgress(0);
    addToast('Simulation Cancelled', 'Demo engine reset to baseline.');
  }, [addToast]);

  const setSimScenario = (
    scenario:
      | 'normal'
      | 'enter_risk_zone'
      | 'route_deviation'
      | 'ask_safe'
      | 'simulate_no_response'
      | 'abnormal_hr'
      | 'trigger_emergency'
      | 'resolve'
  ) => {
    switch (scenario) {
      case 'normal':
        setIsRouteDeviated(false);
        setInRiskZone(false);
        setCurrentAreaName('Tech Campus Promenade');
        setWatchSimulationMode('normal');
        setUserResponseStatus('RESPONDED_SAFE');
        setSafetyCheck((prev) => ({ ...prev, isOpen: false, resolved: true }));
        liveLoc.setSimulatedCoords({ latitude: 37.7735, longitude: -122.4230 });
        addToast('Scenario: Normal Journey', 'Protected location on verified safe route.');
        break;

      case 'enter_risk_zone':
        setInRiskZone(true);
        setCurrentAreaName('Central Road Corridor');
        liveLoc.setSimulatedCoords({ latitude: 37.7780, longitude: -122.4170 });
        addToast('Scenario: Risk Zone Entered', '15 previous reports detected in Central Road. Area-level risk elevated.', 'warning');
        break;

      case 'route_deviation':
        setIsRouteDeviated(true);
        setCurrentAreaName('South Industrial Service Alley');
        liveLoc.setSimulatedCoords({ latitude: 37.7712, longitude: -122.4125 });
        addToast('Scenario: Route Deviation', 'User path diverged from College → Hostel routine.', 'warning');
        break;

      case 'ask_safe':
        promptSafetyCheck();
        break;

      case 'simulate_no_response':
        simulateNoResponse();
        break;

      case 'abnormal_hr':
        setWatchSimulationMode('emergency');
        addToast('Scenario: Biometric Spike', 'Smartwatch telemetry jumped to 142 BPM (Above personal baseline)', 'danger');
        break;

      case 'trigger_emergency':
        triggerEmergency('Manual Demonstration Trigger: High Multi-Signal Risk');
        break;

      case 'resolve':
        resolveEmergency('Demo simulated event resolved safely.');
        break;
    }
  };

  const runFullEmergencySimulation = useCallback(() => {
    cancelFullSimulation();
    setIsFullSimRunning(true);
    setFullSimProgress(5);
    setFullSimStage('1. Normal Journey');

    // Step 1: Normal Journey (0s)
    setSimScenario('normal');
    addToast('Demo Started', '1/12: Normal Journey initiated on safe corridor.');

    // Helper to queue step
    const scheduleStep = (delay: number, fn: () => void, stageName: string, progress: number) => {
      const timer = setTimeout(() => {
        setFullSimStage(stageName);
        setFullSimProgress(progress);
        fn();
      }, delay);
      simTimeoutRef.current.push(timer);
    };

    // Step 2: Risk Zone (4s)
    scheduleStep(
      3500,
      () => {
        setSimScenario('enter_risk_zone');
        addToast('Demo Progress', '2/12: Entered Central Road Risk Zone (15 reports).', 'warning');
      },
      '2. Risk Zone Entered',
      18
    );

    // Step 3: Route Deviation (7s)
    scheduleStep(
      7000,
      () => {
        setSimScenario('route_deviation');
        addToast('Demo Progress', '3/12: Route Deviation detected from learned routine.', 'warning');
      },
      '3. Route Deviation',
      27
    );

    // Step 4: Ask Are You Safe (10s)
    scheduleStep(
      10000,
      () => {
        promptSafetyCheck();
        addToast('Demo Progress', '4/12: 5-minute safety check initiated: "Are you safe?".', 'warning');
      },
      '4. Safety Check Prompt',
      36
    );

    // Step 5: Simulate No Response (14s)
    scheduleStep(
      14000,
      () => {
        setSafetyCheck((prev) => ({ ...prev, countdownSeconds: 0 }));
        setUserResponseStatus('NO_RESPONSE');
        addToast('Demo Progress', '5/12: 5-minute countdown expired: No response.', 'danger');
      },
      '5. No Response Detected',
      45
    );

    // Step 6: Watch Abnormality (17s)
    scheduleStep(
      17000,
      () => {
        setWatchSimulationMode('emergency');
        addToast('Demo Progress', '6/12: Smartwatch biometric alert: HR 146 BPM, High Stress.', 'danger');
      },
      '6. Watch Abnormality',
      55
    );

    // Step 7: AI Safety Analysis (20s)
    scheduleStep(
      20000,
      () => {
        setActiveView('ai-analysis');
        addToast('Demo Progress', '7/12: AI Fusion Engine evaluated confidence to 87% (HIGH RISK).', 'danger');
      },
      '7. AI Safety Analysis (87%)',
      64
    );

    // Step 8: Trigger Emergency (24s)
    scheduleStep(
      24000,
      () => {
        triggerEmergency('AI Multi-Signal Escalation: No response + Heart Rate Anomaly + Route Deviation');
        addToast('Demo Progress', '8/12: Emergency Mode activated!', 'danger');
      },
      '8. Emergency Mode Activated',
      73
    );

    // Step 9: Parent Alert & Nearby Alert (27s)
    scheduleStep(
      27000,
      () => {
        addToast('Demo Progress', '9/12: Parent (Sarah Chen) & 2 Nearby Buddies alerted.', 'danger');
      },
      '9. Contacts & Network Notified',
      82
    );

    // Step 10: Authorized Location Sharing (30s)
    scheduleStep(
      30000,
      () => {
        authorizeLocationSharing();
        addToast('Demo Progress', '10/12: Precise GPS sharing authorized for parent.', 'success');
      },
      '10. Location Sharing Authorized',
      90
    );

    // Step 11: Auto Evidence Capture (33s)
    scheduleStep(
      33000,
      () => {
        startEvidenceRecording('audio');
        addToast('Demo Progress', '11/12: Evidence capture armed on device.', 'warning');
      },
      '11. Audio Evidence Captured',
      95
    );

    // Step 12: Resolution & Post-Incident Report (37s)
    scheduleStep(
      37000,
      () => {
        stopEvidenceRecording('audio');
        resolveEmergency('Full simulation concluded safely by operator.');
        setIsFullSimRunning(false);
        setFullSimProgress(100);
        setFullSimStage('Complete (Post-Incident Generated)');
        setActiveView('history');
        addToast('Demo Complete', '12/12: Emergency resolved. Post-Incident Report generated!', 'success');
      },
      '12. Resolved & Post-Incident Report',
      100
    );
  }, [cancelFullSimulation, addToast]);

  const routeStatus: SafetyContextType['routeStatus'] = isRouteDeviated
    ? 'DEVIATED FROM ROUTE'
    : selectedRoute
    ? 'ON NORMAL ROUTE'
    : 'OFFLINE';

  return (
    <SafetyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loginAs,
        logout,
        location: liveLoc.location || {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
          timestamp: Date.now(),
        },
        latitude: liveLoc.latitude,
        longitude: liveLoc.longitude,
        accuracy: liveLoc.accuracy,
        isTracking: liveLoc.isTracking,
        locationStatus: liveLoc.status,
        requestLocationPermission: liveLoc.requestPermission,
        refreshLocation: liveLoc.refreshLocation,
        setSimulatedCoords: liveLoc.setSimulatedCoords,
        safetyStatus,
        riskLevel: aiAssessment.riskLevel,
        routeStatus,
        isRouteDeviated,
        activeDestination,
        setActiveDestination,
        selectedRoute,
        setSelectedRoute,
        availableRoutes,
        calculateRoutesForDestination,
        isJourneyActive,
        startJourney,
        endJourney,
        simulateRouteDeviation,
        startRoute,
        endRoute,
        currentAreaName,
        currentAreaRisk,
        reports,
        addReport,
        upvoteReport,
        updateReportStatus,
        aiAssessment,
        watchTelemetry,
        watchSimulationMode,
        setWatchSimulationMode,
        isWatchAboveBaseline,
        activeWatchModel,
        pairedWatchModels,
        pairWatchModel,
        unpairWatch,
        switchWatchModel,
        trustedContacts,
        updateContact,
        addContact,
        deleteContact,
        nearbyUsers,
        toggleNearbyAvailability,
        emergencyState,
        triggerEmergency,
        resolveEmergency,
        authorizeLocationSharing,
        revokeLocationSharing,
        startEvidenceRecording,
        stopEvidenceRecording,
        safetyCheck,
        promptSafetyCheck,
        respondSafetyCheck,
        simulateNoResponse,
        safeZones,
        frequentRoutes,
        pauseRoutineLearning,
        clearLearnedPatterns,
        privacy,
        updatePrivacy,
        incidentHistory,
        postIncidentReport,
        setPostIncidentReport,
        isFullSimRunning,
        fullSimStage,
        fullSimProgress,
        runFullEmergencySimulation,
        cancelFullSimulation,
        setSimScenario,
        toasts,
        addToast,
        removeToast,
        activeView,
        setActiveView,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety(): SafetyContextType {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
