// VillageVerse AI: Real-Time IoT Monitoring Center & Edge Telemetry Hub
import React, { useState, useEffect } from 'react';
import { usePanchayat } from '../../context/PanchayatContext';
import { 
  Activity, Droplets, Zap, Wind, Thermometer, CloudRain, 
  Sprout, AlertTriangle, ShieldCheck, RefreshCw, Radio, 
  Sliders, ArrowUpRight, Flame, CheckCircle2, BellRing
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorItem {
  id: string;
  name: string;
  category: 'Water' | 'Energy' | 'Environment' | 'Agriculture';
  currentValue: number;
  unit: string;
  nominalRange: string;
  status: 'Normal' | 'Warning' | 'Critical';
  thresholdMax?: number;
  thresholdMin?: number;
  location: string;
  telemetryType: string;
}

export const IoTMonitoringCenter: React.FC = () => {
  const { activePanchayat } = usePanchayat();
  const gpDisplayName = activePanchayat.name.replace(/\s*(Rural\s*)?Gram\s*Panchayat/i, '').trim() || activePanchayat.name;

  const [sensors, setSensors] = useState<SensorItem[]>([
    { id: 'IOT-WTR-01', name: 'Overhead Reservoir 1 Level', category: 'Water', currentValue: 84.5, unit: '%', nominalRange: '40% - 90%', status: 'Normal', thresholdMin: 25, thresholdMax: 95, location: `${gpDisplayName} Ward 1 Ridge`, telemetryType: 'Ultrasonic Pulse' },
    { id: 'IOT-WTR-02', name: 'Deep Solar Borewell #4 Depth', category: 'Water', currentValue: 48.2, unit: 'ft', nominalRange: '30 - 80 ft', status: 'Normal', thresholdMax: 120, location: `${gpDisplayName} Ward 3 Agricultural Belt`, telemetryType: 'Hydrostatic Pressure' },
    { id: 'IOT-WTR-03', name: 'Piped Water TDS Quality', category: 'Water', currentValue: 240, unit: 'ppm', nominalRange: '150 - 300 ppm', status: 'Normal', thresholdMax: 500, location: 'JJM Distribution Culvert', telemetryType: 'Electrochemical Probe' },
    { id: 'IOT-PWR-01', name: '250 kVA Transformer Load', category: 'Energy', currentValue: 68.4, unit: '%', nominalRange: '30% - 80%', status: 'Normal', thresholdMax: 85, location: `${gpDisplayName} GP Bhavan`, telemetryType: 'CT/PT Telemetry' },
    { id: 'IOT-PWR-02', name: 'Smart Streetlight Cluster', category: 'Energy', currentValue: 92.0, unit: '% Active', nominalRange: '85% - 100%', status: 'Normal', thresholdMin: 70, location: `${gpDisplayName} Main Arterial Road`, telemetryType: 'LoRaWAN Ambient Dimmer' },
    { id: 'IOT-PWR-03', name: 'Daily Energy Consumption', category: 'Energy', currentValue: 5400, unit: 'kWh', nominalRange: '4000 - 6500 kWh', status: 'Normal', thresholdMax: 7000, location: `${gpDisplayName} Feeder Substation`, telemetryType: 'Smart Meter AMI' },
    { id: 'IOT-ENV-01', name: 'Air Quality Index (AQI)', category: 'Environment', currentValue: 42, unit: 'AQI', nominalRange: '0 - 50 (Good)', status: 'Normal', thresholdMax: 100, location: `${gpDisplayName} GHPS Station`, telemetryType: 'Optical Particle Counter' },
    { id: 'IOT-ENV-02', name: 'Ambient Temperature', category: 'Environment', currentValue: 29.4, unit: '°C', nominalRange: '22°C - 34°C', status: 'Normal', thresholdMax: 38, location: 'Village Weather Mast', telemetryType: 'Digital Thermistor' },
    { id: 'IOT-ENV-03', name: 'Relative Humidity', category: 'Environment', currentValue: 58.0, unit: '%', nominalRange: '40% - 75%', status: 'Normal', thresholdMax: 85, location: 'Village Weather Mast', telemetryType: 'Capacitive Hygrometer' },
    { id: 'IOT-ENV-04', name: 'Rainfall Precipitation', category: 'Environment', currentValue: 1.2, unit: 'mm', nominalRange: '0 - 50 mm', status: 'Normal', thresholdMax: 65, location: `${gpDisplayName} Lake Bund`, telemetryType: 'Tipping Bucket Gauge' },
    { id: 'IOT-AGR-01', name: 'Farmland Soil Moisture', category: 'Agriculture', currentValue: 62.4, unit: '%', nominalRange: '50% - 75%', status: 'Normal', thresholdMin: 35, thresholdMax: 85, location: 'Survey Plot 142/1 (Sugarcane)', telemetryType: 'FDR Frequency Probe' }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [anomalyMode, setAnomalyMode] = useState<boolean>(false);
  const [pulseCounter, setPulseCounter] = useState(0);

  // Micro-telemetry stream heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCounter(p => p + 1);
      setSensors(prev => prev.map(s => {
        // Natural sensor jitter
        const jitter = (Math.random() - 0.5) * (s.unit === 'kWh' ? 8 : 0.4);
        let val = Number((s.currentValue + jitter).toFixed(1));
        if (s.unit === 'ppm') val = Math.round(s.currentValue + (Math.random() - 0.5) * 2);
        if (s.unit === 'AQI') val = Math.round(s.currentValue + (Math.random() - 0.5));

        let status: 'Normal' | 'Warning' | 'Critical' = 'Normal';
        if (s.thresholdMax && val > s.thresholdMax) status = 'Critical';
        else if (s.thresholdMin && val < s.thresholdMin) status = 'Warning';

        return { ...s, currentValue: val, status };
      }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const triggerAnomalySimulation = () => {
    setAnomalyMode(!anomalyMode);
    if (!anomalyMode) {
      // Inject realistic anomaly for hackathon demonstration
      setSensors(prev => prev.map(s => {
        if (s.id === 'IOT-PWR-01') return { ...s, currentValue: 89.2, status: 'Critical' };
        if (s.id === 'IOT-WTR-01') return { ...s, currentValue: 22.0, status: 'Warning' };
        return s;
      }));
    } else {
      setSensors(prev => prev.map(s => {
        if (s.id === 'IOT-PWR-01') return { ...s, currentValue: 68.4, status: 'Normal' };
        if (s.id === 'IOT-WTR-01') return { ...s, currentValue: 84.5, status: 'Normal' };
        return s;
      }));
    }
  };

  const filteredSensors = activeCategory === 'All'
    ? sensors
    : sensors.filter(s => s.category === activeCategory);

  const activeAlerts = sensors.filter(s => s.status !== 'Normal');

  return (
    <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-4">
      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>IoT Monitoring Center & Edge Telemetry Matrix</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
              11/11 Streams Live
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry from Jal Jeevan Mission, KREDL Community Solar, KSNDMC Weather Station, and APMC Farmland Soil Probes.
          </p>
        </div>

        {/* Action Controls: Filter & Anomaly Simulator */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerAnomalySimulation}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              anomalyMode
                ? 'bg-rose-950 text-rose-300 border-rose-600 shadow-md shadow-rose-900/40 animate-pulse'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800'
            }`}
            title="Demonstrate Real-Time Alert Engine"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{anomalyMode ? 'Reset Telemetry' : 'Simulate Threshold Exceed'}</span>
          </button>
        </div>
      </div>

      {/* 2. Critical Threshold Warning Banner */}
      {activeAlerts.length > 0 && (
        <div className="p-3 rounded-2xl bg-rose-950/70 border border-rose-500/60 backdrop-blur-md flex items-center justify-between gap-3 text-xs text-rose-200">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-4 h-4 text-rose-400 animate-bounce shrink-0" />
            <span>
              <strong>Threshold Exceeded:</strong> {activeAlerts.map(a => `${a.name} (${a.currentValue}${a.unit})`).join(', ')}. Automated alerts dispatched to Gram Panchayat AE & Lineman.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-900 font-mono text-[10px] font-bold text-rose-200 shrink-0">
            SLA: 15 Mins
          </span>
        </div>
      )}

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['All', 'Water', 'Energy', 'Environment', 'Agriculture'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium border transition shrink-0 ${
              activeCategory === cat
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. Sensor Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredSensors.map((sensor) => {
          const isWarning = sensor.status === 'Warning';
          const isCritical = sensor.status === 'Critical';

          return (
            <div 
              key={sensor.id}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCritical 
                  ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-950/50'
                  : isWarning 
                  ? 'bg-amber-950/40 border-amber-500/60'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-emerald-500/40 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {sensor.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                      : isWarning
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {sensor.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug truncate">
                  {sensor.name}
                </h4>
                <span className="text-[10px] text-slate-400 block truncate">{sensor.location}</span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white font-mono">
                      {sensor.currentValue}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{sensor.unit}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block">
                    Range: {sensor.nominalRange}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-emerald-400 font-mono block">99.8% Online</span>
                  <span className="text-[9px] text-slate-500 block truncate max-w-[100px]">{sensor.telemetryType}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
