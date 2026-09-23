import React, { useState } from 'react';
import { ScoredMaterial } from '../types';
import { ShieldX, ChevronDown, ChevronUp, AlertOctagon, AlertTriangle } from 'lucide-react';

interface FilteredMaterialsSectionProps {
  filteredMaterials: ScoredMaterial[];
}

export const FilteredMaterialsSection: React.FC<FilteredMaterialsSectionProps> = ({ filteredMaterials }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (filteredMaterials.length === 0) {
    return null;
  }

  return (
    <div id="filtered-materials-section" className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border-b border-slate-200"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
            <ShieldX className="w-4 h-4 text-amber-800" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Hard Constraint Elimination Stage</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                {filteredMaterials.length} Candidates Disqualified
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Eliminated prior to multi-criteria ranking due to biological incompatibility, seal failure, or barrier deficit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span>{isExpanded ? 'Collapse Analysis' : 'Expand Diagnostics'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Material Substrate</th>
                  <th className="py-2.5 px-3">Structure</th>
                  <th className="py-2.5 px-3">Primary Disqualification Driver</th>
                  <th className="py-2.5 px-3 font-mono">OTR / WVTR</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMaterials.map(item => (
                  <tr key={item.material.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.material.name}</div>
                      <div className="text-[11px] text-slate-500">{item.material.category}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {item.material.structure}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item.filterReason || 'Breached mandatory minimum threshold.'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      <div>OTR: {item.material.otrValue}</div>
                      <div>WVTR: {item.material.wvtrValue}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        Zero Score
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
