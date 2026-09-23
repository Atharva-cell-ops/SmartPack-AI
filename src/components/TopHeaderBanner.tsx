import React from 'react';
import { OfficialFssaiLogo, OfficialMofpiLogo, PackagingCommodityIcon } from './OfficialSeals';

interface TopHeaderBannerProps {
  onHomeClick?: () => void;
}

export const TopHeaderBanner: React.FC<TopHeaderBannerProps> = ({ onHomeClick }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-2.5 px-3 sm:px-5 lg:px-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Dominant Left Section: Icon + Title + Description + Metadata Badges */}
        <div
          onClick={onHomeClick}
          className="flex items-center gap-3.5 cursor-pointer group select-none min-w-0 flex-1"
        >
          <PackagingCommodityIcon className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
          <div className="min-w-0 flex-1">
            {/* System Title */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none">
                SmartPack <span className="text-emerald-600">AI</span>
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 tracking-wide uppercase">
                GovTech Portal
              </span>
              <span className="text-[11px] font-medium text-slate-400 font-mono hidden sm:inline">
                IS 15609 / 9845
              </span>
            </div>

            {/* Micro Description */}
            <p className="text-xs text-slate-500 font-normal leading-tight mt-1 max-w-2xl">
              AI-Powered Food Packaging Material Recommendation System — Calibrated Packaging Engineering &amp; Decision Support Platform
            </p>

            {/* Portal Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {/* Badge 1: DB Version */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-500 font-medium">DB Version:</span>
                <span className="font-semibold text-slate-900 font-mono">2.4</span>
              </div>

              {/* Badge 2: Materials Catalog */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11px]">
                <span className="text-slate-500 font-medium">Materials Catalog:</span>
                <span className="font-bold text-emerald-600 font-mono">150+</span>
              </div>

              {/* Badge 3: Compliance */}
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-semibold">Compliance: FSSAI 2026 Aligned</span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden lg:inline">
                MoFPI Empanelled
              </span>
            </div>
          </div>
        </div>

        {/* Far Right: Official Logos side-by-side with strict gap-4 and crisp object-contain */}
        <div className="flex items-center justify-end gap-4 shrink-0 self-start md:self-center">
          {/* Official MoFPI Logo */}
          <OfficialMofpiLogo className="h-[46px] w-auto px-2.5 py-1" />

          {/* Official FSSAI Logo */}
          <OfficialFssaiLogo className="h-[46px] w-auto px-2.5 py-1" />
        </div>

      </div>
    </header>
  );
};
