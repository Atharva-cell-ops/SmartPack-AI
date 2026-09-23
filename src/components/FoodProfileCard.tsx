import React from 'react';
import { FoodCommodity, SensitivityLevel } from '../types';
import {
  Droplets,
  Flame,
  Sun,
  ShieldAlert,
  Wind,
  Thermometer,
  Activity,
  Tag,
  AlertCircle
} from 'lucide-react';

interface FoodProfileCardProps {
  food: FoodCommodity;
}

const getBadgeColor = (level: SensitivityLevel) => {
  switch (level) {
    case 'High':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Low':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  }
};

export const FoodProfileCard: React.FC<FoodProfileCardProps> = ({ food }) => {
  return (
    <div id="food-profile-card" className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              {food.category}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              {food.profile.prototypeBasis === 'LITERATURE_BENCHMARK' ? 'ASTM / Literature Calibrated' : 'Research Dataset'}
            </span>
            <span className="text-xs text-slate-500 font-medium">Standard Shelf Life: ~{food.recommendedShelfLifeDays} days</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            {food.name} — Physicochemical Baseline Profile
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">{food.description}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-[#059669]" />
            <span>Optimal: <strong>{food.recommendedStorageTemp}°C</strong></span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            <span>RH: <strong>{food.recommendedStorageRH}%</strong></span>
          </div>
        </div>
      </div>

      {/* Grid of Key Physicochemical Sensitivities */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3.5">
        {/* Moisture Sensitivity */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-600" /> Moisture
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeColor(food.profile.moistureSensitivity)}`}>
              {food.profile.moistureSensitivity}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mt-1.5">{food.profile.moisturePercentage}</p>
          <span className="text-[10px] text-slate-500">Equilibrium Moisture Content</span>
        </div>

        {/* Oxygen Sensitivity */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-700" /> Oxygen
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeColor(food.profile.oxygenSensitivity)}`}>
              {food.profile.oxygenSensitivity}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mt-1.5">
            {food.profile.oxygenSensitivity === 'High' ? 'Extreme Auto-oxidation' : 'Moderate Gas Retention'}
          </p>
          <span className="text-[10px] text-slate-500">Lipid & Color Vector</span>
        </div>

        {/* Fat Level */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Fat / Lipid
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeColor(food.profile.fatLevel)}`}>
              {food.profile.fatLevel}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mt-1.5">
            {food.profile.fatLevel === 'High' ? 'Lipids > 25%' : food.profile.fatLevel === 'Medium' ? 'Lipids ~5% - 25%' : 'Low Lipids < 5%'}
          </p>
          <span className="text-[10px] text-slate-500">Rancidity Precursor</span>
        </div>

        {/* Acidity (pH) */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" /> Acidity (pH)
            </span>
          </div>
          <p className="text-xs font-bold text-slate-900 mt-1.5">{food.profile.acidity}</p>
          <span className="text-[10px] text-slate-500">Corrosion & Spoilage Factor</span>
        </div>
      </div>

      {/* Primary Degradation Pathways */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Primary Degradation Vector:</span>
          <span className="text-slate-600">
            {food.profile.primaryDeteriorationMode}
          </span>
        </div>
        {food.profile.isFreshProduce && (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Active Horticultural Respiration ({food.profile.respirationCategory})
          </span>
        )}
      </div>
    </div>
  );
};
