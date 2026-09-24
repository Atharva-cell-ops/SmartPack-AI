import React, { useState, useRef } from 'react';
import { X, Upload, RotateCcw, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { SmartPackLogo, useActiveLogo, SMARTPACK_LOGO_URL, SMARTPACK_SVG_URL } from './OfficialSeals';

interface LogoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoCustomizerModal: React.FC<LogoCustomizerModalProps> = ({ isOpen, onClose }) => {
  const currentLogo = useActiveLogo();
  const [previewSrc, setPreviewSrc] = useState<string>(currentLogo);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMsg('Please select a valid image file (PNG, SVG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewSrc(result);
        localStorage.setItem('smartpack_custom_logo', result);
        window.dispatchEvent(new Event('smartpack_logo_updated'));
        setStatusMsg('Custom logo applied successfully across prototype!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (presetPath: string, name: string) => {
    setPreviewSrc(presetPath);
    if (presetPath === SMARTPACK_LOGO_URL || presetPath === '/image.png') {
      localStorage.removeItem('smartpack_custom_logo');
    } else {
      localStorage.setItem('smartpack_custom_logo', presetPath);
    }
    window.dispatchEvent(new Event('smartpack_logo_updated'));
    setStatusMsg(`Applied preset: ${name}`);
  };

  const handleResetToDefault = () => {
    localStorage.removeItem('smartpack_custom_logo');
    setPreviewSrc(SMARTPACK_LOGO_URL || '/image.png');
    window.dispatchEvent(new Event('smartpack_logo_updated'));
    setStatusMsg('Reset to official SmartPack AI logo default.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">SmartPack AI — Brand Identity</h2>
              <p className="text-xs text-slate-500">Modern SaaS Product Logo • Food + Packaging + Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Current Active Preview */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Brand Symbol</span>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white p-3 flex items-center justify-center">
              <img
                src={previewSrc}
                alt="Active Logo Preview"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Applied to Website Header, App Icons &amp; Dossiers</span>
            </div>
          </div>

          {/* Preset Choices - 3 Distinct SaaS Concepts */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Logo Concept
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Food • Packaging • AI
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Concept 1 - Primary */}
              <button
                type="button"
                onClick={() => handleApplyPreset('/smartpack-symbol.svg', 'Concept 1: Bio-Faceted Pouch (Primary)')}
                className="p-3 rounded-xl border border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 flex items-center gap-3 text-left transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-emerald-200 bg-white p-1.5 shadow-2xs">
                  <img src="/smartpack-symbol.svg" alt="Concept 1" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Concept 1: Bio-Faceted Pouch (Primary)</span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-emerald-600 text-white rounded">Recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Geometric packaging vessel with negative-space organic leaf &amp; 3 amber AI decision nodes.
                  </p>
                </div>
              </button>

              {/* Concept 2 */}
              <button
                type="button"
                onClick={() => handleApplyPreset('/concept2-hex-prism.svg', 'Concept 2: Hex-Prism Sprout')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex items-center gap-3 text-left transition-all cursor-pointer group bg-white shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1.5 shadow-2xs">
                  <img src="/concept2-hex-prism.svg" alt="Concept 2" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Concept 2: Hex-Prism &amp; Sprout</div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Isometric packaging planes opening to reveal a fresh produce sprout with dual AI vertices.
                  </p>
                </div>
              </button>

              {/* Concept 3 */}
              <button
                type="button"
                onClick={() => handleApplyPreset('/concept3-capsule-leaf.svg', 'Concept 3: Origami Box & Leaf Core')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex items-center gap-3 text-left transition-all cursor-pointer group bg-white shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1.5 shadow-2xs">
                  <img src="/concept3-capsule-leaf.svg" alt="Concept 3" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Concept 3: Origami Box &amp; Leaf Core</div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Minimalist protective package encapsulation with integrated freshness axis.
                  </p>
                </div>
              </button>

              {/* Horizontal Lockup */}
              <button
                type="button"
                onClick={() => handleApplyPreset('/smartpack-logo-horizontal.svg', 'Horizontal Header Lockup [SYMBOL] SmartPack AI')}
                className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex items-center gap-3 text-left transition-all cursor-pointer group bg-white shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1 flex items-center justify-center shadow-2xs">
                  <img src="/smartpack-logo-horizontal.svg" alt="Horizontal Brand Lockup" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Horizontal SaaS Lockup</div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    Full header brand lockup [ Symbol ] SmartPack AI with geometric typography.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Upload Button */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Upload Custom Logo Asset
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Select PNG, SVG or WEBP from Device</span>
            </button>
          </div>

          {/* Notification Msg */}
          {statusMsg && (
            <div className="p-3 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
