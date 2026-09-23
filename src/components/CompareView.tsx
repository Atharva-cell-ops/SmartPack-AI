import React, { useState } from 'react';
import { PackagingMaterial } from '../types';
import { PACKAGING_MATERIALS } from '../data/packagingMaterials';
import {
  Scale,
  Plus,
  X,
  Check,
  Droplets,
  Wind,
  Sun,
  Shield,
  Flame,
  Lock,
  DollarSign,
  Leaf,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface CompareViewProps {
  initialMaterialIds?: string[];
  onSelectMaterial?: (id: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  initialMaterialIds = ['laminated-film', 'pet', 'biodegradable-film']
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialMaterialIds.slice(0, 3));

  const selectedMaterials = selectedIds
    .map(id => PACKAGING_MATERIALS.find(m => m.id === id))
    .filter((m): m is PackagingMaterial => m !== undefined);

  const availableMaterials = PACKAGING_MATERIALS.filter(m => !selectedIds.includes(m.id));

  const handleAddMaterial = (id: string) => {
    if (selectedIds.length < 3 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveMaterial = (id: string) => {
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  const handleLoadPreset = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const attributes = [
    { key: 'moistureProtection', label: 'Moisture Barrier (WVTR)', unit: 'Index/100', icon: <Droplets className="w-3.5 h-3.5 text-blue-700" /> },
    { key: 'oxygenProtection', label: 'Oxygen Barrier (OTR)', unit: 'Index/100', icon: <Wind className="w-3.5 h-3.5 text-cyan-700" /> },
    { key: 'lightProtection', label: 'Light / UV Shielding', unit: 'Index/100', icon: <Sun className="w-3.5 h-3.5 text-amber-600" /> },
    { key: 'mechanicalStrength', label: 'Tensile & Puncture Strength', unit: 'Index/100', icon: <Shield className="w-3.5 h-3.5 text-slate-700" /> },
    { key: 'heatResistance', label: 'Thermal Resistance', unit: 'Index/100', icon: <Flame className="w-3.5 h-3.5 text-rose-600" /> },
    { key: 'sealability', label: 'Hermetic Seal Integrity', unit: 'Index/100', icon: <Lock className="w-3.5 h-3.5 text-[#1B4332]" /> },
    { key: 'costScore', label: 'Cost Affordability Index', unit: 'Index/100', icon: <DollarSign className="w-3.5 h-3.5 text-amber-700" /> },
    { key: 'recyclabilityPercent', label: 'Recyclability / Circularity', unit: '%', icon: <Leaf className="w-3.5 h-3.5 text-teal-700" /> }
  ] as const;

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-slate-100 text-slate-800">
              <Scale className="w-4 h-4 text-[#1B4332]" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1B4332]">
              COMPARATIVE MATERIAL ANALYSIS
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Side-by-Side Material Comparator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Benchmark barrier kinetics, mechanical puncture thresholds, cost tiers, and end-of-life recycling across up to 3 substrates.
          </p>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-semibold">Presets:</span>
          <button
            type="button"
            onClick={() => handleLoadPreset(['laminated-film', 'aluminium-foil', 'pet'])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            High Barrier
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset(['kraft-paper', 'paperboard', 'corrugated-cardboard'])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            Cellulosic Paper
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset(['biodegradable-film', 'ldpe', 'pp'])}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
          >
            Bio vs Polymers
          </button>
        </div>
      </div>

      {/* Material Selection Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map(index => {
          const mat = selectedMaterials[index];

          if (mat) {
            return (
              <div
                key={mat.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-start justify-between relative"
              >
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1B4332] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                      Slot {index + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {mat.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {mat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {mat.structure}
                  </p>
                  <div className="pt-2 flex items-center gap-3 text-xs text-slate-600 font-mono">
                    <span>WVTR: <strong>{mat.wvtrValue}</strong></span>
                    <span>OTR: <strong>{mat.otrValue}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMaterial(mat.id)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer absolute right-3 top-3"
                  title="Remove material"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          }

          return (
            <div
              key={`empty-${index}`}
              className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-4 flex flex-col items-center justify-center text-center space-y-2 min-h-[130px]"
            >
              <span className="text-xs font-bold text-slate-600">
                Slot {index + 1}: Empty
              </span>
              {availableMaterials.length > 0 ? (
                <div className="w-full">
                  <select
                    onChange={e => {
                      if (e.target.value) handleAddMaterial(e.target.value);
                    }}
                    defaultValue=""
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800"
                  >
                    <option value="" disabled>+ Add Substrate to Slot...</option>
                    {availableMaterials.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.category})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-xs text-slate-400">All materials selected</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Metrics Table with Visual Bars */}
      {selectedMaterials.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Technical Property Benchmarking Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Calibrated Physical Scales
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-left text-slate-600">
                  <th className="py-3 px-4 w-1/4 font-semibold">Evaluation Parameter</th>
                  {selectedMaterials.map(m => (
                    <th key={m.id} className="py-3 px-4 font-bold text-slate-900">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Benchmark Overall Score (/100) */}
                <tr className="bg-emerald-50/40 border-b border-slate-200">
                  <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                    <span>Suitability Score (/100)</span>
                  </td>
                  {selectedMaterials.map(m => {
                    const benchmarkScore = Math.round(
                      (m.moistureProtection * 0.25) +
                      (m.oxygenProtection * 0.25) +
                      (m.mechanicalStrength * 0.15) +
                      (m.costScore * 0.15) +
                      (m.recyclabilityPercent * 0.20)
                    );
                    return (
                      <td key={m.id} className="py-2.5 px-4">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200 font-mono">
                          ({benchmarkScore}/100)
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Physical ASTM Values */}
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-semibold text-slate-700">
                    ASTM Absolute WVTR (g/m²·day)
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {m.wvtrValue}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-2.5 px-4 font-semibold text-slate-700">
                    ASTM Absolute OTR (cm³/m²·day)
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-2.5 px-4 font-mono font-bold text-slate-900">
                      {m.otrValue}
                    </td>
                  ))}
                </tr>

                {/* Quantitative 0-100 Index Scales */}
                {attributes.map(attr => (
                  <tr key={attr.key} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 flex items-center gap-2">
                      {attr.icon}
                      <span>{attr.label}</span>
                    </td>
                    {selectedMaterials.map(m => {
                      const val = m[attr.key];
                      return (
                        <td key={m.id} className="py-3 px-4">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-mono font-bold text-slate-900">{val}</span>
                            <span className="text-[10px] text-slate-400">{attr.unit}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                val >= 75
                                  ? 'bg-[#1B4332]'
                                  : val >= 50
                                  ? 'bg-blue-600'
                                  : val >= 30
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${val}%` }}
                            />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Qualitative Row: Compostability */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-700 flex items-center gap-2">
                    <Leaf className="w-3.5 h-3.5 text-teal-700" />
                    <span>Industrial Compostability</span>
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-3 px-4">
                      {m.compostability ? (
                        <span className="text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold text-[11px]">
                          Certified Biodegradable (EN 13432)
                        </span>
                      ) : (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          Non-compostable Synthetic
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row: Commercial Cost Classification */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                    <span>Commercial Price Tier</span>
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-3 px-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {m.estimatedCostPerKg}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Row: Primary Strengths */}
                <tr className="hover:bg-slate-50/60 transition-colors bg-slate-50/30">
                  <td className="py-3 px-4 font-semibold text-slate-700 align-top">
                    Primary Advantage
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-3 px-4 text-slate-700 align-top leading-relaxed text-[11px]">
                      <span className="text-[#1B4332] font-bold mr-1">✓</span>
                      {m.advantages[0]}
                    </td>
                  ))}
                </tr>

                {/* Row: Main Limitation */}
                <tr className="hover:bg-slate-50/60 transition-colors bg-slate-50/30">
                  <td className="py-3 px-4 font-semibold text-slate-700 align-top">
                    Main Processing Caveat
                  </td>
                  {selectedMaterials.map(m => (
                    <td key={m.id} className="py-3 px-4 text-slate-700 align-top leading-relaxed text-[11px]">
                      <span className="text-amber-600 font-bold mr-1">⚠</span>
                      {m.limitations[0]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
          No substrates selected for benchmarking. Select at least 1 substrate from the slots above.
        </div>
      )}
    </div>
  );
};
