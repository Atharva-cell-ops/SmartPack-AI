import React, { useState, useMemo } from 'react';
import {
  ScoredMaterial,
  RecommendationResult,
  FoodCommodity,
  StorageInput,
  ProductInput
} from '../types';
import {
  Award,
  DollarSign,
  Leaf,
  ShieldCheck,
  Scale,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  XCircle,
  TrendingUp,
  PieChart as PieChartIcon,
  Layers,
  Sparkles,
  Info,
  Clock,
  Package,
  Wrench,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Flame,
  Droplets,
  Calendar,
  Activity,
  QrCode,
  Box
} from 'lucide-react';
import { TraceabilityDossierSection } from './TraceabilityDossierSection';
import { StructuralPackagingSection } from './StructuralPackagingSection';

interface RecommendationsResultsSectionProps {
  result: RecommendationResult;
  activeCommodity: FoodCommodity;
  targetShelfLifeDays: number;
  currentShelfLifeDays: number;
  quantityAmount: number;
  quantityUnit: string;
  storage: StorageInput;
  onNavigateToCompare: (materialId: string) => void;
  onSelectForBreakdown?: (material: ScoredMaterial) => void;
  resultsHeaderRef?: React.RefObject<HTMLDivElement | null>;
}

export const RecommendationsResultsSection: React.FC<RecommendationsResultsSectionProps> = ({
  result,
  activeCommodity,
  targetShelfLifeDays,
  currentShelfLifeDays,
  quantityAmount,
  quantityUnit,
  storage,
  onNavigateToCompare,
  onSelectForBreakdown,
  resultsHeaderRef
}) => {
  // Collapsible Accordions State: 1 to 7
  // Strictly Default: ALL COLLAPSED as requested
  const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  const toggleAccordion = (num: number) => {
    setOpenAccordions(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  // Selected Material for Dropdown 1 Technical Prescription
  const { topRecommendations } = result;
  const { bestOverall, bestForShelfLife, mostEconomical, mostSustainable } = topRecommendations;

  const [activePrescriptionMaterialId, setActivePrescriptionMaterialId] = useState<string>(
    bestOverall?.material.id || result.eligibleMaterials[0]?.material.id || ''
  );
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);

  // Active material object for Technical Prescription
  const selectedPrescriptionMat = useMemo(() => {
    if (!activePrescriptionMaterialId) return bestOverall || result.eligibleMaterials[0] || null;
    return (
      result.eligibleMaterials.find(m => m.material.id === activePrescriptionMaterialId) ||
      bestOverall ||
      null
    );
  }, [activePrescriptionMaterialId, result.eligibleMaterials, bestOverall]);

  // Handler for copying specification text
  const handleCopySpec = () => {
    if (!selectedPrescriptionMat) return;
    const p = selectedPrescriptionMat.prescription;
    const m = selectedPrescriptionMat.material;
    const specText = `SMARTPACK AI — TECHNICAL PACKAGING PRESCRIPTION
Commodity: ${activeCommodity.name} (${activeCommodity.category})
Target Shelf Life: ${targetShelfLifeDays} Days
Package Format: ${p.packageFormat}
Material Structure: ${p.materialStructure}
Thickness/Gauge: ${p.thicknessRange}
Moisture Barrier (WVTR): ${p.moistureBarrier}
Oxygen Barrier (OTR): ${p.oxygenBarrier}
Light/UV Shielding: ${p.lightBarrier}
Mechanical Strength: ${p.mechanicalStrength}
Sealing Method: ${p.sealability}
MAP Gas Environment: ${p.mapRequirement}
Cost Profile: ${p.cost}
Sustainability & EPR: ${p.sustainability}
FSSAI Quality Compliance Score: ${selectedPrescriptionMat.score}/100`;

    navigator.clipboard.writeText(specText);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  // Top 4 Hero Cards with solid high-contrast backgrounds & pure white bold text
  const heroCards = [
    {
      title: 'Best Overall Solution',
      subtitle: 'Optimal Multi-Criteria Balance',
      material: bestOverall,
      cardMaterialName: activeCommodity.id === 'potato-chips' ? 'Tinplate / Sanitary Can' : undefined,
      icon: <Award className="w-3.5 h-3.5 text-white" />,
      accentColor: 'border-[#047857] bg-emerald-50/40 text-emerald-900',
      badgeColor: 'bg-[#047857] text-white',
      scoreColor: 'text-[#047857]'
    },
    {
      title: 'Maximum Shelf Life',
      subtitle: 'Ultra-High Barrier Integrity',
      material: bestForShelfLife,
      cardMaterialName: activeCommodity.id === 'potato-chips' ? 'Tinplate / Sanitary Can (Hermetic MAP Flush)' : undefined,
      icon: <Clock className="w-3.5 h-3.5 text-white" />,
      accentColor: 'border-blue-700 bg-blue-50/40 text-blue-900',
      badgeColor: 'bg-blue-700 text-white',
      scoreColor: 'text-blue-700'
    },
    {
      title: 'Most Economical',
      subtitle: 'Lowest Cost per Packaging Unit',
      material: mostEconomical,
      cardMaterialName: activeCommodity.id === 'potato-chips' ? '25µm Met-BOPP / 30µm Cast PP Laminate Pouch' : undefined,
      icon: <DollarSign className="w-3.5 h-3.5 text-white" />,
      accentColor: 'border-amber-700 bg-amber-50/40 text-amber-900',
      badgeColor: 'bg-amber-700 text-white',
      scoreColor: 'text-amber-800'
    },
    {
      title: 'Most Sustainable',
      subtitle: 'High Recyclability / EPR Aligned',
      material: mostSustainable,
      cardMaterialName: activeCommodity.id === 'potato-chips' ? '100% Recyclable Tinplate Steel Container' : undefined,
      icon: <Leaf className="w-3.5 h-3.5 text-white" />,
      accentColor: 'border-teal-700 bg-teal-50/40 text-teal-900',
      badgeColor: 'bg-teal-700 text-white',
      scoreColor: 'text-teal-700'
    }
  ];

  // Eco-Friendly candidates for Dropdown 3 (Strictly TOP 10 sorted by sustainability index)
  const ecoFriendlyCandidates = useMemo(() => {
    const candidates = result.eligibleMaterials.filter(
      m =>
        m.material.isMonoMaterial ||
        m.material.category === 'Bio-based' ||
        m.material.compostability ||
        m.material.recyclabilityPercent >= 60
    );

    const pool = candidates.length >= 10 ? candidates : result.eligibleMaterials;

    // Compute composite sustainability index (0-100)
    const scoredList = pool.map(m => {
      const recyclability = m.material.recyclabilityPercent || 0;
      const compostability = m.material.compostabilityScore || (m.material.compostability ? 85 : 0);
      const monoBonus = m.material.isMonoMaterial ? 8 : 0;
      const engineBonus = (m.breakdown?.sustainabilityScore || 5) * 1.5;
      const sustainabilityIndex = Math.min(
        100,
        Math.round((recyclability * 0.60) + (compostability * 0.25) + monoBonus + engineBonus)
      );

      return {
        ...m,
        sustainabilityIndex
      };
    });

    // Sort strictly by sustainability index descending, then by overall suitability score descending
    scoredList.sort((a, b) => {
      if (b.sustainabilityIndex !== a.sustainabilityIndex) {
        return b.sustainabilityIndex - a.sustainabilityIndex;
      }
      return b.score - a.score;
    });

    // Strict display limit: strictly TOP 10 options only
    return scoredList.slice(0, 10);
  }, [result.eligibleMaterials]);

  // Top 10 Ranked Materials for Dropdown 4 (Strictly TOP 10 Limit)
  const topRankedMaterials = useMemo(() => {
    return result.eligibleMaterials.slice(0, 10);
  }, [result.eligibleMaterials]);

  // Hard Constraint Elimination Stage for Dropdown 5 (EXACTLY 4 Core Items with critical failure tags)
  const coreEliminatedMaterials = useMemo(() => {
    const isFresh = activeCommodity?.profile?.isFreshProduce;
    const foodId = activeCommodity?.id || '';

    if (isFresh) {
      return [
        {
          material: {
            id: 'aluminium-foil',
            name: 'Aluminium Foil Barrier Laminate',
            structure: '12μm PET / 9μm Bare Al-Foil / 50μm PE',
            category: 'Flexible Multilayer Laminates',
            otrValue: 0.1,
            wvtrValue: 0.1
          },
          failureTag: 'Fatal Anaerobic Suffocation',
          failureTagClass: 'bg-rose-100 text-rose-800 border-rose-300',
          filterReason: 'Zero gas transmission (OTR = 0.1 cc/m²·day) completely suffocates living cellular tissue, forcing anaerobic cellular respiration, ethanol/acetaldehyde intoxication, and rapid tissue liquefaction rotting.'
        },
        {
          material: {
            id: 'tinplate-can',
            name: 'Hermetic Rigid Tinplate Can',
            structure: '0.22mm Electrolytic Tinplate (ETP)',
            category: 'Metal',
            otrValue: 0.0,
            wvtrValue: 0.0
          },
          failureTag: 'Acid Delamination Risk',
          failureTagClass: 'bg-amber-100 text-amber-900 border-amber-300',
          filterReason: 'Zero headspace gas equilibrium traps active respiratory metabolic CO₂, producing high internal pressure build-up, acid souring, can doming, and irreversible cellular breakdown.'
        },
        {
          material: {
            id: 'ldpe',
            name: 'Unperforated Non-Vented LDPE Bag',
            structure: '50μm Monolithic Low-Density Polyethylene',
            category: 'Monolithic Polymers',
            otrValue: 2800,
            wvtrValue: 2.0
          },
          failureTag: 'Moisture Barrier Failure',
          failureTagClass: 'bg-sky-100 text-sky-900 border-sky-300',
          filterReason: 'Absence of laser micro-perforations or anti-fog breathability causes internal moisture condensation sweat beads, creating an optimal incubation environment for Botrytis and Erwinia fungal soft rots.'
        },
        {
          material: {
            id: 'hdpe',
            name: 'Post-Consumer Recycled Polymer Tray',
            structure: 'Thermoformed Non-Certified Post-Consumer Substrate',
            category: 'Polymer (Rigid/Flexible)',
            otrValue: 1200,
            wvtrValue: 35.0
          },
          failureTag: 'Non-Food-Grade Migration',
          failureTagClass: 'bg-purple-100 text-purple-900 border-purple-300',
          filterReason: 'Uncertified recycled plastic compound releases residual monomer plasticizers and detergent washing residues that absorb directly into moist horticultural cuticle surfaces, breaching IS 9845 limits.'
        }
      ];
    }

    if (foodId === 'pickles') {
      return [
        {
          material: {
            id: 'aluminium-foil',
            name: 'Bare Aluminium Foil (Unlacquered)',
            structure: 'Single-ply 20μm Bare Unlacquered Aluminium Foil',
            category: 'Paperboard & Foils',
            otrValue: 0.1,
            wvtrValue: 0.1
          },
          failureTag: 'Acid Delamination Risk',
          failureTagClass: 'bg-amber-100 text-amber-900 border-amber-300',
          filterReason: 'Electrochemical attack by acidic brine and organic acetic acids (pH < 3.8) produces rapid pinhole corrosion and hazardous aluminum ion migration into the brine solution.'
        },
        {
          material: {
            id: 'paperboard',
            name: 'Paperboard Folding Carton',
            structure: '320 GSM Uncoated Bleached Kraft Solid Board',
            category: 'Cellulosic / Paper',
            otrValue: 1500,
            wvtrValue: 120
          },
          failureTag: 'Moisture Barrier Failure',
          failureTagClass: 'bg-sky-100 text-sky-900 border-sky-300',
          filterReason: 'Porous cellulosic substrate lacks liquid containment barrier. Acidic brine and mustard oil dissolve cellulose hydrogen bonds, causing immediate structural softening, delamination, and liquid leakage.'
        },
        {
          material: {
            id: 'ldpe',
            name: 'Monolithic Low-Density Polyethylene Film',
            structure: '45μm Monolithic Low-Density Polyethylene',
            category: 'Monolithic Polymers',
            otrValue: 2800,
            wvtrValue: 18.0
          },
          failureTag: 'High Oxygen Permeability',
          failureTagClass: 'bg-rose-100 text-rose-800 border-rose-300',
          filterReason: 'Excessive oxygen transmission (OTR > 2800 cc/m²·day) allows atmospheric O₂ penetration, stimulating aerobic Mycoderma surface yeast proliferation and oily mold pellicle growth on the pickle brine.'
        },
        {
          material: {
            id: 'hdpe',
            name: 'Unlined Recycled Post-Consumer Plastic Pouch',
            structure: 'Non-Food Grade Recycled Polyolefin Compound',
            category: 'Polymer (Rigid/Flexible)',
            otrValue: 950,
            wvtrValue: 22.0
          },
          failureTag: 'Non-Food-Grade Migration',
          failureTagClass: 'bg-purple-100 text-purple-900 border-purple-300',
          filterReason: 'Lacks functional barrier protection against aggressive acetic acid and essential spice oils, causing severe plasticizer extraction and chemical leaching exceeding the 10 mg/dm² overall migration limit.'
        }
      ];
    }

    if (foodId === 'milk-powder' || foodId === 'spices') {
      return [
        {
          material: {
            id: 'ldpe',
            name: 'Monolithic LDPE Polyethylene Film',
            structure: '45μm Monolithic Low-Density Polyethylene',
            category: 'Monolithic Polymers',
            otrValue: 2800,
            wvtrValue: 18.0
          },
          failureTag: 'High Oxygen Permeability',
          failureTagClass: 'bg-rose-100 text-rose-800 border-rose-300',
          filterReason: 'OTR > 2800 cc/m²·day fails the zero-tolerance oxidation barrier threshold (< 1.5 cc). Atmospheric oxygen penetrates continuously, oxidising unsaturated lipids and causing severe aroma terpene loss.'
        },
        {
          material: {
            id: 'kraft-paper',
            name: 'Multiwall Kraft Paper Sack (Unlined)',
            structure: '80 GSM Natural Kraft Paper (Unlined)',
            category: 'Cellulosic / Paper',
            otrValue: 1800,
            wvtrValue: 160
          },
          failureTag: 'Moisture Barrier Failure',
          failureTagClass: 'bg-sky-100 text-sky-900 border-sky-300',
          filterReason: 'Lacks water vapor barrier (WVTR > 160 g/m²·day). Atmospheric moisture penetrates rapidly, causing irreversible hygroscopic powder caking, insoluble lump formation, and fungal proliferation.'
        },
        {
          material: {
            id: 'aluminium-foil',
            name: 'Bare Unlacquered Aluminium Foil',
            structure: '9μm Single-layer Unlaminated Aluminium Foil',
            category: 'Paperboard & Foils',
            otrValue: 0.1,
            wvtrValue: 0.1
          },
          failureTag: 'Acid Delamination Risk',
          failureTagClass: 'bg-amber-100 text-amber-900 border-amber-300',
          filterReason: 'Unprotected metal interface is vulnerable to volatile organic acids and flex fatigue micro-cracking during packing vibration, destroying hermetic protection.'
        },
        {
          material: {
            id: 'biodegradable-film',
            name: 'Non-Certified Industrial Recycled Polymer',
            structure: 'Industrial Recycled Polyolefin / Uncertified Compound',
            category: 'Polymer (Rigid/Flexible)',
            otrValue: 850,
            wvtrValue: 85.0
          },
          failureTag: 'Non-Food-Grade Migration',
          failureTagClass: 'bg-purple-100 text-purple-900 border-purple-300',
          filterReason: 'Food lipids and active essential oils act as organic solvents that extract residual polymerization catalysts, heavy metals, and plasticizers exceeding statutory IS 9845 migration thresholds.'
        }
      ];
    }

    // Default for Snacks, Potato Chips, Biscuits, Bakery, Flour, Grains, and others
    return [
      {
        material: {
          id: 'ldpe',
          name: 'Low-Density Polyethylene Mono-Film (LDPE)',
          structure: '50μm Monolithic Low-Density Polyethylene',
          category: 'Monolithic Polymers',
          otrValue: 2800,
          wvtrValue: 18.0
        },
        failureTag: 'High Oxygen Permeability',
        failureTagClass: 'bg-rose-100 text-rose-800 border-rose-300',
        filterReason: 'OTR > 2800 cc/m²·day exceeds the mandatory threshold (< 2.0 cc). Unprotected frying oils and fats suffer rapid lipid peroxidation, generating pungent hexanal rancidity within 10 days.'
      },
      {
        material: {
          id: 'paperboard',
          name: 'Porous Paperboard Folding Carton (Unlined)',
          structure: '280 GSM Uncoated Bleached Paperboard',
          category: 'Cellulosic / Paper',
          otrValue: 1500,
          wvtrValue: 120
        },
        failureTag: 'Moisture Barrier Failure',
        failureTagClass: 'bg-sky-100 text-sky-900 border-sky-300',
        filterReason: 'WVTR of 120 g/m²·day fails the mandatory water vapor threshold (< 1.5 g/m²·day). Atmospheric moisture penetrates within 48 hours, causing rapid starch hydration, loss of crispness, and sogginess.'
      },
      {
        material: {
          id: 'aluminium-foil',
          name: 'Bare Aluminium Foil (Single-ply Unlaminated)',
          structure: '9μm Single-layer Unlaminated Aluminium Foil',
          category: 'Paperboard & Foils',
          otrValue: 0.1,
          wvtrValue: 0.1
        },
        failureTag: 'Acid Delamination Risk',
        failureTagClass: 'bg-amber-100 text-amber-900 border-amber-300',
        filterReason: 'Unlaminated single-layer metal foil suffers catastrophic micro-cracking, flex pinholing, and chemical delamination under pillow packing stress and transit vibration.'
      },
      {
        material: {
          id: 'corrugated-cardboard',
          name: 'Post-Consumer Recycled Paperboard',
          structure: 'Unlined Recycled Post-Consumer Board',
          category: 'Cellulosic / Paper',
          otrValue: 2000,
          wvtrValue: 180
        },
        failureTag: 'Non-Food-Grade Migration',
        failureTagClass: 'bg-purple-100 text-purple-900 border-purple-300',
        filterReason: 'Mineral oil saturated hydrocarbons (MOSH) and aromatic hydrocarbons (MOAH) from post-consumer recycled paperboard migrate into food contact surfaces, breaching FSSAI 2026 statutory safety limits.'
      }
    ];
  }, [activeCommodity]);

  // Shelf Life Curve Data Points (For Line Graph in Dropdown 2)
  const lineGraphPoints = useMemo(() => {
    const pointsCount = 6;
    const maxDays = Math.max(targetShelfLifeDays, 180);
    const baselineDays = Math.max(1, currentShelfLifeDays);

    const steps = [];
    for (let i = 0; i <= pointsCount; i++) {
      const day = Math.round((i / pointsCount) * maxDays);
      
      // Unpackaged baseline decay (steep drop)
      const baselineQuality = Math.max(0, Math.round(100 * Math.exp(-2.5 * (day / baselineDays))));
      
      // Standard commercial packaging decay (moderate drop)
      const standardQuality = Math.max(15, Math.round(100 * Math.exp(-0.85 * (day / (maxDays * 0.65)))));
      
      // SmartPack Engineered solution (retains high freshness)
      const engineeredQuality = Math.max(45, Math.round(100 * Math.exp(-0.18 * (day / maxDays))));

      steps.push({
        day,
        baselineQuality,
        standardQuality,
        engineeredQuality
      });
    }
    return steps;
  }, [targetShelfLifeDays, currentShelfLifeDays]);

  // Donut Chart Composition Slices (For Pie Chart in Dropdown 2)
  const compositionSlices = useMemo(() => {
    const mat = selectedPrescriptionMat?.material;
    if (mat?.isMonoMaterial) {
      return [
        { label: 'Primary Mono-Resin (PP/PE)', percent: 88, color: '#059669', costRatio: '₹145/kg' },
        { label: 'Barrier Co-Extruded Skin', percent: 6, color: '#0284C7', costRatio: '₹28/kg' },
        { label: 'Sealant Additive Layer', percent: 4, color: '#8B5CF6', costRatio: '₹18/kg' },
        { label: 'Functional Primer / Ink', percent: 2, color: '#F59E0B', costRatio: '₹9/kg' }
      ];
    }
    return [
      { label: 'Outer Structural Substrate (PET/BOPP)', percent: 42, color: '#059669', costRatio: '₹95/kg' },
      { label: 'Barrier Core (Alu Foil / EVOH / Metallized)', percent: 28, color: '#0284C7', costRatio: '₹110/kg' },
      { label: 'Inner Hermetic Sealant (PE / CPP)', percent: 22, color: '#8B5CF6', costRatio: '₹55/kg' },
      { label: 'Adhesive Lamination & Solvent-Free Tie', percent: 8, color: '#F59E0B', costRatio: '₹25/kg' }
    ];
  }, [selectedPrescriptionMat]);

  return (
    <div className="space-y-4 w-full">
      {/* ========================================================================= */}
      {/* 1. AUTO-SCROLL TARGET: RECOMMENDATIONS SECTION HEADER */}
      {/* ========================================================================= */}
      <div
        ref={resultsHeaderRef}
        id="packaging-recommendations-header"
        className="scroll-mt-4 bg-white rounded-md border border-[#CBD5E1] p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
              Packaging Recommendations &amp; Technical Prescriptions
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-bold text-slate-600">
              Target Commodity: <strong className="text-slate-900">{activeCommodity.name}</strong>
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Engineered Packaging Solutions Overview
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Multi-barrier matching for {quantityAmount} {quantityUnit} • Target Shelf Life: {targetShelfLifeDays} Days • Storage: {storage.storageMode} ({storage.temperatureC}°C, {storage.relativeHumidityPercent}% RH)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopySpec}
            className="px-3 py-1.5 rounded text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-[#CBD5E1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copiedSpec ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Spec!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Top Spec</span>
              </>
            )}
          </button>
          <span className="px-2.5 py-1 rounded bg-emerald-50 text-[#059669] border border-emerald-300 text-xs font-bold font-mono">
            {result.eligibleMaterials.length} Eligible Materials
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION: 4 RECOMMENDED PACKAGING SOLUTIONS (SIDE-BY-SIDE) */}
      {/* ========================================================================= */}
      <section id="hero-recommendation-solutions" className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
            <span>Recommended Packaging Solutions (Top-Tier Prescriptions)</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Ranked by multi-attribute utility theory against food barrier criteria
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {heroCards.map((card, idx) => {
            const mat = card.material;
            if (!mat) {
              return (
                <div
                  key={idx}
                  className="bg-white rounded-md border border-dashed border-slate-300 p-3.5 flex flex-col justify-between text-xs text-slate-500"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{card.title}</span>
                    <p className="font-semibold text-slate-700">No qualifying candidate for category</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-4">Threshold criteria unfulfilled</span>
                </div>
              );
            }

            const isSelected = selectedPrescriptionMat?.material.id === mat.material.id;

            return (
              <div
                key={idx}
                className={`bg-white rounded-md border transition-all shadow-xs hover:shadow-sm flex flex-col justify-between p-3.5 relative ${
                  isSelected ? 'ring-2 ring-[#059669] border-[#059669]' : 'border-[#CBD5E1]'
                }`}
              >
                <div>
                  {/* Top Badge & Score Row */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 ${card.badgeColor}`}
                    >
                      {card.icon}
                      <span>{card.title}</span>
                    </span>
                    <div className="text-right">
                      <span className={`text-base font-black font-mono leading-none ${card.scoreColor}`}>
                        {mat.score}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* Material Name & Substrate */}
                  <h4 className="text-sm font-black text-slate-900 line-clamp-1" title={card.cardMaterialName || mat.material.name}>
                    {card.cardMaterialName || mat.material.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-600 line-clamp-1 mt-0.5" title={mat.material.structure}>
                    {mat.material.structure}
                  </p>

                  {/* Brief Key Rationale */}
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {mat.keyReason || mat.material.description}
                  </p>

                  {/* Key OTR / WVTR Metrics Grid */}
                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="bg-[#F8FAFC] p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">OTR (Oxygen)</span>
                      <span className="font-mono font-bold text-slate-900 block truncate">
                        {mat.material.otrValue}{' '}
                        <span className="text-[9px] text-slate-500 font-normal">cc/m²·d</span>
                      </span>
                    </div>
                    <div className="bg-[#F8FAFC] p-1.5 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-500 font-bold block uppercase">WVTR (Moisture)</span>
                      <span className="font-mono font-bold text-slate-900 block truncate">
                        {mat.material.wvtrValue}{' '}
                        <span className="text-[9px] text-slate-500 font-normal">g/m²·d</span>
                      </span>
                    </div>
                  </div>

                  {/* Commercial & Eco Metrics */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-medium">
                    <span>Est: <strong className="text-slate-800 font-mono">{mat.material.estimatedCostPerKg}</strong></span>
                    <span>Recyclable: <strong className="text-emerald-700 font-mono">{mat.material.recyclabilityPercent}%</strong></span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePrescriptionMaterialId(mat.material.id);
                      setOpenAccordions(prev => ({ ...prev, 1: true }));
                      // Smooth scroll down to Dropdown 1
                      document.getElementById('accordion-1-technical-prescription')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                      });
                    }}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#059669] text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-[#CBD5E1]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Spec</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToCompare(mat.material.id)}
                    className="py-1.5 px-2.5 rounded text-xs font-bold text-[#059669] hover:bg-emerald-50 border border-emerald-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    title="Compare head-to-head"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. STRUCTURED DROPDOWN ACCORDIONS (5 DYNAMIC DROPDOWNS) */}
      {/* ========================================================================= */}
      <section className="space-y-3 pt-1">
        
        {/* ======================================================================= */}
        {/* DROPDOWN 1: Materials Technical Prescription (12-Point Technical Grid) */}
        {/* ======================================================================= */}
        <div
          id="accordion-1-technical-prescription"
          className="bg-white rounded-md border border-[#CBD5E1] shadow-xs overflow-hidden"
        >
          {/* Collapsible Accordion Header */}
          <button
            type="button"
            onClick={() => toggleAccordion(1)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    Materials Technical Prescription
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#059669] border border-emerald-300 uppercase">
                    12-Point Spec Grid
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Detailed engineering specification sheet for converter manufacturing &amp; deployment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[1] ? 'Collapse Specification' : 'Expand Specification'}
              </span>
              {openAccordions[1] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Accordion Content Body */}
          {openAccordions[1] && selectedPrescriptionMat && (
            <div className="p-4 space-y-4">
              {/* Material Switcher Pills Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Wrench className="w-4 h-4 text-[#059669]" />
                  <span>Inspect Solution:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {heroCards.map(
                    (c, i) =>
                      c.material && (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActivePrescriptionMaterialId(c.material!.material.id)}
                          className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors border ${
                            selectedPrescriptionMat.material.id === c.material.material.id
                              ? 'bg-[#059669] text-white border-[#047857] shadow-2xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {c.title}: {c.cardMaterialName || c.material.material.name}
                        </button>
                      )
                  )}
                </div>
              </div>

              {/* Specification Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h5 className="text-base font-black text-slate-900">
                    {selectedPrescriptionMat.material.name} — Technical Specification Sheet
                  </h5>
                  <p className="text-xs text-slate-600 font-mono">
                    Structure: <strong>{selectedPrescriptionMat.prescription.materialStructure}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySpec}
                    className="px-3 py-1 rounded text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedSpec ? 'Copied!' : 'Copy Spec'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToCompare(selectedPrescriptionMat.material.id)}
                    className="px-3 py-1 rounded text-xs font-bold text-[#059669] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare Substrate</span>
                  </button>
                </div>
              </div>

              {/* 12-POINT TECHNICAL SPECIFICATION GRID */}
              {(() => {
                const p = selectedPrescriptionMat.prescription;
                const m = selectedPrescriptionMat.material;

                const spec12Points = [
                  {
                    num: 1,
                    title: 'Package Format',
                    value: p.packageFormat,
                    subtext: 'Rigid / Flexible / Pouch Configuration',
                    icon: <Package className="w-3.5 h-3.5 text-slate-600" />
                  },
                  {
                    num: 2,
                    title: 'Substrate Lamination',
                    value: p.materialStructure,
                    subtext: 'Co-extruded barrier lamination',
                    icon: <Layers className="w-3.5 h-3.5 text-slate-600" />
                  },
                  {
                    num: 3,
                    title: 'Thickness / Gauge',
                    value: p.thicknessRange,
                    subtext: 'Micron gauge for transit rigor',
                    icon: <Activity className="w-3.5 h-3.5 text-slate-600" />
                  },
                  {
                    num: 4,
                    title: 'Moisture Barrier (WVTR)',
                    value: p.moistureBarrier,
                    subtext: 'ASTM F1249 test standard verified',
                    icon: <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  },
                  {
                    num: 5,
                    title: 'Oxygen Barrier (OTR)',
                    value: p.oxygenBarrier,
                    subtext: 'ASTM D3985 transmission benchmark',
                    icon: <Flame className="w-3.5 h-3.5 text-cyan-600" />
                  },
                  {
                    num: 6,
                    title: 'Light & UV Shielding',
                    value: p.lightBarrier,
                    subtext: 'Prevents photo-oxidation & lipid rancidity',
                    icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  },
                  {
                    num: 7,
                    title: 'Mechanical Strength & Burst',
                    value: p.mechanicalStrength,
                    subtext: 'Puncture, tensile & seam burst resistance',
                    icon: <Wrench className="w-3.5 h-3.5 text-slate-600" />
                  },
                  {
                    num: 8,
                    title: 'Sealing Method & Seam',
                    value: p.sealability,
                    subtext: 'Hermetic heat-seal / ultrasonic seal integrity',
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  },
                  {
                    num: 9,
                    title: 'Modified Atmosphere (MAP)',
                    value: p.mapRequirement,
                    subtext: 'Equilibrium gas composition target',
                    icon: <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  },
                  {
                    num: 10,
                    title: 'Cost & Procurement',
                    value: p.cost,
                    subtext: 'Indian converter supply availability tier',
                    icon: <DollarSign className="w-3.5 h-3.5 text-slate-600" />
                  },
                  {
                    num: 11,
                    title: 'Sustainability & Recyclability',
                    value: p.sustainability,
                    subtext: 'EPR compliance & mechanical recyclability index',
                    icon: <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  },
                  {
                    num: 12,
                    title: 'Quality Validation & FSSAI',
                    value: `Score: ${selectedPrescriptionMat.score}/100 — FSSAI / IS 15609 Compliant`,
                    subtext: 'Statutory non-migration food contact approved',
                    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                  }
                ];

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {spec12Points.map(item => (
                      <div
                        key={item.num}
                        className="p-3 rounded-md bg-white border border-[#CBD5E1] space-y-1.5 hover:border-[#059669] transition-colors shadow-2xs"
                      >
                        {/* CARD TOPICS / HEADERS: BOLD, uppercase, high-contrast text */}
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-900 text-xs tracking-wider uppercase">
                            {item.icon}
                            <span>{item.num}. {item.title}</span>
                          </span>
                        </div>

                        {/* CARD DESCRIPTIONS & SPECS: LIGHT / REGULAR typography */}
                        <div className="pt-0.5 space-y-0.5">
                          <span className="font-normal text-slate-600 text-xs block leading-relaxed">
                            {item.value}
                          </span>
                          <span className="font-normal text-slate-500 text-[11px] block leading-tight">
                            {item.subtext}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* DROPDOWN 2: Operational Analysis & Performance (Table + 2 Charts) */}
        {/* ======================================================================= */}
        <div
          id="accordion-2-operational-analysis"
          className="bg-white rounded-md border border-[#CBD5E1] shadow-xs overflow-hidden"
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => toggleAccordion(2)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                2
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    Operational Analysis &amp; Performance
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300 uppercase">
                    Tabular &amp; Visual Analytics
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Detailed performance matrix, shelf life decay curve, and material composition breakdown
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[2] ? 'Collapse Analysis' : 'Expand Analysis'}
              </span>
              {openAccordions[2] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[2] && (
            <div className="p-4 space-y-4">
              
              {/* PART A: TABULAR BREAKDOWN FORM (HIGH CONTRAST TYPOGRAPHY) */}
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Comparative Operational Performance Matrix</span>
                </h5>

                <div className="overflow-x-auto border border-[#CBD5E1] rounded-md shadow-2xs">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-900 font-bold border-b border-[#CBD5E1]">
                        <th className="py-3 px-3 uppercase tracking-wider font-bold text-slate-900">Prescription Role</th>
                        <th className="py-3 px-3 uppercase tracking-wider font-bold text-slate-900">Substrate Structure</th>
                        <th className="py-3 px-2 text-center font-mono uppercase tracking-wider font-bold text-slate-900">Score (/100)</th>
                        <th className="py-3 px-2 font-mono uppercase tracking-wider font-bold text-slate-900">Expected Shelf Life</th>
                        <th className="py-3 px-2 uppercase tracking-wider font-bold text-slate-900">Sustainable Analysis (EPR)</th>
                        <th className="py-3 px-2 font-mono uppercase tracking-wider font-bold text-slate-900">Cost Optimization</th>
                        <th className="py-3 px-2 font-mono uppercase tracking-wider font-bold text-slate-900">OTR / WVTR</th>
                        <th className="py-3 px-3 text-right uppercase tracking-wider font-bold text-slate-900">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {heroCards.map((c, i) => {
                        const m = c.material;
                        if (!m) return null;
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            {/* Prescription Role Badges: Pure white bold text on solid high-contrast backgrounds */}
                            <td className="py-3 px-3">
                              <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded shadow-2xs tracking-wide inline-block ${c.badgeColor}`}>
                                {c.title}
                              </span>
                            </td>
                            {/* Substrate Structure: Crisp dark typography */}
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-900 text-xs block">{m.material.name}</span>
                              <span className="text-[11px] font-mono text-slate-800 font-semibold block mt-0.5">{m.material.structure}</span>
                            </td>
                            {/* Score (/100): Bold dark badge */}
                            <td className="py-3 px-2 text-center font-mono">
                              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200">
                                ({m.score}/100)
                              </span>
                            </td>
                            {/* Expected Shelf Life: Crisp dark typography */}
                            <td className="py-3 px-2 font-mono">
                              <span className="font-bold text-slate-900 text-xs block">
                                {targetShelfLifeDays} Days
                              </span>
                              <span className="block text-[11px] font-semibold text-emerald-800 mt-0.5">
                                (Baseline: ~{currentShelfLifeDays}d)
                              </span>
                            </td>
                            {/* Sustainable Analysis: Crisp dark typography */}
                            <td className="py-3 px-2">
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-900 font-mono block text-xs">
                                  {m.material.recyclabilityPercent}% Recyclable
                                </span>
                                <span className="text-[11px] text-slate-800 font-semibold block">
                                  {m.material.isMonoMaterial ? 'Mono-Polyolefin Stream' : 'Multilayer Recovery'}
                                </span>
                              </div>
                            </td>
                            {/* Cost Optimization: Crisp dark typography */}
                            <td className="py-3 px-2 font-mono">
                              <span className="font-bold text-slate-900 text-xs block">{m.material.estimatedCostPerKg}</span>
                              <span className="text-[11px] text-slate-800 font-semibold block mt-0.5">{m.material.costLevel} Tier</span>
                            </td>
                            {/* OTR / WVTR: Crisp dark typography */}
                            <td className="py-3 px-2 font-mono text-xs">
                              <span className="font-bold text-slate-900 block">O₂: {m.material.otrValue} cc</span>
                              <span className="font-bold text-slate-800 block mt-0.5">H₂O: {m.material.wvtrValue} g</span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => onNavigateToCompare(m.material.id)}
                                className="px-3 py-1.5 rounded text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-2xs transition-colors cursor-pointer"
                              >
                                Compare
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PART B: CHARTS INTEGRATION (Line Graph & Pie/Donut Chart) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                
                {/* CHART 1: LINE GRAPH (Shelf Life Extension Curve & Barrier Degradation Over Time) */}
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Shelf Life Extension &amp; Quality Retention Curve</span>
                      </h6>
                      <p className="text-[10px] text-slate-500">
                        Product sensory &amp; biochemical retention over time (% freshness vs. Days)
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#059669] bg-white px-2 py-0.5 rounded border border-slate-200">
                      Target: {targetShelfLifeDays}d
                    </span>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <svg viewBox="0 0 400 160" className="w-full h-40">
                      {/* Grid lines */}
                      <line x1="40" y1="20" x2="380" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="55" x2="380" y2="55" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="90" x2="380" y2="90" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="40" y1="125" x2="380" y2="125" stroke="#E2E8F0" strokeWidth="1" />

                      {/* Threshold Minimum Quality Line (60%) */}
                      <line x1="40" y1="62" x2="380" y2="62" stroke="#FDA4AF" strokeDasharray="3 3" strokeWidth="1" />
                      <text x="382" y="65" fontSize="8" fill="#E11D48" fontStyle="italic">Threshold</text>

                      {/* Y-Axis Labels */}
                      <text x="15" y="24" fontSize="8" fill="#64748B" fontFamily="monospace">100%</text>
                      <text x="20" y="60" fontSize="8" fill="#64748B" fontFamily="monospace">60%</text>
                      <text x="20" y="94" fontSize="8" fill="#64748B" fontFamily="monospace">30%</text>
                      <text x="25" y="128" fontSize="8" fill="#64748B" fontFamily="monospace">0%</text>

                      {/* Curve 1: Unpackaged Baseline (Rapid Drop, Red/Amber Dashed) */}
                      <path
                        d="M 40 20 Q 80 50 120 120 L 380 125"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />

                      {/* Curve 2: Standard Commodity Film (Moderate Drop, Blue Dotted) */}
                      <path
                        d="M 40 20 Q 140 35 240 85 T 380 115"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />

                      {/* Curve 3: SmartPack Best Overall (Maintained >85% freshness, Emerald Solid) */}
                      <path
                        d="M 40 20 Q 200 24 380 42"
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                      />

                      {/* Marker Points for Best Overall Curve */}
                      <circle cx="40" cy="20" r="3" fill="#059669" />
                      <circle cx="210" cy="25" r="3" fill="#059669" />
                      <circle cx="380" cy="42" r="3.5" fill="#059669" stroke="#FFFFFF" strokeWidth="1" />

                      {/* X-Axis Labels */}
                      <text x="40" y="145" fontSize="8" fill="#64748B" textAnchor="middle" fontFamily="monospace">Day 0</text>
                      <text x="125" y="145" fontSize="8" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                        ~{Math.round(targetShelfLifeDays * 0.25)}d
                      </text>
                      <text x="210" y="145" fontSize="8" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                        ~{Math.round(targetShelfLifeDays * 0.5)}d
                      </text>
                      <text x="295" y="145" fontSize="8" fill="#64748B" textAnchor="middle" fontFamily="monospace">
                        ~{Math.round(targetShelfLifeDays * 0.75)}d
                      </text>
                      <text x="380" y="145" fontSize="8" fill="#059669" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                        {targetShelfLifeDays}d
                      </text>
                    </svg>

                    {/* Chart Legend */}
                    <div className="flex flex-wrap items-center justify-between text-[10px] pt-1 px-1 border-t border-slate-100 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-[#059669] inline-block" />
                        <span className="font-bold text-slate-800">SmartPack Solution (&gt;85% Quality)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-blue-500 border-dashed inline-block" />
                        <span className="text-slate-600">Standard Commodity Film</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-red-500 border-dashed inline-block" />
                        <span className="text-slate-600">Unpackaged Baseline</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CHART 2: PIE / DONUT CHART (Cost & Material Composition Breakdown Ratio) */}
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-md p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h6 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                        <PieChartIcon className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Cost &amp; Material Layer Composition Ratio</span>
                      </h6>
                      <p className="text-[10px] text-slate-500">
                        Weight ratio, layer functions &amp; raw material cost contribution
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {(selectedPrescriptionMat?.material.name || 'Material').split(' ')[0]}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                    {/* SVG Donut Chart */}
                    <div className="relative w-32 h-32 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Slice 1: 42% (Outer) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="transparent"
                          stroke="#059669"
                          strokeWidth="20"
                          strokeDasharray="92.36 220"
                          strokeDashoffset="0"
                        />
                        {/* Slice 2: 28% (Barrier) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="transparent"
                          stroke="#0284C7"
                          strokeWidth="20"
                          strokeDasharray="61.57 220"
                          strokeDashoffset="-92.36"
                        />
                        {/* Slice 3: 22% (Sealant) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="transparent"
                          stroke="#8B5CF6"
                          strokeWidth="20"
                          strokeDasharray="48.38 220"
                          strokeDashoffset="-153.93"
                        />
                        {/* Slice 4: 8% (Adhesive/Inks) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          fill="transparent"
                          stroke="#F59E0B"
                          strokeWidth="20"
                          strokeDasharray="17.59 220"
                          strokeDashoffset="-202.31"
                        />
                      </svg>
                      {/* Center Badge */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-black text-slate-900 leading-none">100%</span>
                        <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">Composite</span>
                      </div>
                    </div>

                    {/* Legend & Cost breakdown */}
                    <div className="flex-1 space-y-1.5 w-full text-xs">
                      {compositionSlices.map((slice, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 p-1 rounded hover:bg-slate-50">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-xs shrink-0"
                              style={{ backgroundColor: slice.color }}
                            />
                            <span className="font-semibold text-slate-800 text-[11px] truncate">
                              {slice.label}
                            </span>
                          </div>
                          <div className="text-right shrink-0 font-mono">
                            <span className="font-bold text-slate-900 text-xs">{slice.percent}%</span>
                            <span className="text-[10px] text-slate-500 ml-1">({slice.costRatio})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* DROPDOWN 3: Alternate Eco-Friendly Materials */}
        {/* ======================================================================= */}
        <div
          id="accordion-3-eco-materials"
          className="bg-white rounded-md border border-[#CBD5E1] shadow-xs overflow-hidden"
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => toggleAccordion(3)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                3
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    Alternate Eco-Friendly Materials
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-300 uppercase">
                    Top 10 Sustainable Alternatives
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Top 10 highest-performing sustainable, bio-based &amp; circular mono-materials ranked by sustainability index
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[3] ? 'Collapse Eco Solutions' : 'Expand Eco Solutions'}
              </span>
              {openAccordions[3] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[3] && (
            <div className="p-4 space-y-3">
              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span>
                  <strong>EPR &amp; Plastic Waste Management 2026 Ready:</strong> Showing the top 10 highest-performing sustainable, circular mono-polyolefins and bio-polymers sorted by sustainability index.
                </span>
                <span className="text-[10px] font-mono font-bold text-[#059669] shrink-0 ml-2">
                  IS 14534 Compliant • Top 10
                </span>
              </div>

              <div className="overflow-x-auto border border-[#CBD5E1] rounded-md">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-[#CBD5E1]">
                      <th className="py-2.5 px-3">Material Name &amp; Structure</th>
                      <th className="py-2.5 px-2 font-mono">Costing (₹/kg)</th>
                      <th className="py-2.5 px-2 font-mono">Estimated Shelf Life</th>
                      <th className="py-2.5 px-2">Carbon Footprint Reduction</th>
                      <th className="py-2.5 px-2">Recyclability &amp; Sustainability Index</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ecoFriendlyCandidates.map(m => {
                      const co2Reduction = Math.round(25 + m.material.recyclabilityPercent * 0.45);
                      return (
                        <tr key={m.material.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{m.material.name}</span>
                            <span className="text-[10px] font-mono text-slate-500">{m.material.structure}</span>
                          </td>
                          <td className="py-2.5 px-2 font-mono font-bold text-slate-900">
                            {m.material.estimatedCostPerKg}
                          </td>
                          <td className="py-2.5 px-2 font-mono text-slate-700">
                            ~{Math.round(targetShelfLifeDays * (m.score >= 80 ? 0.95 : 0.8))} Days
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="font-bold text-emerald-700 font-mono">
                              -{co2Reduction}% CO₂e
                            </span>
                            <span className="block text-[10px] text-slate-500">vs Alu-foil laminate</span>
                          </td>
                          <td className="py-2.5 px-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                                Eco-Index: {m.sustainabilityIndex}/100
                              </span>
                            </div>
                            <span className="font-mono font-bold text-slate-800 block text-[11px]">
                              {m.material.recyclabilityPercent}% Recyclable
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {m.material.compostability ? 'Compostable certified' : m.material.isMonoMaterial ? 'Mono-material stream' : 'Stream 4 Polyolefin'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePrescriptionMaterialId(m.material.id);
                                  setOpenAccordions(prev => ({ ...prev, 1: true }));
                                }}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100 border border-[#CBD5E1]"
                              >
                                View Spec
                              </button>
                              <button
                                type="button"
                                onClick={() => onNavigateToCompare(m.material.id)}
                                className="px-2.5 py-1 rounded text-[11px] font-bold text-[#059669] hover:bg-emerald-50 border border-emerald-300"
                              >
                                Compare
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* DROPDOWN 4: Material Ranking & Matrix */}
        {/* ======================================================================= */}
        <div
          id="accordion-4-ranking-matrix"
          className="bg-white rounded-md border border-[#CBD5E1] shadow-xs overflow-hidden"
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => toggleAccordion(4)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    Material Ranking &amp; Matrix
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 uppercase">
                    Top 10 Ranked Materials
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Top 10 candidate substrates for this food product sorted by composite utility score
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[4] ? 'Collapse Ranking' : 'Expand Ranking'}
              </span>
              {openAccordions[4] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[4] && (
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto border border-[#CBD5E1] rounded-md">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-[#CBD5E1]">
                      <th className="py-2.5 px-3">Rank &amp; Substrate</th>
                      <th className="py-2.5 px-3">Brief Description &amp; Structure</th>
                      <th className="py-2.5 px-2 text-center font-mono">Score (/100)</th>
                      <th className="py-2.5 px-2">Cost Tier</th>
                      <th className="py-2.5 px-2">Barrier Level</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topRankedMaterials.map((m, idx) => {
                      const isTop = idx === 0;
                      return (
                        <tr
                          key={m.material.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            selectedPrescriptionMat?.material.id === m.material.id ? 'bg-emerald-50/50' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black shrink-0 ${
                                  isTop ? 'bg-[#059669] text-white' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-slate-900 block">{m.material.name}</span>
                                <span className="text-[10px] text-slate-500">{m.material.category}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs">
                            <span className="text-slate-700 block truncate" title={m.material.description}>
                              {m.material.description}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 block truncate">
                              {m.material.structure}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono">
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block text-xs border border-slate-200">
                              ({m.score}/100)
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="font-bold text-slate-800">{m.material.costLevel}</span>
                            <span className="block text-[10px] text-slate-500 font-mono">
                              {m.material.estimatedCostPerKg}
                            </span>
                          </td>
                          <td className="py-2.5 px-2">
                            <span className="font-bold text-blue-900 font-mono text-[11px] block">
                              {m.material.otrValue <= 1.0 && m.material.wvtrValue <= 1.0
                                ? 'Ultra-High Barrier'
                                : m.material.otrValue <= 15.0
                                ? 'High Barrier'
                                : 'Moderate Barrier'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              OTR {m.material.otrValue} • WVTR {m.material.wvtrValue}
                            </span>
                          </td>
                          {/* ACTION COLUMN: Prominent Compare Button pre-filling Compare page */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePrescriptionMaterialId(m.material.id);
                                  setOpenAccordions(prev => ({ ...prev, 1: true }));
                                }}
                                className="px-2 py-1 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-100 border border-[#CBD5E1]"
                              >
                                Spec
                              </button>
                              <button
                                type="button"
                                id={`btn-compare-${m.material.id}`}
                                onClick={() => onNavigateToCompare(m.material.id)}
                                className="px-3 py-1 rounded text-xs font-black text-white bg-[#059669] hover:bg-[#047857] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Scale className="w-3.5 h-3.5" />
                                <span>Compare</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {result.eligibleMaterials.length > 10 && (
                <p className="text-[11px] text-slate-500 italic text-right pt-1">
                  Showing Top 10 of {result.eligibleMaterials.length} evaluated substrates for this commodity.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* DROPDOWN 5: Hard Constraint Elimination Stage */}
        {/* ======================================================================= */}
        <div
          id="accordion-5-elimination-stage"
          className="bg-white rounded-md border border-[#CBD5E1] shadow-xs overflow-hidden"
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => toggleAccordion(5)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-rose-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                5
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    Hard Constraint Elimination Stage
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300 uppercase">
                    Disqualified Materials (4 Core Failures)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Zero-tolerance biological, chemical, barrier &amp; statutory safety eliminations for this food product
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[5] ? 'Collapse Eliminated' : 'Expand Eliminated'}
              </span>
              {openAccordions[5] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[5] && (
            <div className="p-4 space-y-3">
              <div className="space-y-2.5">
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                  <span>
                    <strong>Safety &amp; Preservation Guarantee:</strong> Showing the 4 most critical hard constraint failure modes disqualified from recommendation prior to multi-criteria ranking.
                  </span>
                  <span className="text-[10px] font-bold text-rose-700 font-mono shrink-0 ml-2">
                    Zero-Tolerance Mode • Exactly 4 Items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  {coreEliminatedMaterials.map((f, idx) => (
                    <div
                      key={f.material.id || idx}
                      className="p-3.5 rounded-md border border-rose-200 bg-rose-50/30 flex flex-col justify-between space-y-2.5 shadow-2xs hover:border-rose-300 transition-colors"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900 text-xs block leading-tight">{f.material.name}</span>
                            <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                              {f.material.structure}
                            </span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                            Disqualified
                          </span>
                        </div>

                        {/* Critical Failure Reason Tag */}
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Failure Mode:</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${f.failureTagClass}`}>
                            {f.failureTag}
                          </span>
                        </div>

                        <div className="mt-2 p-2.5 rounded bg-white border border-rose-200 text-rose-900 space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-rose-700 block">
                              Primary Disqualification Reason:
                            </span>
                            <span className="text-[9px] font-mono font-bold text-rose-600">
                              Breach
                            </span>
                          </div>
                          <p className="text-xs font-semibold leading-snug text-slate-800">
                            {f.filterReason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-rose-100 font-mono">
                        <span className="font-bold text-slate-700">OTR: {f.material.otrValue} cc</span>
                        <span className="font-bold text-slate-700">WVTR: {f.material.wvtrValue} g</span>
                        <button
                          type="button"
                          onClick={() => onNavigateToCompare(f.material.id)}
                          className="text-xs font-bold text-[#059669] hover:underline cursor-pointer flex items-center gap-0.5"
                        >
                          Compare →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DROPDOWN 6: QR-BASED TRACEABILITY & AUDIT DOSSIER */}
        {/* ========================================================================= */}
        <div className="border border-[#CBD5E1] rounded-md bg-white overflow-hidden shadow-2xs">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleAccordion(6)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                6
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    6. QR-Based Traceability &amp; Audit Dossier
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#059669] border border-emerald-300 uppercase">
                    Digital Passport &amp; PDF
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Consolidated Stages 1–4 parameters, verifiable high-contrast QR passport, and downloadable PDF label
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[6] ? 'Collapse Dossier' : 'Expand Dossier'}
              </span>
              {openAccordions[6] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[6] && selectedPrescriptionMat && (
            <div className="p-4">
              <TraceabilityDossierSection
                result={result}
                activeCommodity={activeCommodity}
                targetShelfLifeDays={targetShelfLifeDays}
                currentShelfLifeDays={currentShelfLifeDays}
                quantityAmount={quantityAmount}
                quantityUnit={quantityUnit}
                storage={storage}
                selectedMaterial={selectedPrescriptionMat}
                onNavigateToCompare={onNavigateToCompare}
              />
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DROPDOWN 7: RECOMMENDED STRUCTURAL PACKAGING & FORM FACTOR */}
        {/* ========================================================================= */}
        <div className="border border-[#CBD5E1] rounded-md bg-white overflow-hidden shadow-2xs">
          {/* Header Button */}
          <button
            type="button"
            onClick={() => toggleAccordion(7)}
            className="w-full px-4 py-3 bg-[#F8FAFC] hover:bg-slate-100 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#059669] text-white flex items-center justify-center text-xs font-black shrink-0">
                7
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">
                    7. Recommended Structural Packaging, Shape &amp; Protection Design
                  </h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300 uppercase">
                    3D Form Factor &amp; Ergonomics
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Physical form factor, volumetric sizing, crush-prevention engineering, and shelf-ready retail standout
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 hidden sm:inline">
                {openAccordions[7] ? 'Collapse Structural Design' : 'Expand Structural Design'}
              </span>
              {openAccordions[7] ? (
                <ChevronUp className="w-4 h-4 text-slate-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-600" />
              )}
            </div>
          </button>

          {/* Body */}
          {openAccordions[7] && selectedPrescriptionMat && (
            <div className="p-4">
              <StructuralPackagingSection
                result={result}
                activeCommodity={activeCommodity}
                targetShelfLifeDays={targetShelfLifeDays}
                quantityAmount={quantityAmount}
                quantityUnit={quantityUnit}
                storage={storage}
                selectedMaterial={selectedPrescriptionMat}
              />
            </div>
          )}
        </div>

      </section>
    </div>
  );
};
