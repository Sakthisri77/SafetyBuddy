import { useState, useEffect, useCallback, useRef } from 'react';
import { WatchTelemetry, SmartwatchModel } from '../types/safety';

export type WatchSimulationMode = 'normal' | 'elevated' | 'high_hr' | 'emergency';

export function useWatchTelemetry(initialModel?: SmartwatchModel | null) {
  const [activeModel, setActiveModel] = useState<SmartwatchModel | null>(initialModel ?? null);
  const [mode, setMode] = useState<WatchSimulationMode>('normal');
  const [connected, setConnected] = useState<boolean>(true);

  const [telemetry, setTelemetry] = useState<WatchTelemetry>(() => {
    const baseHr = initialModel
      ? Math.round((initialModel.characteristics.baselineHrMin + initialModel.characteristics.baselineHrMax) / 2)
      : 74;

    return {
      heartRate: baseHr + 2,
      baselineHeartRate: baseHr,
      spo2: 98,
      temperature: 36.8,
      stressLevel: 'Normal',
      activity: 'Resting',
      connected: true,
      batteryPct: initialModel ? initialModel.batteryPct : 92,
      timestamp: Date.now(),
      history: [
        { time: '18:50', heartRate: baseHr, stress: 22, temp: 36.7 },
        { time: '18:52', heartRate: baseHr + 1, stress: 24, temp: 36.7 },
        { time: '18:54', heartRate: baseHr + 2, stress: 23, temp: 36.8 },
        { time: '18:56', heartRate: baseHr + 3, stress: 27, temp: 36.8 },
        { time: '18:58', heartRate: baseHr + 1, stress: 25, temp: 36.8 },
      ],
    };
  });

  const modeRef = useRef(mode);
  modeRef.current = mode;

  const modelRef = useRef(activeModel);
  modelRef.current = activeModel;

  const connectedRef = useRef(connected);
  connectedRef.current = connected;

  // Sync when activeModel changes
  const applyModelCharacteristics = useCallback((model: SmartwatchModel | null) => {
    setActiveModel(model);
    if (!model) {
      setConnected(false);
      setTelemetry((prev) => ({
        ...prev,
        connected: false,
      }));
      return;
    }

    setConnected(true);
    const baseHr = Math.round((model.characteristics.baselineHrMin + model.characteristics.baselineHrMax) / 2);
    setTelemetry((prev) => ({
      ...prev,
      connected: true,
      baselineHeartRate: baseHr,
      batteryPct: model.batteryPct,
      heartRate: modeRef.current === 'normal' ? baseHr + 2 : prev.heartRate,
    }));
  }, []);

  const setSimulationMode = useCallback((newMode: WatchSimulationMode) => {
    setMode(newMode);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const currentModel = modelRef.current;
    const baseHr = currentModel
      ? Math.round((currentModel.characteristics.baselineHrMin + currentModel.characteristics.baselineHrMax) / 2)
      : 74;

    let hr = baseHr;
    let spo2 = 98;
    let temp = 36.8;
    let stress: WatchTelemetry['stressLevel'] = 'Normal';
    let activity: WatchTelemetry['activity'] = 'Walking';
    let stressScore = 24;

    switch (newMode) {
      case 'normal':
        hr = baseHr + Math.floor(Math.random() * 5);
        spo2 = 98;
        temp = 36.8;
        stress = 'Normal';
        activity = 'Walking';
        stressScore = 24;
        break;
      case 'elevated':
        hr = baseHr + 24 + Math.floor(Math.random() * 8);
        spo2 = 97;
        temp = 37.1;
        stress = 'Elevated';
        activity = 'Walking';
        stressScore = 62;
        break;
      case 'high_hr':
        hr = baseHr + 48 + Math.floor(Math.random() * 10);
        spo2 = 96;
        temp = 37.3;
        stress = 'High';
        activity = 'Running';
        stressScore = 81;
        break;
      case 'emergency':
        hr = baseHr + 68 + Math.floor(Math.random() * 14);
        spo2 = 94;
        temp = 37.6;
        stress = 'Severe';
        activity = 'Erratic';
        stressScore = 96;
        break;
    }

    setTelemetry((prev) => ({
      ...prev,
      heartRate: hr,
      spo2,
      temperature: Number(temp.toFixed(1)),
      stressLevel: stress,
      activity,
      timestamp: Date.now(),
      history: [
        ...prev.history.slice(-14),
        { time: timeStr, heartRate: hr, stress: stressScore, temp },
      ],
    }));
  }, []);

  // Periodic subtle fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectedRef.current) return;

      const currentMode = modeRef.current;
      const currentModel = modelRef.current;
      const baseHr = currentModel
        ? Math.round((currentModel.characteristics.baselineHrMin + currentModel.characteristics.baselineHrMax) / 2)
        : 74;

      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      setTelemetry((prev) => {
        let hrDelta = (Math.random() - 0.5) * 4;
        let targetBase = baseHr;
        let stressScore = 25;
        let stressText: WatchTelemetry['stressLevel'] = 'Normal';
        let activityText: WatchTelemetry['activity'] = 'Walking';

        if (currentMode === 'normal') {
          targetBase = baseHr;
          stressScore = 24 + Math.floor(Math.random() * 6);
          stressText = 'Normal';
          activityText = 'Walking';
        } else if (currentMode === 'elevated') {
          targetBase = baseHr + 24;
          stressScore = 64 + Math.floor(Math.random() * 6);
          stressText = 'Elevated';
          activityText = 'Walking';
        } else if (currentMode === 'high_hr') {
          targetBase = baseHr + 48;
          stressScore = 82 + Math.floor(Math.random() * 5);
          stressText = 'High';
          activityText = 'Running';
        } else if (currentMode === 'emergency') {
          targetBase = baseHr + 70;
          stressScore = 95 + Math.floor(Math.random() * 5);
          stressText = 'Severe';
          activityText = 'Erratic';
        }

        const newHr = Math.round(targetBase + hrDelta);
        const newStress = Math.min(100, Math.max(10, stressScore));

        return {
          ...prev,
          heartRate: newHr,
          stressLevel: stressText,
          activity: activityText,
          timestamp: Date.now(),
          history: [
            ...prev.history.slice(-14),
            {
              time: timeStr,
              heartRate: newHr,
              stress: newStress,
              temp: prev.temperature,
            },
          ],
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const isAboveBaseline = telemetry.heartRate > (telemetry.baselineHeartRate + 18);

  return {
    telemetry,
    mode,
    activeModel,
    connected,
    setSimulationMode,
    applyModelCharacteristics,
    isAboveBaseline,
  };
}
