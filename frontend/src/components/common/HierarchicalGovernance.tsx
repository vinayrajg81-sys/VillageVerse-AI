// VillageVerse AI: Multi-Level Hierarchical Governance & Drill-Down Analytics
import React, { useState } from 'react';
import { usePanchayat } from '../../context/PanchayatContext';
import { 
  Building2, MapPin, ChevronRight, Layers, ShieldCheck, 
  BarChart3, Globe, Filter, CheckCircle2 
} from 'lucide-react';

export type GovernanceTier = 'state' | 'district' | 'taluk' | 'gp' | 'village';

interface HierarchyNode {
  id: string;
  name: string;
  name_kn: string;
  type: GovernanceTier;
  population: number;
  households: number;
  healthScore: number;
  waterCoverage: number;
  solarShare: number;
  panchayatsCount?: number;
  villagesCount?: number;
}

const HIERARCHY_TREE = {
  state: {
    id: 'KA',
    name: 'Karnataka',
    name_kn: 'ಕರ್ನಾಟಕ',
    type: 'state' as GovernanceTier,
    population: 67562000,
    households: 15400000,
    healthScore: 82,
    waterCoverage: 89,
    solarShare: 38,
    districts: [
      {
        id: 'KA-MND',
        name: 'Mandya District',
        name_kn: 'ಮಂಡ್ಯ ಜಿಲ್ಲೆ',
        type: 'district' as GovernanceTier,
        population: 1805769,
        households: 428000,
        healthScore: 84,
        waterCoverage: 91,
        solarShare: 42,
        taluks: [
          {
            id: 'KA-MND-TAL-01',
            name: 'Mandya Taluk',
            name_kn: 'ಮಂಡ್ಯ ತಾಲೂಕು',
            type: 'taluk' as GovernanceTier,
            population: 382400,
            households: 89500,
            healthScore: 85,
            waterCoverage: 93,
            solarShare: 44,
            gps: [
              {
                id: 'GP-KA-MND-042',
                name: 'Shivalli Gram Panchayat',
                name_kn: 'ಶಿವಳ್ಳಿ ಗ್ರಾಮ ಪಂಚಾಯತ್',
                type: 'gp' as GovernanceTier,
                population: 4820,
                households: 1140,
                healthScore: 86,
                waterCoverage: 96,
                solarShare: 45.4,
                villages: [
                  { id: 'VIL-01', name: 'Shivalli Main', name_kn: 'ಶಿವಳ್ಳಿ ಮುಖ್ಯ ಗ್ರಾಮ', population: 2450, households: 580, healthScore: 88, waterCoverage: 98, solarShare: 48 },
                  { id: 'VIL-02', name: 'Byadarahalli', name_kn: 'ಬ್ಯಾಡರಹಳ್ಳಿ', population: 1320, households: 310, healthScore: 84, waterCoverage: 94, solarShare: 42 },
                  { id: 'VIL-03', name: 'Hulivana Cross', name_kn: 'ಹುಲಿವಾನ ಕ್ರಾಸ್', population: 1050, households: 250, healthScore: 85, waterCoverage: 95, solarShare: 44 }
                ]
              },
              {
                id: 'GP-KA-MND-043',
                name: 'Keragodu Gram Panchayat',
                name_kn: 'ಕೆರೆಗೋಡು ಗ್ರಾಮ ಪಂಚಾಯತ್',
                type: 'gp' as GovernanceTier,
                population: 5210,
                households: 1210,
                healthScore: 81,
                waterCoverage: 88,
                solarShare: 36,
                villages: []
              },
              {
                id: 'GP-KA-MND-044',
                name: 'Dudda Gram Panchayat',
                name_kn: 'ದುದ್ದ ಗ್ರಾಮ ಪಂಚಾಯತ್',
                type: 'gp' as GovernanceTier,
                population: 4680,
                households: 1080,
                healthScore: 83,
                waterCoverage: 90,
                solarShare: 40,
                villages: []
              }
            ]
          }
        ]
      }
    ]
  }
};

interface HierarchicalGovernanceProps {
  onSelectTier?: (tier: GovernanceTier, id: string) => void;
  compact?: boolean;
}

export const HierarchicalGovernance: React.FC<HierarchicalGovernanceProps> = ({ 
  onSelectTier, 
  compact = false 
}) => {
  const { activePanchayat, panchayats, switchPanchayat } = usePanchayat();
  const [selectedState] = useState(HIERARCHY_TREE.state);
  const [selectedDistrict, setSelectedDistrict] = useState(HIERARCHY_TREE.state.districts[0]);
  const [selectedTaluk, setSelectedTaluk] = useState(HIERARCHY_TREE.state.districts[0].taluks[0]);
  const [activeTier, setActiveTier] = useState<GovernanceTier>('gp');

  const selectedGP = {
    id: activePanchayat.id,
    name: activePanchayat.name,
    name_kn: activePanchayat.name_kn,
    type: 'gp' as GovernanceTier,
    population: activePanchayat.population,
    households: activePanchayat.households,
    healthScore: activePanchayat.health_score,
    waterCoverage: activePanchayat.water_score,
    solarShare: activePanchayat.electricity_score,
    villages: [
      { id: 'VIL-01', name: `${activePanchayat.name.replace(' Gram Panchayat', '')} Main Habitation`, name_kn: activePanchayat.name_kn, population: Math.round(activePanchayat.population * 0.55), households: Math.round(activePanchayat.households * 0.55), healthScore: activePanchayat.health_score, waterCoverage: activePanchayat.water_score, solarShare: 45 },
      { id: 'VIL-02', name: `${activePanchayat.name.replace(' Gram Panchayat', '')} East Extension`, name_kn: 'ಪೂರ್ವ ಬಡಾವಣೆ', population: Math.round(activePanchayat.population * 0.45), households: Math.round(activePanchayat.households * 0.45), healthScore: activePanchayat.health_score - 2, waterCoverage: activePanchayat.water_score - 3, solarShare: 40 }
    ]
  };

  const [selectedVillage, setSelectedVillage] = useState(selectedGP.villages[0]);

  const handleSelectTier = (tier: GovernanceTier) => {
    setActiveTier(tier);
    if (onSelectTier) {
      if (tier === 'state') onSelectTier('state', selectedState.id);
      else if (tier === 'district') onSelectTier('district', selectedDistrict.id);
      else if (tier === 'taluk') onSelectTier('taluk', selectedTaluk.id);
      else if (tier === 'gp') onSelectTier('gp', selectedGP.id);
      else if (tier === 'village') onSelectTier('village', selectedVillage.id);
    }
  };

  const currentStats = 
    activeTier === 'state' ? selectedState :
    activeTier === 'district' ? selectedDistrict :
    activeTier === 'taluk' ? selectedTaluk :
    activeTier === 'village' ? selectedVillage : selectedGP;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs py-1.5 px-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-400" />
          Jurisdiction:
        </span>
        <div className="flex items-center gap-1 text-slate-300 font-mono text-[11px]">
          <span className="hover:text-emerald-400 cursor-pointer" onClick={() => handleSelectTier('state')}>
            {selectedState.name}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="hover:text-emerald-400 cursor-pointer" onClick={() => handleSelectTier('district')}>
            {selectedDistrict.name}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="hover:text-emerald-400 cursor-pointer" onClick={() => handleSelectTier('taluk')}>
            {selectedTaluk.name}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            {selectedGP.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 rounded-3xl border border-white/[0.08] space-y-4">
      {/* Header and Tier Selector Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Multi-Tier Administrative Governance Engine
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold">
              Hierarchical Drill-Down
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Seamless horizontal and vertical analytics from National/State level down to individual Gram Panchayats and Village Habitations.
          </p>
        </div>

        {/* Governance Tier Switcher Chips */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 text-xs">
          {(['state', 'district', 'taluk', 'gp', 'village'] as GovernanceTier[]).map((tier) => (
            <button
              key={tier}
              onClick={() => handleSelectTier(tier)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                activeTier === tier
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier === 'gp' ? 'Gram Panchayat' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb Hierarchy Path */}
      <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1 no-scrollbar text-slate-400 font-mono">
        <span 
          onClick={() => handleSelectTier('state')}
          className={`cursor-pointer px-2.5 py-1 rounded-lg transition ${activeTier === 'state' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}`}
        >
          State: {selectedState.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          onClick={() => handleSelectTier('district')}
          className={`cursor-pointer px-2.5 py-1 rounded-lg transition ${activeTier === 'district' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}`}
        >
          District: {selectedDistrict.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          onClick={() => handleSelectTier('taluk')}
          className={`cursor-pointer px-2.5 py-1 rounded-lg transition ${activeTier === 'taluk' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}`}
        >
          Taluk: {selectedTaluk.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          onClick={() => handleSelectTier('gp')}
          className={`cursor-pointer px-2.5 py-1 rounded-lg transition ${activeTier === 'gp' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}`}
        >
          GP: {selectedGP.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

        <span 
          onClick={() => handleSelectTier('village')}
          className={`cursor-pointer px-2.5 py-1 rounded-lg transition ${activeTier === 'village' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'hover:text-white'}`}
        >
          Village: {selectedVillage.name}
        </span>
      </div>

      {/* Aggregated Tier Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">Tier Jurisdiction</span>
          <span className="font-bold text-white text-xs block truncate">{currentStats.name}</span>
          <span className="text-[10px] text-emerald-400 font-mono block">Level: {activeTier.toUpperCase()}</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">Population</span>
          <span className="font-extrabold text-cyan-300 text-sm block">
            {currentStats.population.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">{currentStats.households.toLocaleString('en-IN')} Households</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">Health Score</span>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-emerald-400 text-sm">{currentStats.healthScore}</span>
            <span className="text-[10px] text-slate-500">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Tier 1 Sovereign</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">JJM Tap Coverage</span>
          <span className="font-extrabold text-teal-300 text-sm block">{currentStats.waterCoverage}%</span>
          <span className="text-[10px] text-teal-400/80 font-mono">Piped Potable</span>
        </div>

        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <span className="text-[10px] text-slate-400 uppercase font-mono block mb-0.5">Solar Net Share</span>
          <span className="font-extrabold text-amber-300 text-sm block">{currentStats.solarShare}%</span>
          <span className="text-[10px] text-amber-400/80 font-mono">Clean Microgrid</span>
        </div>
      </div>

      {/* Gram Panchayat Directory Selector Row */}
      <div className="pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Gram Panchayats under Mandya Taluk ({panchayats.length} Active):
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">
            Click to switch active digital twin
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {panchayats.map((gp) => {
            const isCurrent = activePanchayat.id === gp.id;
            return (
              <button
                key={gp.id}
                onClick={() => {
                  switchPanchayat(gp.id);
                  if (onSelectTier) onSelectTier('gp', gp.id);
                }}
                className={`text-left p-3 rounded-2xl border transition relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-slate-700'
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Active</span>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition truncate pr-8">
                    {gp.name.replace(' Gram Panchayat', '')}
                  </div>
                  <div className="text-[10px] text-amber-300/80 font-medium truncate">
                    {gp.name_kn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-1">
                    <span>{gp.population.toLocaleString('en-IN')} pop</span>
                    <span className="text-emerald-400 font-bold">{gp.health_score}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
