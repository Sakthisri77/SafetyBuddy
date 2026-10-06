import React, { useState, useEffect } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { AVAILABLE_SMARTWATCH_MODELS } from '../../data/mockData';
import { SmartwatchModel } from '../../types/safety';
import {
  Watch,
  Bluetooth,
  Radio,
  ShieldCheck,
  Lock,
  Battery,
  Zap,
  CheckCircle2,
  X,
  RefreshCw,
  Cpu,
  KeyRound,
  Signal,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PairDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PairingStep = 'scanning' | 'handshake' | 'passkey' | 'encrypting' | 'success';

export const PairDeviceModal: React.FC<PairDeviceModalProps> = ({ isOpen, onClose }) => {
  const { activeWatchModel, pairWatchModel, addToast } = useSafety();

  const [step, setStep] = useState<PairingStep>('scanning');
  const [selectedDevice, setSelectedDevice] = useState<SmartwatchModel | null>(null);
  const [generatedPasskey, setGeneratedPasskey] = useState<string>('839 214');
  const [discoveredDevices, setDiscoveredDevices] = useState<SmartwatchModel[]>([]);
  const [isRefreshingScan, setIsRefreshingScan] = useState<boolean>(false);
  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);

  // Simulate scanning discovery when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('scanning');
      setSelectedDevice(null);
      setIsRefreshingScan(true);
      setDiscoveredDevices([]);

      // Stagger device appearances as if discovered via BLE advertising packets
      const timer1 = setTimeout(() => {
        setDiscoveredDevices([AVAILABLE_SMARTWATCH_MODELS[0]]);
      }, 400);

      const timer2 = setTimeout(() => {
        setDiscoveredDevices([AVAILABLE_SMARTWATCH_MODELS[0], AVAILABLE_SMARTWATCH_MODELS[1]]);
      }, 900);

      const timer3 = setTimeout(() => {
        setDiscoveredDevices(AVAILABLE_SMARTWATCH_MODELS);
        setIsRefreshingScan(false);
      }, 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartPairing = (device: SmartwatchModel) => {
    setSelectedDevice(device);
    setStep('handshake');

    // Generate random 6-digit numeric passkey
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const formattedCode = `${code.slice(0, 3)} ${code.slice(3)}`;
    setGeneratedPasskey(formattedCode);

    setHandshakeLog([
      `Initiating BLE connection to ${device.name} [${device.bleAddress}]...`,
      `Negotiating MTU packet size (512 bytes)...`,
      `Requesting Secure Connections Pairing with Numeric Comparison...`,
      `Comparing Bluetooth IO Capabilities...`,
    ]);

    setTimeout(() => {
      setStep('passkey');
    }, 1800);
  };

  const handleConfirmPasskey = () => {
    setStep('encrypting');
    setHandshakeLog([
      `User confirmed passkey [${generatedPasskey}] match.`,
      `Deriving AES-128-CCM session encryption keys...`,
      `Verifying manufacturer attestation: ${selectedDevice?.security.certStatus}...`,
      `Subscribing to encrypted physiological notify characteristics...`,
    ]);

    setTimeout(() => {
      if (selectedDevice) {
        pairWatchModel(selectedDevice);
        addToast(
          'Device Paired Successfully',
          `Connected to ${selectedDevice.name} (${selectedDevice.series}). Sensor pipeline active.`,
          'success'
        );
      }
      setStep('success');
    }, 1600);
  };

  const handleRescan = () => {
    setIsRefreshingScan(true);
    setDiscoveredDevices([]);
    setTimeout(() => {
      setDiscoveredDevices(AVAILABLE_SMARTWATCH_MODELS);
      setIsRefreshingScan(false);
    }, 1000);
  };

  const getSignalStrength = (rssi: number) => {
    if (rssi >= -50) return { label: 'Excellent (-44 dBm)', bars: 4, color: 'text-[#059669]' };
    if (rssi >= -60) return { label: 'Good (-58 dBm)', bars: 3, color: 'text-[#059669]' };
    return { label: 'Fair (-62 dBm)', bars: 2, color: 'text-[#D97706]' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B4B]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white border border-[#EDE9FE] rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] flex items-center justify-center">
              <Bluetooth className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider font-bold text-[#7C3AED] uppercase bg-[#EDE9FE] px-2 py-0.5 rounded-lg border border-[#DDD6FE]">
                  BLUETOOTH LE DISCOVERY
                </span>
                <span className="text-xs text-[#6B7280]">Secure Biometric Link</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1B4B] mt-0.5">
                Pair New Smartwatch Device
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[#F5F3FF] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Content by Step */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-4">
          {/* STEP 1: SCANNING & DISCOVERED DEVICES */}
          {step === 'scanning' && (
            <>
              {/* Radar Banner */}
              <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 flex items-center justify-center text-[#7C3AED]">
                    <Radio className="w-5 h-5 animate-pulse" />
                    <span className="absolute inset-0 rounded-full border border-[#7C3AED]/40 animate-ping" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1B4B]">
                      {isRefreshingScan
                        ? 'Broadcasting BLE Inquire packets...'
                        : `Found ${discoveredDevices.length} Compatible Smartwatches Nearby`}
                    </div>
                    <p className="text-[11px] text-[#6B7280]">
                      Scanning 2.4 GHz Bluetooth spectrum for verified biometric sensors.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRescan}
                  disabled={isRefreshingScan}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#EDE9FE] text-xs text-[#7C3AED] border border-[#DDD6FE] font-bold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingScan ? 'animate-spin' : ''}`} />
                  <span>Rescan</span>
                </button>
              </div>

              {/* Models List */}
              <div className="space-y-3">
                {discoveredDevices.map((device) => {
                  const isCurrent = activeWatchModel?.id === device.id;
                  const signal = getSignalStrength(device.rssi);

                  return (
                    <div
                      key={device.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#F5F3FF] border-[#7C3AED] ring-1 ring-[#7C3AED]/30'
                          : 'bg-white border-[#EDE9FE] hover:border-[#C4B5FD] hover:bg-[#FAFAFA]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1E1B4B]">{device.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280]">
                              {device.series}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ACTIVE PAIRED
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-[#6B7280] mt-1 font-mono">
                            <span>MAC: {device.bleAddress}</span>
                            <span>•</span>
                            <span className={signal.color}>RSSI: {device.rssi} dBm</span>
                            <span>•</span>
                            <span className="text-[#1E1B4B] font-semibold">Battery: {device.batteryPct}%</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0">
                          {isCurrent ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-xl bg-[#ECFDF5] text-[#059669] text-xs font-bold border border-[#A7F3D0]"
                            >
                              Currently Active
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartPairing(device)}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                            >
                              <Bluetooth className="w-3.5 h-3.5" />
                              <span>Pair & Connect</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Sensor Characteristics & Description */}
                      <div className="mt-3 pt-3 border-t border-[#F3F4F6] space-y-2">
                        <div className="text-xs text-[#4B5563]">
                          <span className="text-[#6B7280] font-semibold">Specialization: </span>
                          <span className="text-[#7C3AED] font-bold">{device.characteristics.specialty}</span>
                        </div>
                        <p className="text-[11px] text-[#6B7280] leading-relaxed">
                          {device.characteristics.description}
                        </p>

                        {/* Sensor Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {device.sensors.map((sensor, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#6D28D9] border border-[#DDD6FE]"
                            >
                              {sensor}
                            </span>
                          ))}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                            Norm HR: {device.characteristics.baselineHrMin}–{device.characteristics.baselineHrMax} BPM
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                            Distress Latency: {device.characteristics.latencySeconds}s
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 2: HANDSHAKE IN PROGRESS */}
          {step === 'handshake' && selectedDevice && (
            <div className="py-8 text-center space-y-5">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Bluetooth className="w-8 h-8 text-[#7C3AED] animate-pulse" />
                <span className="absolute inset-0 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1E1B4B]">
                  Connecting to {selectedDevice.name}...
                </h3>
                <p className="text-xs text-[#6B7280] mt-1 font-mono">
                  BLE Secure Connection Protocol Initialized
                </p>
              </div>

              {/* Handshake Terminal Logs */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-left font-mono text-[11px] space-y-1.5 text-[#059669]">
                {handshakeLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#7C3AED] font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: NUMERIC COMPARISON PASSKEY PROMPT */}
          {step === 'passkey' && selectedDevice && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#7C3AED] uppercase">
                  BLUETOOTH NUMERIC COMPARISON
                </span>
                <h3 className="text-lg font-black text-[#1E1B4B] mt-1">
                  Confirm Pairing Code
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
                  Verify that this 6-digit numeric passkey matches the display on your{' '}
                  <span className="text-[#1E1B4B] font-bold">{selectedDevice.name}</span>.
                </p>
              </div>

              {/* Big 6-digit Passkey Display */}
              <div className="p-5 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] max-w-xs mx-auto shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-[#7C3AED] tracking-widest font-mono">
                  {generatedPasskey}
                </div>
                <div className="text-[10px] text-[#6B7280] mt-1 font-mono">
                  AES-128-CCM Ephemeral Salt
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] max-w-md mx-auto text-xs text-[#6B7280] text-left flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <span>
                  Numeric comparison prevents Man-in-the-Middle (MITM) sensor spoofing on the local Bluetooth frequency.
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setStep('scanning')}
                  className="px-4 py-2.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#4B5563] text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPasskey}
                  className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Passkey Matches — Confirm Pair</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ENCRYPTING & ATTESTING */}
          {step === 'encrypting' && (
            <div className="py-8 text-center space-y-5">
              <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#7C3AED] animate-bounce" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1E1B4B]">
                  Establishing Encrypted Biometric Channel
                </h3>
                <p className="text-xs text-[#6B7280] mt-1">
                  Exchanging ECDH public keys & authenticating hardware root certificate...
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F8F9FD] border border-[#EDE9FE] text-left font-mono text-[11px] space-y-1.5 text-[#059669]">
                {handshakeLog.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#7C3AED] font-bold">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'success' && selectedDevice && (
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] text-[#059669] mx-auto flex items-center justify-center animate-in zoom-in-75">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#059669] uppercase">
                  PAIRING SUCCESSFUL
                </span>
                <h3 className="text-xl font-black text-[#1E1B4B] mt-1">
                  {selectedDevice.name} Connected
                </h3>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
                  Active model updated. Telemetry pipeline has re-calibrated baselines and active sensor characteristics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] max-w-md mx-auto text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Active Device:</span>
                  <span className="font-bold text-[#1E1B4B]">{selectedDevice.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Hardware Firmware:</span>
                  <span className="font-mono text-[#1E1B4B]">{selectedDevice.firmware}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Biometric Latency:</span>
                  <span className="text-[#059669] font-mono font-bold">{selectedDevice.characteristics.latencySeconds}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Sampling Rate:</span>
                  <span className="font-mono text-[#1E1B4B] font-bold">{selectedDevice.sampleRateHz} Hz</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-[#7C3AED]/20"
                >
                  Done & Return to Watch Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#059669]" /> FIPS 140-3 Cryptographic Core
          </span>
          <span>Zero-Knowledge Location & Sensor Link</span>
        </div>
      </div>
    </div>
  );
};
