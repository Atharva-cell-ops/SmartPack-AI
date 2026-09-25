import React from 'react';
import { OfficialFssaiLogo, OfficialMofpiLogo, SmartPackLogo } from './OfficialSeals';

interface TopHeaderBannerProps {
  onHomeClick?: () => void;
}

export const TopHeaderBanner: React.FC<TopHeaderBannerProps> = ({ onHomeClick }) => {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-3.5 px-3 sm:px-6 lg:px-8 shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Dominant Left Section: [ SYMBOL ] SmartPack AI Software Brand Lockup */}
        <div
          className="flex items-center gap-3.5 sm:gap-5 select-none min-w-0 flex-1"
        >
          {/* Definitive SmartPack AI Logo Symbol */}
          <div className="relative shrink-0">
            <SmartPackLogo
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 cursor-pointer rounded-2xl bg-white p-1.5 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all shrink-0"
              onClick={onHomeClick}
            />
          </div>

          <div className="min-w-0 flex-1 cursor-pointer" onClick={onHomeClick}>
            {/* SaaS Wordmark: SmartPack in dark teal, AI in fresh emerald with amber accent */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F2942] tracking-tight leading-none">
                SmartPack{' '}
                <span className="text-emerald-600 inline-flex items-center relative">
                  AI
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1 -mt-3.5 shadow-2xs" title="Intelligent AI Decision Point" />
                </span>
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wide">
                Intelligent Food-Tech Platform
              </span>
            </div>

            {/* Micro Description */}
            <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mt-1 max-w-3xl">
              Intelligent Food Packaging Material Recommendation System — Multivariable Barrier, Protection &amp; Shelf-Life Engineering
            </p>

            {/* Portal Metadata Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Badge 1: DB Version */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span className="text-slate-500">Engine:</span>
                <span className="font-bold text-slate-900 font-mono">v2.4</span>
              </div>

              {/* Badge 2: Materials Catalog */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium">
                <span className="text-slate-500">Materials:</span>
                <span className="font-extrabold text-emerald-600 font-mono">150+ Substrates</span>
              </div>

              {/* Badge 3: Compliance Alignment */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>FSSAI 2026 &amp; MoFPI Aligned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Far Right: Official Logos side-by-side with large visible sizing for judges */}
        <div className="flex items-center justify-end gap-3.5 sm:gap-4 shrink-0 self-start md:self-center">
          {/* Official MoFPI Logo */}
          <OfficialMofpiLogo className="h-14 sm:h-18 md:h-20 w-auto px-3.5 py-2 shadow-xs border border-slate-200/90 rounded-xl hover:shadow-sm transition-all bg-white" />

          {/* Official FSSAI Logo */}
          <OfficialFssaiLogo className="h-14 sm:h-18 md:h-20 w-auto px-3.5 py-2 shadow-xs border border-slate-200/90 rounded-xl hover:shadow-sm transition-all bg-white" />
        </div>

      </div>
    </header>
  );
};
