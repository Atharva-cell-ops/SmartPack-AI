import React from 'react';
import fssaiLogoAsset from '../assets/fssai-logo.png';
import mofpiLogoAsset from '../assets/mofpi-logo.png';

export const OFFICIAL_FSSAI_LOGO_URL = fssaiLogoAsset;
export const OFFICIAL_MOFPI_LOGO_URL = mofpiLogoAsset;

/**
 * Official Government & Authority Seals:
 * - Official FSSAI Wordmark Logo (Direct reproduction of the official high-resolution emblem)
 * - Official MoFPI Logo (Direct reproduction of official emblem: Ashoka Stambh, Wheat Sheaf, Gear & MOFPI wordmark)
 * - Circular variants for backward compatibility
 * - High-resolution Packaging/Commodity Box Vector Icon
 */

/**
 * Official FSSAI Logo — Exact High-Resolution Official Asset
 * Features:
 * 1. Stylized deep blue italic font ("fssai").
 * 2. Orange horizontal top bar with the sprouting green leaf & seed symbol on top right.
 * 3. Green horizontal baseline stripe at the bottom.
 */
export const OfficialFssaiLogo: React.FC<{ className?: string; imgClassName?: string }> = ({
  className = '',
  imgClassName = ''
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white px-2.5 py-1 rounded-md border border-slate-200 select-none shrink-0 ${className}`}
      title="Food Safety and Standards Authority of India (FSSAI) — Official Regulatory Logo"
    >
      <img
        src={fssaiLogoAsset}
        alt="Food Safety and Standards Authority of India (FSSAI) Official Logo"
        className={`h-[36px] sm:h-[40px] w-auto object-contain max-h-[40px] ${imgClassName}`}
        loading="eager"
      />
    </div>
  );
};

/**
 * Official MoFPI Logo — Exact High-Resolution Official Government Asset
 * Ministry of Food Processing Industries, Government of India
 * Features:
 * 1. Left side: Official State Emblem of India (Ashoka Stambh with "Satyameva Jayate")
 * 2. Center/Right: Green/Orange wheat sheaf and gear graphic enclosing the letters "MOFPI"
 * 3. Bottom text: "MINISTRY OF FOOD PROCESSING INDUSTRIES GOVERNMENT OF INDIA"
 */
export const OfficialMofpiLogo: React.FC<{ className?: string; imgClassName?: string }> = ({
  className = '',
  imgClassName = ''
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white px-2.5 py-1 rounded-md border border-slate-200 select-none shrink-0 ${className}`}
      title="Ministry of Food Processing Industries (MoFPI) — Government of India Official Logo"
    >
      <img
        src={mofpiLogoAsset}
        alt="Ministry of Food Processing Industries (MoFPI) Official Logo - Government of India"
        className={`h-[38px] sm:h-[42px] w-auto object-contain max-h-[42px] ${imgClassName}`}
        loading="eager"
      />
    </div>
  );
};

/**
 * Backward compatibility exports
 */
export const CircularFssaiLogo = OfficialFssaiLogo;
export const CircularMofpiSeal = OfficialMofpiLogo;
export const FssaiLogo = OfficialFssaiLogo;
export const MofpiLogo = OfficialMofpiLogo;

/**
 * High-resolution Packaging/Commodity Box Vector Icon
 */
export const PackagingCommodityIcon: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => {
  return (
    <div
      className={`relative rounded-md bg-[#0F172A] border border-[#334155] text-white flex items-center justify-center p-3 shadow-md shrink-0 ${className}`}
      aria-label="Packaging and Food Commodity Engineering Icon"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-emerald-400"
      >
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#1E293B" stroke="#34D399" />
        <path d="M2 17L12 22L22 17" stroke="#10B981" />
        <path d="M2 12L12 17L22 12" stroke="#059669" />
        <path d="M12 7V17" stroke="#A7F3D0" strokeWidth="2" />
        <path d="M9 10L12 12L15 10" stroke="#6EE7B7" strokeWidth="1.5" />
      </svg>
      <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 text-[9px] font-black bg-[#059669] text-white border border-white rounded shadow-xs">
        ISO
      </span>
    </div>
  );
};
