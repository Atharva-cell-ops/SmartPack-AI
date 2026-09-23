import React from 'react';
import { Menu, Sparkles, Search, ClipboardCheck, SlidersHorizontal, Database, Info, Layers } from 'lucide-react';
import { NavigationTabType } from './Navbar';
import { FOOD_COMMODITIES } from '../data/foodCommodities';

interface TopHeaderProps {
  activeTab: NavigationTabType;
  setActiveTab: (tab: NavigationTabType) => void;
  onQuickStart: (foodId?: string) => void;
  onToggleMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickStart,
  onToggleMobileMenu
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Packaging Engineering Dashboard',
          subtitle: 'Physicochemical food property analysis, storage simulation, and packaging material selection.'
        };
      case 'recommendation':
        return {
          title: 'Multi-Criteria Packaging Recommendation',
          subtitle: 'Deterministic 10-stage barrier requirement derivation and packaging prescription.'
        };
      case 'materials':
        return {
          title: 'Packaging Materials Knowledge Base',
          subtitle: 'Technical library of commercial barrier substrates with calibrated 0–100 metrics.'
        };
      case 'compare':
        return {
          title: 'Side-by-Side Material Comparator',
          subtitle: 'Cross-evaluate barrier kinetics, tensile strength, cost, and recyclability.'
        };
      case 'what-if':
        return {
          title: 'What-If Sensitivity Analysis Sandbox',
          subtitle: 'Simulate environmental and supply-chain stress scenarios on material rankings.'
        };
      case 'audit':
        return {
          title: 'Packaging Quality & Defect Audit',
          subtitle: 'Benchmark existing package specifications against barrier demands to diagnose failure modes.'
        };
      case 'about':
        return {
          title: 'System Architecture & Technical Dossier',
          subtitle: 'Methodology, research references, prototype readiness matrix, and disclaimer.'
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
              {title}
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              ASTM / SIH v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 hidden md:block truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Utility Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Commodity Jump */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
          <span className="text-[11px] font-medium text-slate-500">Quick Jump:</span>
          <select
            aria-label="Quick commodity selection"
            onChange={e => {
              if (e.target.value) {
                onQuickStart(e.target.value);
              }
            }}
            defaultValue=""
            className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select Commodity...
            </option>
            {FOOD_COMMODITIES.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {activeTab !== 'recommendation' && (
          <button
            type="button"
            onClick={() => onQuickStart()}
            className="px-3 py-1.5 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Start Evaluation</span>
            <span className="sm:hidden">Evaluate</span>
          </button>
        )}
      </div>
    </header>
  );
};
