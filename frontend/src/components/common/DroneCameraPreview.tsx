import React, { useState, useEffect, useRef } from 'react';
import { Camera, Radio, Eye, Crosshair, Compass, BatteryCharging, ShieldAlert, Maximize2, Zap } from 'lucide-react';

interface DroneCameraPreviewProps {
  className?: string;
  compact?: boolean;
}

type SensorMode = 'optical' | 'thermal' | 'ndvi' | 'night';

const SECTORS = [
  { id: 'sec-a', name: 'Sector A: Water Reservoir & Ward 2', lat: '12.5641° N', lon: '76.8934° E', target: 'AST-002 Tank' },
  { id: 'sec-b', name: 'Sector B: Sugarcane Farmlands', lat: '12.5601° N', lon: '76.8885° E', target: 'Canal Embankment' },
  { id: 'sec-c', name: 'Sector C: Panchayat Administrative Center', lat: '12.5625° N', lon: '76.8922° E', target: 'Panchayat Bhavan' },
  { id: 'sec-d', name: 'Sector D: Solar Microgrid Array', lat: '12.5670° N', lon: '76.8890° E', target: '120 kWp PV Array' }
];

export const DroneCameraPreview: React.FC<DroneCameraPreviewProps> = ({ className = '', compact = false }) => {
  const [selectedSector, setSelectedSector] = useState(SECTORS[0]);
  const [sensorMode, setSensorMode] = useState<SensorMode>('optical');
  const [altitude, setAltitude] = useState(124);
  const [speed, setSpeed] = useState(38);
  const [battery, setBattery] = useState(87);
  const [heading, setHeading] = useState(214);
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live drone simulation canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      offset += 0.8;
      const w = canvas.width;
      const h = canvas.height;

      // Base terrain background based on sensor mode
      if (sensorMode === 'thermal') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#1e1b4b');
        grad.addColorStop(0.5, '#7c2d12');
        grad.addColorStop(0.8, '#ea580c');
        grad.addColorStop(1, '#facc15');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (sensorMode === 'ndvi') {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#064e3b');
        grad.addColorStop(0.4, '#047857');
        grad.addColorStop(0.8, '#10b981');
        grad.addColorStop(1, '#34d399');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (sensorMode === 'night') {
        ctx.fillStyle = '#022c22';
        ctx.fillRect(0, 0, w, h);
      } else {
        // Optical daylight Karnataka village terrain
        const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(0.7, '#0f172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Simulated field grid / topography contours
      ctx.strokeStyle = sensorMode === 'thermal' ? 'rgba(255,255,255,0.2)' : 'rgba(16, 185, 129, 0.18)';
      ctx.lineWidth = 1;

      const gridSize = 40;
      for (let x = (offset % gridSize); x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Simulated target asset bounding box
      const targetX = w / 2 + Math.sin(offset * 0.02) * 25;
      const targetY = h / 2 + Math.cos(offset * 0.02) * 15;

      ctx.strokeStyle = sensorMode === 'thermal' ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(targetX - 35, targetY - 25, 70, 50);

      // Target text tag
      ctx.fillStyle = '#38bdf8';
      ctx.font = '10px monospace';
      ctx.fillText(`LOCKED: ${selectedSector.target}`, targetX - 35, targetY - 30);
      ctx.fillText(`THERM: 31.8°C | STABLE`, targetX - 35, targetY + 38);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [sensorMode, selectedSector]);

  // Subtle telemetry jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setAltitude((prev) => +(prev + (Math.random() * 0.8 - 0.4)).toFixed(1));
      setSpeed((prev) => +(prev + (Math.random() * 1.2 - 0.6)).toFixed(1));
      setHeading((prev) => Math.round((prev + Math.random() * 2 - 1 + 360) % 360));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleSnapshot = () => {
    setIsSnapshotting(true);
    setToastMessage(`Inspection frame captured: ${selectedSector.name}`);
    setTimeout(() => setIsSnapshotting(false), 250);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className={`glass-card p-4 relative overflow-hidden border border-cyan-500/30 ${className}`}>
      {/* Reticle corner brackets */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Snapshot flash */}
      {isSnapshotting && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-200" />
      )}

      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Drone Stream Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            LIVE DRONE SURVEILLANCE
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
            UAV-KA-MND-01
          </span>
        </div>

        {/* Sensor Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-0.5 rounded-lg border border-slate-800">
          {(['optical', 'thermal', 'ndvi', 'night'] as SensorMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSensorMode(mode)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                sensorMode === mode
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
        {/* Canvas animated stream */}
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-cover"
        />

        {/* Scanline overlay */}
        <div className="drone-scanline" />

        {/* Center Crosshair HUD */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-28 h-28 border border-cyan-400/30 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <div className="absolute w-8 h-[1px] bg-cyan-400/60" />
            <div className="absolute h-8 w-[1px] bg-cyan-400/60" />
          </div>
        </div>

        {/* Real-time Telemetry On-Screen Display (OSD) */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-300 bg-slate-950/70 backdrop-blur px-2 py-1 rounded border border-cyan-500/20 space-y-0.5">
          <div>ALT: <span className="font-bold text-white">{altitude}m AGL</span></div>
          <div>SPD: <span className="font-bold text-white">{speed} km/h</span></div>
          <div>HDG: <span className="font-bold text-white">{heading}°</span></div>
        </div>

        <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-300 bg-slate-950/70 backdrop-blur px-2 py-1 rounded border border-cyan-500/20 space-y-0.5 text-right">
          <div>LAT: <span className="font-bold text-white">{selectedSector.lat}</span></div>
          <div>LON: <span className="font-bold text-white">{selectedSector.lon}</span></div>
          <div className="text-emerald-400 flex items-center gap-1 justify-end">
            <BatteryCharging className="w-3 h-3" /> {battery}%
          </div>
        </div>

        {/* Sector Tag Bar at Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700/60">
          <div className="truncate text-slate-300">
            TARGET: <span className="text-cyan-300 font-bold">{selectedSector.name}</span>
          </div>
          <button
            onClick={handleSnapshot}
            className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 rounded border border-cyan-500/40 transition-colors pointer-events-auto"
          >
            <Camera className="w-3 h-3" /> Capture
          </button>
        </div>
      </div>

      {/* Sector Selection Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-3">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            onClick={() => setSelectedSector(sector)}
            className={`px-2 py-1.5 rounded-lg text-left text-[11px] transition-all truncate border ${
              selectedSector.id === sector.id
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span className="block truncate font-mono text-[10px] opacity-75">{sector.id.toUpperCase()}</span>
            <span className="block truncate">{sector.name.split(':')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
