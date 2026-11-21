// VillageVerse AI: Multi-Gram Panchayat Governance Context & Directory
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { GramPanchayat, INITIAL_PANCHAYATS } from '../types/panchayat';
export type { GramPanchayat };

interface PanchayatContextType {
  activePanchayat: GramPanchayat;
  panchayats: GramPanchayat[];
  switchPanchayat: (id: string) => void;
  addPanchayat: (newGP: Partial<GramPanchayat>) => Promise<{ success: boolean; id: string }>;
  isCustomGP: boolean;
}

const PanchayatContext = createContext<PanchayatContextType | undefined>(undefined);

export const PanchayatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [panchayats, setPanchayats] = useState<GramPanchayat[]>(() => {
    const saved = localStorage.getItem('villageverse_panchayats_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...INITIAL_PANCHAYATS, ...parsed.filter((p: GramPanchayat) => !INITIAL_PANCHAYATS.some(init => init.id === p.id))];
      } catch {}
    }
    return INITIAL_PANCHAYATS;
  });

  const [activePanchayat, setActivePanchayat] = useState<GramPanchayat>(() => {
    const savedId = localStorage.getItem('villageverse_active_gp_id');
    const matched = panchayats.find(p => p.id === savedId);
    return matched || INITIAL_PANCHAYATS[0];
  });

  // Sync active GP to Supabase village_profile if possible
  const switchPanchayat = (id: string) => {
    const found = panchayats.find(p => p.id === id);
    if (found) {
      setActivePanchayat(found);
      localStorage.setItem('villageverse_active_gp_id', id);

      // Attempt to upsert active GP into Supabase village_profile
      (async () => {
        try {
          await supabase.from('village_profile').upsert({
            id: found.id,
            name: found.name,
            taluk: found.taluk,
            district: found.district,
            state: found.state,
            pincode: found.pincode,
            latitude: found.latitude,
            longitude: found.longitude,
            population: found.population,
            households: found.households,
            area_sq_km: found.area_sq_km,
            health_score: found.health_score,
            agriculture_score: found.agriculture_score,
            water_score: found.water_score,
            electricity_score: found.electricity_score,
            carbon_score: found.carbon_score,
            flood_risk: found.flood_risk
          });
        } catch {}
      })();
    }
  };

  // Add a brand-new custom Gram Panchayat
  const addPanchayat = async (newGP: Partial<GramPanchayat>): Promise<{ success: boolean; id: string }> => {
    const newId = newGP.id || `GP-KA-MND-${Date.now().toString().slice(-3)}`;
    const fullPanchayat: GramPanchayat = {
      id: newId,
      name: newGP.name || 'New Gram Panchayat',
      name_kn: newGP.name_kn || newGP.name || 'ಹೊಸ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ',
      taluk: newGP.taluk || 'Mandya',
      district: newGP.district || 'Mandya',
      state: newGP.state || 'Karnataka',
      pincode: newGP.pincode || '571401',
      latitude: newGP.latitude || 12.5600,
      longitude: newGP.longitude || 76.8900,
      population: Number(newGP.population) || 4500,
      households: Number(newGP.households) || 1050,
      area_sq_km: Number(newGP.area_sq_km) || 14.0,
      health_score: Number(newGP.health_score) || 85,
      agriculture_score: Number(newGP.agriculture_score) || 84,
      water_score: Number(newGP.water_score) || 82,
      electricity_score: Number(newGP.electricity_score) || 88,
      carbon_score: Number(newGP.carbon_score) || 78,
      flood_risk: newGP.flood_risk || 'Low (15%)',
      weather: newGP.weather || { temp: 29.2, condition: 'Clear Sky', humidity: 56, aqi: 40 },
      specialization: newGP.specialization || 'Smart Village Transformation Zone',
      specialization_kn: newGP.specialization_kn || 'ಸ್ಮಾರ್ಟ್ ಗ್ರಾಮ ಅಭಿವೃದ್ಧಿ ವಲಯ'
    };

    const updated = [...panchayats, fullPanchayat];
    setPanchayats(updated);
    setActivePanchayat(fullPanchayat);
    localStorage.setItem('villageverse_panchayats_list', JSON.stringify(updated.filter(p => !INITIAL_PANCHAYATS.some(init => init.id === p.id))));
    localStorage.setItem('villageverse_active_gp_id', fullPanchayat.id);

    // Save to Supabase village_profile
    try {
      await supabase.from('village_profile').upsert({
        id: fullPanchayat.id,
        name: fullPanchayat.name,
        taluk: fullPanchayat.taluk,
        district: fullPanchayat.district,
        state: fullPanchayat.state,
        pincode: fullPanchayat.pincode,
        latitude: fullPanchayat.latitude,
        longitude: fullPanchayat.longitude,
        population: fullPanchayat.population,
        households: fullPanchayat.households,
        area_sq_km: fullPanchayat.area_sq_km,
        health_score: fullPanchayat.health_score,
        agriculture_score: fullPanchayat.agriculture_score,
        water_score: fullPanchayat.water_score,
        electricity_score: fullPanchayat.electricity_score,
        carbon_score: fullPanchayat.carbon_score,
        flood_risk: fullPanchayat.flood_risk
      });
    } catch {}

    return { success: true, id: fullPanchayat.id };
  };

  const isCustomGP = !INITIAL_PANCHAYATS.some(init => init.id === activePanchayat.id);

  return (
    <PanchayatContext.Provider
      value={{
        activePanchayat,
        panchayats,
        switchPanchayat,
        addPanchayat,
        isCustomGP
      }}
    >
      {children}
    </PanchayatContext.Provider>
  );
};

export const usePanchayat = () => {
  const context = useContext(PanchayatContext);
  if (!context) throw new Error('usePanchayat must be used within a PanchayatProvider');
  return context;
};
