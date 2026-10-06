import React, { useState, useMemo } from 'react';
import { useSafety } from '../../context/SafetyContext';
import { INITIAL_RISK_ZONES } from '../../data/mockData';
import { RiskZone, SafetyReport, NearbyUser } from '../../types/safety';
import {
  Shield,
  AlertTriangle,
  Users,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  CheckCircle2,
  Lock,
  Eye,
  Crosshair,
  MapPin,
  RefreshCw,
} from 'lucide-react';

interface LiveSafetyMapProps {
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
  onSelectZone?: (zone: RiskZone) => void;
  className?: string;
}

export const LiveSafetyMap: React.FC<LiveSafetyMapProps> = ({
  height = 'h-[460px]',
  showControls = true,
  interactive = true,
  onSelectZone,
  className = '',
}) => {
  const {
    latitude,
    longitude,
    accuracy,
    safetyStatus,
    emergencyState,
    selectedRoute,
    isRouteDeviated,
    reports,
    nearbyUsers,
    currentAreaRisk,
    activeDestination,
    refreshLocation,
  } = useSafety();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<{
    riskZones: boolean;
    reports: boolean;
    routes: boolean;
    nearby: boolean;
  }>({
    riskZones: true,
    reports: true,
    routes: true,
    nearby: true,
  });

  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null);

  // Map center reference (campus/city center benchmark)
  const centerLat = 37.7755;
  const centerLng = -122.4185;

  // Project lat/lng into SVG 800x600 coordinate box
  const projectCoords = useMemo(() => {
    return (lat: number, lng: number): { x: number; y: number } => {
      const scaleX = 24000 * zoomLevel;
      const scaleY = 32000 * zoomLevel;
      const x = 400 + (lng - centerLng) * scaleX;
      const y = 300 - (lat - centerLat) * scaleY;
      return { x, y };
    };
  }, [centerLat, centerLng, zoomLevel]);

  const userPoint = useMemo(
    () => projectCoords(latitude, longitude),
    [projectCoords, latitude, longitude]
  );

  // Destination point from selected route's last coordinate
  const destinationPoint = useMemo(() => {
    if (!selectedRoute || !selectedRoute.pathCoordinates.length) return null;
    const lastCoord = selectedRoute.pathCoordinates[selectedRoute.pathCoordinates.length - 1];
    return projectCoords(lastCoord[0], lastCoord[1]);
  }, [selectedRoute, projectCoords]);

  // Computed SVG path for selected route
  const routeSvgPath = useMemo(() => {
    if (!selectedRoute || !selectedRoute.pathCoordinates.length) return '';
    return selectedRoute.pathCoordinates
      .map((coord, idx) => {
        const pt = projectCoords(coord[0], coord[1]);
        return `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
      })
      .join(' ');
  }, [selectedRoute, projectCoords]);

  const isEmergency = safetyStatus === 'emergency' || emergencyState.isActive;

  return (
    <div
      className={`relative w-full ${height} bg-[#FBFBFE] rounded-2xl border border-[#EDE9FE] overflow-hidden select-none flex flex-col shadow-sm ${className}`}
    >
      {/* Map Top Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border shadow-sm ${
              isEmergency
                ? 'bg-[#FEE2E2] border-[#EF4444] text-[#DC2626] animate-pulse'
                : isRouteDeviated
                ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]'
                : 'bg-[#FFFFFF]/90 border-[#DDD6FE] text-[#6D28D9]'
            }`}
          >
            {isEmergency ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>EMERGENCY LOCATION STREAM ACTIVE</span>
              </>
            ) : isRouteDeviated ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                <span>ROUTE DIVERGENCE DETECTED</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                <span className="text-[#171717]">Current Location (Protected)</span>
                <span className="text-[10px] text-[#6B7280] font-mono">±{accuracy}m</span>
              </>
            )}
          </div>

          <button
            onClick={refreshLocation}
            title="Refresh GPS Coordinates"
            className="p-1.5 rounded-xl bg-white/90 hover:bg-white border border-[#E5E7EB] text-[#6D28D9] shadow-sm backdrop-blur-md transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layer Toggles & Zoom */}
        {showControls && (
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <div className="flex items-center bg-[#FFFFFF]/90 border border-[#E5E7EB] rounded-xl p-1 text-xs backdrop-blur-md shadow-sm">
              <button
                onClick={() =>
                  setActiveLayer((prev) => ({ ...prev, riskZones: !prev.riskZones }))
                }
                title="Toggle Risk Zones"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  activeLayer.riskZones
                    ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold'
                    : 'text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Risk Zones
              </button>
              <button
                onClick={() =>
                  setActiveLayer((prev) => ({ ...prev, reports: !prev.reports }))
                }
                title="Toggle Safety Reports"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  activeLayer.reports
                    ? 'bg-[#FEF3C7] text-[#B45309] font-bold'
                    : 'text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Reports
              </button>
              <button
                onClick={() =>
                  setActiveLayer((prev) => ({ ...prev, nearby: !prev.nearby }))
                }
                title="Toggle Nearby Buddies"
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  activeLayer.nearby
                    ? 'bg-[#DCFCE7] text-[#15803D] font-bold'
                    : 'text-[#6B7280] hover:text-[#171717]'
                }`}
              >
                Nearby
              </button>
            </div>

            <div className="flex items-center bg-[#FFFFFF]/90 border border-[#E5E7EB] rounded-xl p-1 backdrop-blur-md shadow-sm">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                className="p-1 hover:bg-[#F3F4F6] rounded-lg text-[#6B7280] hover:text-[#171717]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.2))}
                className="p-1 hover:bg-[#F3F4F6] rounded-lg text-[#6B7280] hover:text-[#171717]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SVG Canvas Map Render */}
      <div className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover transition-transform duration-300"
        >
          <defs>
            {/* Fine grid */}
            <pattern id="light-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EDE9FE" strokeWidth="0.8" />
            </pattern>
            <pattern id="sub-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#F5F3FF" strokeWidth="0.5" />
            </pattern>

            {/* Glowing route filters */}
            <filter id="route-glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial radar gradients for purple user indicator */}
            <radialGradient id="user-purple-radar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="emergency-red-radar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#EF4444" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="600" fill="#F8F7FD" />
          <rect width="800" height="600" fill="url(#sub-grid)" />
          <rect width="800" height="600" fill="url(#light-grid)" />

          {/* City Street Layout (Clean Light Theme) */}
          <g stroke="#E5E7EB" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Main Avenues */}
            <path d="M 50 140 L 750 140" stroke="#E2E8F0" />
            <path d="M 50 300 L 750 300" stroke="#CBD5E1" strokeWidth="26" />
            <path d="M 50 460 L 750 460" stroke="#E2E8F0" />
            {/* North-South Corridors */}
            <path d="M 180 50 L 180 550" stroke="#E2E8F0" />
            <path d="M 380 50 L 380 550" stroke="#CBD5E1" strokeWidth="26" />
            <path d="M 580 50 L 580 550" stroke="#E2E8F0" />
            {/* Diagonal Arterials */}
            <path d="M 120 490 L 680 110" stroke="#D1D5DB" strokeWidth="16" />
            <path d="M 100 120 L 400 350" stroke="#E2E8F0" strokeWidth="12" />
          </g>

          {/* Street Centerlines */}
          <g stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6,6" fill="none">
            <path d="M 50 300 L 750 300" />
            <path d="M 380 50 L 380 550" />
          </g>

          {/* Urban Blocks / Buildings */}
          <g fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1">
            <rect x="70" y="160" width="90" height="120" rx="4" />
            <rect x="200" y="160" width="160" height="120" rx="4" />
            <rect x="400" y="160" width="160" height="120" rx="4" />
            <rect x="600" y="160" width="120" height="120" rx="4" />

            <rect x="70" y="320" width="90" height="120" rx="4" />
            <rect x="200" y="320" width="160" height="120" rx="4" />
            <rect x="400" y="320" width="160" height="120" rx="4" />
            <rect x="600" y="320" width="120" height="120" rx="4" />

            <rect x="200" y="70" width="160" height="50" rx="4" />
            <rect x="400" y="70" width="160" height="50" rx="4" />
          </g>

          {/* Landmark Areas */}
          <g>
            {/* College Campus */}
            <rect
              x="170"
              y="330"
              width="180"
              height="100"
              fill="#F5F3FF"
              stroke="#7C3AED"
              strokeWidth="1.2"
              strokeDasharray="4,3"
              rx="6"
            />
            <text x="260" y="385" fill="#6D28D9" fontSize="10" fontWeight="700" textAnchor="middle">
              TECH UNIVERSITY QUAD
            </text>

            {/* Destination / Landmark */}
            <rect
              x="570"
              y="220"
              width="150"
              height="70"
              fill="#EDE9FE"
              stroke="#6D28D9"
              strokeWidth="1.2"
              strokeDasharray="4,3"
              rx="6"
            />
            <text x="645" y="258" fill="#5B21B6" fontSize="9" fontWeight="700" textAnchor="middle">
              {activeDestination.includes('SRM') ? 'SRM TRP CAMPUS' : 'DESTINATION AREA'}
            </text>
          </g>

          {/* RISK ZONES LAYER */}
          {activeLayer.riskZones &&
            INITIAL_RISK_ZONES.map((zone) => {
              const pt = projectCoords(zone.lat, zone.lng);
              const isHigh = zone.riskLevel === 'HIGH' || zone.riskLevel === 'CRITICAL';
              const color =
                zone.riskLevel === 'CRITICAL'
                  ? '#DC2626'
                  : zone.riskLevel === 'HIGH'
                  ? '#EA580C'
                  : '#D97706';

              return (
                <g
                  key={zone.id}
                  className="cursor-pointer transition-all duration-300 hover:opacity-100 opacity-90"
                  onClick={() => {
                    setSelectedZone(zone);
                    if (onSelectZone) onSelectZone(zone);
                  }}
                >
                  {/* Outer Risk Radius */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={zone.radius * 0.22 * zoomLevel}
                    fill={color}
                    fillOpacity="0.08"
                    stroke={color}
                    strokeWidth="1.4"
                    strokeDasharray={isHigh ? '5,4' : '3,3'}
                  />
                  {/* Label badge */}
                  <g transform={`translate(${pt.x}, ${pt.y})`}>
                    <rect
                      x="-55"
                      y="-12"
                      width="110"
                      height="24"
                      rx="12"
                      fill="#FFFFFF"
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {zone.name.split(' ')[0]} ({zone.reportCount} Rep)
                    </text>
                  </g>
                </g>
              );
            })}

          {/* SAFE ROUTE LAYER */}
          {activeLayer.routes && routeSvgPath && (
            <g>
              {/* Route Glow */}
              <path
                d={routeSvgPath}
                fill="none"
                stroke={isRouteDeviated ? '#F59E0B' : '#7C3AED'}
                strokeWidth="10"
                strokeOpacity="0.25"
                filter="url(#route-glow-purple)"
              />
              {/* Route Core Line */}
              <path
                d={routeSvgPath}
                fill="none"
                stroke={isRouteDeviated ? '#F59E0B' : '#7C3AED'}
                strokeWidth="4"
                strokeDasharray={isRouteDeviated ? '6,4' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          )}

          {/* PREVIOUS REPORTS MARKERS */}
          {activeLayer.reports &&
            reports.slice(0, 10).map((rep) => {
              const pt = projectCoords(rep.approxLat, rep.approxLng);
              const color =
                rep.severity === 'High'
                  ? '#DC2626'
                  : rep.severity === 'Medium'
                  ? '#F59E0B'
                  : '#6B7280';

              return (
                <g key={rep.id} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle r="4" fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              );
            })}

          {/* NEARBY PARTICIPATING USERS */}
          {activeLayer.nearby &&
            nearbyUsers.map((user) => {
              const uLat = latitude + user.latOffset;
              const uLng = longitude + user.lngOffset;
              const pt = projectCoords(uLat, uLng);

              return (
                <g key={user.id} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle r="5" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1.5" />
                  <rect
                    x="8"
                    y="-9"
                    width="84"
                    height="18"
                    rx="4"
                    fill="#FFFFFF"
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                  <text x="13" y="4" fill="#1E40AF" fontSize="8" fontWeight="600">
                    {user.codename.replace('SafetyBuddy User ', '')} ({user.distanceMeters}m)
                  </text>
                </g>
              );
            })}

          {/* DESTINATION PIN MARKER */}
          {destinationPoint && (
            <g transform={`translate(${destinationPoint.x}, ${destinationPoint.y})`}>
              <circle r="14" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
              <circle r="6" fill="#7C3AED" />
              <g transform="translate(0, -28)">
                <rect
                  x="-85"
                  y="-10"
                  width="170"
                  height="22"
                  rx="6"
                  fill="#FFFFFF"
                  stroke="#7C3AED"
                  strokeWidth="1.2"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#6D28D9"
                  fontSize="9"
                  fontWeight="800"
                >
                  📍 {activeDestination}
                </text>
              </g>
            </g>
          )}

          {/* USER LIVE PURPLE PULSING MARKER */}
          <g transform={`translate(${userPoint.x}, ${userPoint.y})`}>
            {/* Accuracy Radius */}
            <circle
              r={Math.max(16, (accuracy / 3) * zoomLevel)}
              fill={isEmergency ? 'url(#emergency-red-radar)' : 'url(#user-purple-radar)'}
              stroke={isEmergency ? '#DC2626' : '#7C3AED'}
              strokeWidth="1"
              strokeDasharray="3,3"
            />

            {/* Radar Wave */}
            <circle
              r="28"
              fill="none"
              stroke={isEmergency ? '#DC2626' : '#8B5CF6'}
              strokeWidth="2"
              className="animate-radar"
            />

            {/* Inner Core */}
            <circle
              r="8"
              fill={isEmergency ? '#DC2626' : '#7C3AED'}
              stroke="#FFFFFF"
              strokeWidth="2.5"
            />

            {/* User Location Label Card */}
            <g transform="translate(0, -32)">
              <rect
                x="-65"
                y="-10"
                width="130"
                height="22"
                rx="6"
                fill="#FFFFFF"
                stroke={isEmergency ? '#DC2626' : '#7C3AED'}
                strokeWidth="1.2"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill={isEmergency ? '#DC2626' : '#6D28D9'}
                fontSize="9"
                fontWeight="800"
              >
                {isEmergency ? '🚨 EMERGENCY LOCATION' : '🟣 Current Location'}
              </text>
            </g>
          </g>
        </svg>

        {/* Selected Zone Detail Card Modal inside Map */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xl animate-in fade-in duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                    selectedZone.riskLevel === 'CRITICAL'
                      ? 'bg-[#FEE2E2] text-[#DC2626]'
                      : selectedZone.riskLevel === 'HIGH'
                      ? 'bg-[#FFEDD5] text-[#EA580C]'
                      : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}
                >
                  {selectedZone.riskLevel} RISK ZONE
                </span>
                <h4 className="text-sm font-bold text-[#171717] mt-1">
                  {selectedZone.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-[#9CA3AF] hover:text-[#171717] text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-[#F3F4F6] text-center">
              <div className="bg-[#F9FAFB] p-1.5 rounded-lg border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280]">Reports</div>
                <div className="text-xs font-bold text-[#171717]">{selectedZone.reportCount}</div>
              </div>
              <div className="bg-[#F9FAFB] p-1.5 rounded-lg border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280]">Crowd</div>
                <div className="text-xs font-bold text-[#171717]">{selectedZone.crowdDensity}</div>
              </div>
              <div className="bg-[#F9FAFB] p-1.5 rounded-lg border border-[#E5E7EB]">
                <div className="text-[10px] text-[#6B7280]">Lighting</div>
                <div className="text-xs font-bold text-[#171717]">{selectedZone.lightingQuality}</div>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-[#4B5563]">
              <span className="font-semibold text-[#171717]">Recent incidents: </span>
              {selectedZone.recentIncidents.join(' • ')}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-white border-t border-[#EDE9FE] flex flex-wrap items-center justify-between text-[11px] text-[#6B7280] gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
            <span className="text-[#171717] font-medium">Your Live Location</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 bg-[#7C3AED] rounded"></span>
            <span className="text-[#171717] font-medium">Recommended Safe Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]"></span>
            <span>High Risk Cluster</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
            <span>Nearby Buddy</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="text-[#6B7280]">Privacy:</span>
          <span className="text-[#16A34A] flex items-center gap-1 font-semibold">
            <Lock className="w-3 h-3" /> Area-level Obfuscated
          </span>
        </div>
      </div>
    </div>
  );
};
