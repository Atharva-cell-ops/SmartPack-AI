import React, { useState, useEffect } from 'react';
import fssaiLogoAsset from '../assets/fssai-logo.png';
import mofpiLogoAsset from '../assets/mofpi-logo.png';
import smartpackLogoAsset from '../assets/image.png';
import smartpackSvgAsset from '../assets/smartpack-logo.svg';
import smartpackHorizontalAsset from '../assets/smartpack-logo-horizontal.png';
import smartpackHorizontalSvg from '../assets/smartpack-logo-horizontal.svg';

export const OFFICIAL_FSSAI_LOGO_URL = fssaiLogoAsset;
export const OFFICIAL_MOFPI_LOGO_URL = mofpiLogoAsset;
export const SMARTPACK_LOGO_URL = smartpackLogoAsset;
export const SMARTPACK_SVG_URL = smartpackSvgAsset;
export const SMARTPACK_HORIZONTAL_LOGO_URL = smartpackHorizontalSvg;

/**
 * Hook to retrieve user-configured custom logo from localStorage or default
 */
export function useActiveLogo() {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smartpack_custom_logo');
      if (stored) return stored;
    }
    return smartpackLogoAsset || '/image.png';
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem('smartpack_custom_logo');
      if (stored) {
        setLogoSrc(stored);
      } else {
        setLogoSrc(smartpackLogoAsset || '/image.png');
      }
    };

    window.addEventListener('smartpack_logo_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('smartpack_logo_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return logoSrc;
}

/**
 * Official SmartPack AI Logo Component
 * Renders the high-definition SmartPack AI branding emblem with fallback and interactive upload support.
 */
export const SmartPackLogo: React.FC<{
  className?: string;
  imgClassName?: string;
  showBadge?: boolean;
  alt?: string;
  onClick?: () => void;
}> = ({
  className = 'w-12 h-12',
  imgClassName = 'w-full h-full object-contain',
  showBadge = false,
  alt = 'SmartPack AI Product Logo',
  onClick
}) => {
  const activeLogo = useActiveLogo();
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-200 select-none group ${className}`}
      title="SmartPack AI — Intelligent Food Packaging System"
    >
      {!hasError ? (
        <img
          src={activeLogo}
          alt={alt}
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
          loading="eager"
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Crisp Vector Fallback if image file is not found */
        <img
          src={smartpackSvgAsset}
          alt={alt}
          className={`w-full h-full object-contain ${imgClassName}`}
          loading="eager"
        />
      )}

      {showBadge && (
        <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[8px] font-black bg-emerald-600 text-white border border-white rounded-full shadow-xs tracking-wider">
          AI
        </span>
      )}
    </div>
  );
};

/**
 * Official Horizontal Brand Lockup Component
 * [ SYMBOL ] SmartPack AI
 */
export const SmartPackHorizontalBrand: React.FC<{
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}> = ({
  className = 'h-10 sm:h-11 w-auto',
  imgClassName = 'h-full w-auto object-contain',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none cursor-pointer hover:opacity-90 transition-opacity ${className}`}
      title="SmartPack AI — Intelligent Food Packaging Recommendation System"
    >
      <img
        src={smartpackHorizontalSvg}
        alt="SmartPack AI Product Identity"
        className={imgClassName}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

/**
 * Official FSSAI Logo — Exact High-Resolution Official Asset
 */
export const OfficialFssaiLogo: React.FC<{ className?: string; imgClassName?: string }> = ({
  className = '',
  imgClassName = ''
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 select-none shrink-0 ${className}`}
      title="Food Safety and Standards Authority of India (FSSAI) — Official Regulatory Logo"
    >
      <img
        src={fssaiLogoAsset}
        alt="Food Safety and Standards Authority of India (FSSAI) Official Logo"
        className={`h-full w-auto object-contain ${imgClassName}`}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

/**
 * Official MoFPI Logo — Exact High-Resolution Official Government Asset
 */
export const OfficialMofpiLogo: React.FC<{ className?: string; imgClassName?: string }> = ({
  className = '',
  imgClassName = ''
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 select-none shrink-0 ${className}`}
      title="Ministry of Food Processing Industries (MoFPI) — Government of India Official Logo"
    >
      <img
        src={mofpiLogoAsset}
        alt="Ministry of Food Processing Industries (MoFPI) Official Logo - Government of India"
        className={`h-full w-auto object-contain ${imgClassName}`}
        loading="eager"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

/**
 * Packaging Commodity Icon - now defaulted to use the official SmartPack AI Logo
 */
export const PackagingCommodityIcon: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14'
}) => {
  return <SmartPackLogo className={className} />;
};

/**
 * Backward compatibility exports
 */
export const CircularFssaiLogo = OfficialFssaiLogo;
export const CircularMofpiSeal = OfficialMofpiLogo;
export const FssaiLogo = OfficialFssaiLogo;
export const MofpiLogo = OfficialMofpiLogo;
export const SmartPackEmblem = SmartPackLogo;
