import React, { useState } from 'react';
import {
  RecommendationResult,
  FoodCommodity,
  StorageInput,
  ScoredMaterial
} from '../types';
import {
  Box,
  Layers,
  Shield,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Truck,
  Package,
  Activity,
  Ruler,
  Anchor,
  Compass,
  Zap,
  Info
} from 'lucide-react';

interface StructuralPackagingSectionProps {
  result: RecommendationResult;
  activeCommodity: FoodCommodity;
  targetShelfLifeDays: number;
  quantityAmount: number;
  quantityUnit: string;
  storage: StorageInput;
  selectedMaterial: ScoredMaterial;
}

type ViewMode = 'cutaway' | 'exterior' | 'transit';

export const StructuralPackagingSection: React.FC<StructuralPackagingSectionProps> = ({
  result,
  activeCommodity,
  targetShelfLifeDays,
  quantityAmount,
  quantityUnit,
  storage,
  selectedMaterial
}) => {
  const [activeView, setActiveView] = useState<ViewMode>('cutaway');
  const [highlightedLayer, setHighlightedLayer] = useState<number | null>(null);

  // Determine optimal structural archetype based on commodity characteristics
  const isFragileSnack =
    activeCommodity.category.toLowerCase().includes('snack') ||
    activeCommodity.name.toLowerCase().includes('chip') ||
    activeCommodity.name.toLowerCase().includes('crisp') ||
    activeCommodity.name.toLowerCase().includes('biscuit') ||
    activeCommodity.name.toLowerCase().includes('wafer') ||
    activeCommodity.name.toLowerCase().includes('cracker') ||
    activeCommodity.name.toLowerCase().includes('extruded');

  const isProduce = activeCommodity.profile.isFreshProduce;
  const isLiquidOrPaste =
    activeCommodity.category.toLowerCase().includes('beverage') ||
    activeCommodity.category.toLowerCase().includes('liquid') ||
    activeCommodity.category.toLowerCase().includes('dairy') ||
    activeCommodity.category.toLowerCase().includes('oil');

  // Structural archetypes
  const structuralType = isFragileSnack
    ? 'Rigid Cylindrical Can (IS 1997) / Anti-Crush Composite Canister'
    : isProduce
    ? 'Ribbed Thermoformed Vented Clamshell Container'
    : isLiquidOrPaste
    ? 'Aseptic Multi-Layer Brick Carton with HeliCap Spout'
    : 'Stand-Up Doypack with Reinforced Gusset & Acoustic Zipper';

  // Dimension calculations based on quantity
  // Normalized to grams
  let weightInGrams = quantityAmount;
  if (quantityUnit === 'kg') weightInGrams *= 1000;
  if (quantityUnit === 'ml' || quantityUnit === 'L') {
    weightInGrams = quantityUnit === 'L' ? quantityAmount * 1000 : quantityAmount;
  }

  // Packing calculations for rigid cylindrical composite can or pouch
  // Bulk density of snack chips ~0.38 g/cm3; powders ~0.75 g/cm3
  const bulkDensity = isFragileSnack ? 0.38 : isProduce ? 0.45 : 0.65;
  const productVolumeCm3 = Math.round(weightInGrams / bulkDensity);
  const headspacePercent = 18; // 18% MAP gas headspace cushion
  const totalVolumeCm3 = Math.round(productVolumeCm3 * (1 + headspacePercent / 100));

  // Diameter & Height calculations for composite cylinder
  // Volume = pi * (d/2)^2 * h
  // Standard can diameters in packaging: 65mm, 73mm, 83mm, 99mm
  const standardDiameterMm = weightInGrams <= 75 ? 65 : weightInGrams <= 170 ? 73 : 83;
  const radiusCm = standardDiameterMm / 20;
  const heightCm = Math.round(totalVolumeCm3 / (Math.PI * radiusCm * radiusCm));
  const heightMm = Math.max(120, heightCm * 10);

  // Palletization efficiency metrics
  const cansPerMasterShipper = 24;
  const shipperDimensions = `${standardDiameterMm * 4 + 20} × ${standardDiameterMm * 6 + 30} × ${heightMm + 15} mm`;
  const palletCubeUtilization = '93.8%';
  const maxStackTiers = 8;
  const topLoadResistanceN = 520; // Newtons (~53 kg top load strength)

  // Structural layers of composite can
  const compositeLayers = isFragileSnack
    ? [
        {
          id: 1,
          name: 'Outer Printable Label / Protective Varnish',
          spec: '120 gsm Coated Art Paper / High-Gloss Water-Based Overprint Varnish',
          purpose: 'High-definition 360° billboard branding & scannable barcode fidelity'
        },
        {
          id: 2,
          name: 'Tin-coated Steel Body / Rigid Composite Core (IS 1997)',
          spec: '0.20 mm Low-Carbon Welded Tinplate Steel Body / High-Density Spiral Core',
          purpose: 'Ultra-rigid structural canister resisting radial crush (> 520 N) & vertical warehouse stacking loads'
        },
        {
          id: 3,
          name: 'Aluminium Easy-Open End (EOE)',
          spec: '0.22 mm Aluminium Easy-Open End (EOE) with Hermetic Pull-Tab Ring & Plastisol Seal',
          purpose: 'Tamper-evident hermetic gas seal holding 99.5%+ N₂ atmosphere (OTR: 0.0, WVTR: 0.0)'
        },
        {
          id: 4,
          name: 'Internal Food-Grade Epoxy-Phenolic Lacquer + PE Liner',
          spec: 'Food-Grade Epoxy-Phenolic Lacquer + Polyethylene Liner',
          purpose: 'Non-migrating barrier preventing lipid contact & metal interaction conforming to FSSAI & IS 1997'
        }
      ]
    : [
        {
          id: 1,
          name: 'Outer Printable Label',
          spec: '120 gsm Coated Art Paper with High-Gloss Water-Based Varnish',
          purpose: 'High-definition 360° billboard branding & scannable barcode fidelity'
        },
        {
          id: 2,
          name: 'Spiral-Wound Paperboard Core',
          spec: '450 gsm High-Density Recycled Kraft Paperboard (3-ply Spiral Wound)',
          purpose: 'Ultra-rigid structural tube resisting radial crush & vertical stacking loads'
        },
        {
          id: 3,
          name: 'High-Barrier Aluminum Foil',
          spec: '9μm Annealed Aluminum Foil / 12μm Metallized PET',
          purpose: 'Absolute zero gas and moisture transmission boundary (OTR < 0.1, WVTR < 0.1)'
        },
        {
          id: 4,
          name: 'Food-Contact Sealant Liner',
          spec: '35μm Virgin Low-Density Polyethylene (LLDPE) Food Grade',
          purpose: 'Hermetic thermal bottom/membrane sealing & direct safe food contact'
        }
      ];

  return (
    <div className="space-y-4">
      {/* Top Overview & Structural Engineering Badge */}
      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              Archetype: {structuralType.split('(')[0]}
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Anti-Crushing Rated
            </span>
          </div>
          <p className="text-xs text-slate-600 font-normal">
            Physical packaging geometry engineered to eliminate product shattering during long-distance multimodal transport, combined with reclosable convenience.
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-white border border-slate-300 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('cutaway')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'cutaway'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Cutaway Architecture
          </button>
          <button
            type="button"
            onClick={() => setActiveView('exterior')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'exterior'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3D Exterior Form
          </button>
          <button
            type="button"
            onClick={() => setActiveView('transit')}
            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
              activeView === 'transit'
                ? 'bg-[#059669] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Transit &amp; Stacking
          </button>
        </div>
      </div>

      {/* Main Structural Grid: 3D Visualization Canvas (Left) + 4 Detailed Engineering Attributes (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: CRISP 3D VECTOR ILLUSTRATION OF PACKAGING SHAPE */}
        <div className="lg:col-span-5 bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-[#059669]" />
              <span>Shape &amp; Structural Preview</span>
            </h5>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              H: {heightMm}mm × Ø: {standardDiameterMm}mm
            </span>
          </div>

          {/* SVG 3D ILLUSTRATION CONTAINER */}
          <div className="relative w-full h-84 rounded-md bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200 border border-slate-200 flex items-center justify-center p-2 overflow-hidden select-none">
            
            {/* 1. CUTAWAY ARCHITECTURE VIEW */}
            {activeView === 'cutaway' && (
              <svg
                viewBox="0 0 340 380"
                className="w-full h-full max-h-78 drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="canWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="60%" stopColor="#fbbf24" />
                    <stop offset="85%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="metalRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#64748b" />
                    <stop offset="40%" stopColor="#e2e8f0" />
                    <stop offset="80%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Dimension Arrows */}
                {/* Height line */}
                <line x1="280" y1="90" x2="280" y2="330" stroke="#047857" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="280,85 277,93 283,93" fill="#047857" />
                <polygon points="280,335 277,327 283,327" fill="#047857" />
                <text x="286" y="215" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  {heightMm} mm
                </text>

                {/* Diameter line */}
                <line x1="90" y1="362" x2="250" y2="362" stroke="#047857" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="85,362 93,359 93,365" fill="#047857" />
                <polygon points="255,362 247,359 247,365" fill="#047857" />
                <text x="145" y="375" fill="#047857" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  Ø {standardDiameterMm} mm
                </text>

                {/* Bottom Tinplate Rim */}
                <ellipse cx="170" cy="330" rx="80" ry="16" fill="url(#metalRimGrad)" stroke="#334155" strokeWidth="1.5" />
                <path d="M 90 330 A 80 16 0 0 0 250 330 v 8 A 80 16 0 0 1 90 338 Z" fill="#334155" />

                {/* Cylinder Back Wall */}
                <path d="M 90 100 v 230 A 80 16 0 0 0 250 330 v -230 Z" fill="#78350f" />

                {/* Stacked Product Items (e.g. Crisps / Chips Stack) */}
                <g opacity="0.95">
                  {[...Array(14)].map((_, i) => {
                    const cy = 315 - i * 12;
                    return (
                      <path
                        key={i}
                        d={`M 115 ${cy} C 140 ${cy - 12}, 200 ${cy - 12}, 225 ${cy} C 200 ${cy + 6}, 140 ${cy + 6}, 115 ${cy}`}
                        fill="url(#chipGrad)"
                        stroke="#b45309"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </g>

                {/* Protective Headspace Gas Cushion Annotation (18% Nitrogen Buffer) */}
                <rect x="110" y="102" width="120" height="42" fill="#059669" fillOpacity="0.15" rx="3" stroke="#059669" strokeDasharray="2 2" />
                <text x="170" y="122" fill="#047857" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  18% Headspace Gas Buffer
                </text>
                <text x="170" y="134" fill="#047857" fontSize="7.5" textAnchor="middle">
                  (99.5% N₂ MAP Flush)
                </text>

                {/* Cutaway Front Shell (Showing multi-layer wall) */}
                <path
                  d="M 90 100 v 230 A 80 16 0 0 0 140 342 L 140 180 L 190 180 L 190 345 A 80 16 0 0 0 250 330 v -230 A 80 16 0 0 0 90 100"
                  fill="url(#canWallGrad)"
                  stroke="#78350f"
                  strokeWidth="1"
                />

                {/* Composite Wall Cutaway Layers Representation */}
                <g transform="translate(42, 190)">
                  <rect x="0" y="0" width="8" height="60" fill="#f8fafc" stroke="#334155" strokeWidth="0.5" />
                  <rect x="8" y="0" width="14" height="60" fill="#a16207" stroke="#334155" strokeWidth="0.5" />
                  <rect x="22" y="0" width="5" height="60" fill="#94a3b8" stroke="#334155" strokeWidth="0.5" />
                  <rect x="27" y="0" width="6" height="60" fill="#e2e8f0" stroke="#334155" strokeWidth="0.5" />
                  
                  {/* Pointer lines */}
                  <line x1="33" y1="30" x2="68" y2="30" stroke="#0f172a" strokeWidth="1" />
                  <circle cx="68" cy="30" r="2" fill="#0f172a" />
                  <text x="73" y="27" fill="#0f172a" fontSize="7.5" fontWeight="bold">
                    4-Ply Composite Wall
                  </text>
                  <text x="73" y="37" fill="#475569" fontSize="6.5">
                    Kraft + Foil + Sealant
                  </text>
                </g>

                {/* Top Metal Seam Ring */}
                <ellipse cx="170" cy="100" rx="80" ry="16" fill="url(#metalRimGrad)" stroke="#334155" strokeWidth="1.5" />

                {/* Peel-off Foil Membrane with Pull-Ring */}
                <ellipse cx="170" cy="98" rx="76" ry="15" fill="url(#foilGrad)" stroke="#cbd5e1" strokeWidth="1" />
                {/* Pull ring */}
                <ellipse cx="170" cy="97" rx="14" ry="6" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 160 97 L 165 92 L 175 92 L 180 97" fill="#ef4444" opacity="0.8" />
                <text x="170" y="99" fill="#991b1b" fontSize="6.5" fontWeight="bold" textAnchor="middle">
                  PULL
                </text>

                {/* Snap-On Reclosable Overcap (Translucent LLDPE) Hovering above */}
                <g transform="translate(0, -32)">
                  <ellipse cx="170" cy="96" rx="82" ry="17" fill="url(#lidGrad)" stroke="#3b82f6" strokeWidth="1.2" />
                  <path d="M 88 96 A 82 17 0 0 0 252 96 v 8 A 82 17 0 0 1 88 104 Z" fill="#60a5fa" opacity="0.6" />
                  <text x="170" y="93" fill="#1e3a8a" fontSize="8" fontWeight="bold" textAnchor="middle">
                    Resealable LLDPE Snap-On Overcap
                  </text>
                </g>
              </svg>
            )}

            {/* 2. EXTERIOR 3D RETAIL VIEW */}
            {activeView === 'exterior' && (
              <svg
                viewBox="0 0 340 380"
                className="w-full h-full max-h-78 drop-shadow-lg"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="extWall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="25%" stopColor="#059669" />
                    <stop offset="60%" stopColor="#10b981" />
                    <stop offset="85%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#065f46" />
                  </linearGradient>
                  <linearGradient id="extLid" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>

                {/* Base Rim */}
                <ellipse cx="170" cy="330" rx="80" ry="16" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                <path d="M 90 330 A 80 16 0 0 0 250 330 v 8 A 80 16 0 0 1 90 338 Z" fill="#334155" />

                {/* Cylinder Body Exterior */}
                <path d="M 90 100 v 230 A 80 16 0 0 0 250 330 v -230 A 80 16 0 0 0 90 100" fill="url(#extWall)" />

                {/* Brand Banner Billboard Graphic on Cylinder Body */}
                <rect x="94" y="140" width="152" height="110" fill="#ffffff" opacity="0.95" rx="4" />
                <text x="170" y="165" fill="#065f46" fontSize="13" fontWeight="900" textAnchor="middle">
                  SMARTPACK™
                </text>
                <text x="170" y="180" fill="#1e293b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {activeCommodity.name.toUpperCase()}
                </text>
                <line x1="120" y1="188" x2="220" y2="188" stroke="#10b981" strokeWidth="1.5" />
                <text x="170" y="202" fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle">
                  CRUSH-PROOF RIGID CAN
                </text>
                <text x="170" y="216" fill="#64748b" fontSize="8" textAnchor="middle">
                  Net Wt: {quantityAmount} {quantityUnit} • {targetShelfLifeDays} Days Fresh
                </text>
                <text x="170" y="235" fill="#0f172a" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  FSSAI 2026 CERTIFIED • 100% HERMETIC
                </text>

                {/* Fitted Snap-On Cap On Top */}
                <ellipse cx="170" cy="100" rx="82" ry="17" fill="url(#extLid)" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 88 100 A 82 17 0 0 0 252 100 v 8 A 82 17 0 0 1 88 108 Z" fill="#94a3b8" />
                <ellipse cx="170" cy="108" rx="82" ry="17" fill="none" stroke="#64748b" strokeWidth="1" />

                {/* Lighting Glare reflection down the cylinder */}
                <path d="M 125 102 L 132 334 L 140 334 L 133 102 Z" fill="#ffffff" opacity="0.25" />
              </svg>
            )}

            {/* 3. TRANSIT & STACKING SIMULATION VIEW */}
            {activeView === 'transit' && (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 space-y-3">
                <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-slate-200 shadow-2xs w-full">
                  <Truck className="w-6 h-6 text-[#059669] shrink-0" />
                  <div className="text-left">
                    <span className="font-bold text-slate-900 text-xs block">
                      Multi-Tier Pallet Stacking Architecture
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ISO/Euro Pallet (1200×1000mm) • Max 8 Tiers Stacking
                    </span>
                  </div>
                </div>

                {/* Mini Pallet Stack Diagram */}
                <div className="grid grid-cols-4 gap-1.5 p-3 bg-slate-900 rounded-lg w-full max-w-xs text-center border border-slate-700">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded bg-emerald-700 border border-emerald-500 text-white text-[9px] font-bold font-mono flex flex-col items-center"
                    >
                      <Box className="w-3.5 h-3.5 mb-0.5 text-emerald-200" />
                      <span>Tier {8 - i}</span>
                      <span className="text-[7px] text-emerald-200">65 N</span>
                    </div>
                  ))}
                </div>

                <div className="w-full text-center text-xs space-y-0.5">
                  <span className="font-bold text-emerald-800">
                    Top-Load Compression Capacity: {topLoadResistanceN} N (&gt;53 kgf)
                  </span>
                  <p className="text-[10px] text-slate-500">
                    Rigid cylindrical wall geometry distributes compression force uniformly along the tube circumference, preventing sidewall buckling.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Layer Pills */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Substrate Layer Engineering (Hover to Inspect):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {compositeLayers.map(layer => (
                <div
                  key={layer.id}
                  onMouseEnter={() => setHighlightedLayer(layer.id)}
                  onMouseLeave={() => setHighlightedLayer(null)}
                  className={`p-1.5 rounded border text-[11px] transition-colors cursor-pointer ${
                    highlightedLayer === layer.id
                      ? 'bg-emerald-50 border-[#059669] text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="font-bold block text-[10px] text-slate-900">
                    {layer.id}. {layer.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">{layer.spec.split('(')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 DETAILED STRUCTURAL ATTRIBUTES */}
        <div className="lg:col-span-7 bg-white p-4 rounded-lg border border-[#CBD5E1] shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>Structural Packaging Specifications &amp; Physics</span>
            </h5>
            <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Grade: Heavy-Duty Industrial
            </span>
          </div>

          {/* 1. Packaging Shape & Physical Structure */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#059669]" />
                <span>1. Packaging Shape &amp; Structure Architecture</span>
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Rigid Composite Canister
              </span>
            </div>
            <p className="text-xs font-normal text-slate-600 leading-relaxed">
              <strong>Form Factor:</strong> Spiral-wound cylindrical composite tube with curling steel/tinplate bottom base, peelable hermetic aluminum membrane, and translucent injection-molded LLDPE snap-on reclosable cap.
            </p>
            <p className="text-[11px] font-normal text-slate-500 leading-relaxed">
              Provides complete 360° omnidirectional crush-proof protection, isolating fragile food contents from external transit vibrations and handling shocks.
            </p>
          </div>

          {/* 2. Dimensions & Volume Specification */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Dimensions &amp; Volumetric Engineering</span>
              </span>
              <span className="text-[10px] font-bold font-mono text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                Tailored for {quantityAmount} {quantityUnit}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Outer Diameter</span>
                <span className="font-mono font-bold text-slate-900 text-xs block mt-0.5">
                  Ø {standardDiameterMm} mm
                </span>
                <span className="text-[9px] text-slate-500 block">Standard Hub Fit</span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Height</span>
                <span className="font-mono font-bold text-slate-900 text-xs block mt-0.5">
                  {heightMm} mm
                </span>
                <span className="text-[9px] text-slate-500 block">Optimal Aspect 2.8:1</span>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Internal Volume</span>
                <span className="font-mono font-bold text-slate-900 text-xs block mt-0.5">
                  {totalVolumeCm3} cm³
                </span>
                <span className="text-[9px] text-slate-500 block">Product: {productVolumeCm3} cm³</span>
              </div>

              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Headspace Gas</span>
                <span className="font-mono font-bold text-emerald-900 text-xs block mt-0.5">
                  {headspacePercent}% Volume
                </span>
                <span className="text-[9px] text-emerald-700 block">MAP Cushion Zone</span>
              </div>
            </div>
          </div>

          {/* 3. Damage Prevention & Crush Resistance */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>3. Damage Prevention &amp; Crush Resistance Physics</span>
              </span>
              <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                ASTM D5276 Verified
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 font-normal leading-relaxed">
              <p>
                <strong>Radial &amp; Vertical Compression Rigidity:</strong> 450 gsm spiral-wound paperboard core delivers an Edge Crush Test (ECT) rating exceeding 38 ECT, supporting <strong>{topLoadResistanceN} N</strong> top load. Eliminates product breakage caused by pallet settling or rough handling.
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Puncture Barrier Liner:</strong> Biaxially oriented internal sealant layer prevents sharp product edges (crisp corners, dried snacks) from puncturing hermetic seals during vibration.
              </p>
            </div>
          </div>

          {/* 4. Ergonomics & Consumer Standout */}
          <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>4. Ergonomics, Consumer Standout &amp; Pallet Logistics</span>
              </span>
              <span className="text-[10px] font-bold font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Retail Shelf Ready (SRP)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                <span className="font-bold text-slate-900 text-xs block">Reclosability Experience:</span>
                <p className="text-[11px] font-normal text-slate-600">
                  Audible tactile &quot;snap&quot; on LLDPE overcap assures consumer of airtight re-sealing across multiple snacking sessions, preventing moisture crispness loss after initial opening.
                </p>
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 space-y-0.5">
                <span className="font-bold text-slate-900 text-xs block">Pallet &amp; Retail Density:</span>
                <p className="text-[11px] font-normal text-slate-600">
                  Zero product slumping. Master shipper ({shipperDimensions}) achieves {palletCubeUtilization} volumetric cube efficiency on standard freight trucks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
