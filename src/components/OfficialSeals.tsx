import React, { useState, useEffect, useRef } from 'react';
import { Upload } from 'lucide-react';
import fssaiLogoAsset from '../assets/fssai-logo.png';
import mofpiLogoAsset from '../assets/mofpi-logo.png';
import smartpackPngAsset from '../assets/smartpack-ai-logo.png';
import smartpackSvgAsset from '../assets/smartpack-symbol.svg';

export const OFFICIAL_FSSAI_LOGO_URL = fssaiLogoAsset;
export const OFFICIAL_MOFPI_LOGO_URL = mofpiLogoAsset;
export const SMARTPACK_LOGO_URL = smartpackPngAsset;
export const SMARTPACK_SVG_URL = smartpackPngAsset;

/**
 * Hook to retrieve active logo image (uses exact untouched uploaded reference logo)
 */
export function useActiveLogo() {
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('smartpack_custom_logo');
      if (stored) return stored;
    }
    return smartpackPngAsset;
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = localStorage.getItem('smartpack_custom_logo');
      setLogoSrc(stored || smartpackPngAsset);
    };

    window.addEventListener('smartpack_logo_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Global Paste Listener: allows the user to press Ctrl+V / Cmd+V anywhere to paste their exact image
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              if (dataUrl) {
                localStorage.setItem('smartpack_custom_logo', dataUrl);
                window.dispatchEvent(new Event('smartpack_logo_updated'));
              }
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('smartpack_logo_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return logoSrc;
}

/**
 * Official SmartPack AI Logo Component
 * Displays the exact logo with instant drag-and-drop & clipboard paste support.
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            localStorage.setItem('smartpack_custom_logo', dataUrl);
            window.dispatchEvent(new Event('smartpack_logo_updated'));
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          localStorage.setItem('smartpack_custom_logo', dataUrl);
          window.dispatchEvent(new Event('smartpack_logo_updated'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={handleDrop}
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-200 select-none group cursor-pointer ${className}`}
      title="SmartPack AI Logo (Tip: Press Ctrl+V to paste your exact logo, or drag & drop your image here)"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <img
        src={activeLogo}
        alt={alt}
        className={`w-full h-full object-contain transition-transform duration-200 group-hover:scale-105 ${imgClassName}`}
        loading="eager"
      />

      {showBadge && (
        <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[8px] font-black bg-emerald-600 text-white border border-white rounded-full shadow-xs tracking-wider">
          AI
        </span>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        title="Upload or pick your exact logo image file"
        className="absolute -bottom-1 -right-1 p-1 bg-white hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 rounded-full border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Upload className="w-3 h-3" />
      </button>
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
  const activeLogo = useActiveLogo();

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none cursor-pointer hover:opacity-90 transition-opacity gap-2.5 ${className}`}
      title="SmartPack AI — Intelligent Food Packaging Recommendation System"
    >
      <img
        src={activeLogo}
        alt="SmartPack AI Symbol"
        className="h-full w-auto object-contain shrink-0"
        loading="eager"
      />
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-xl font-black text-[#0F2942] tracking-tight">SmartPack</span>
        <span className="text-xl font-black text-emerald-600">AI</span>
      </div>
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
