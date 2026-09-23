import React, { useState, useMemo, useRef } from 'react';
import {
  FoodCommodity,
  StorageInput,
  TransportInput,
  UserPreferences,
  ScoredMaterial,
  ProductInput,
  StorageMode,
  SensitivityLevel
} from '../types';
import { FOOD_COMMODITIES } from '../data/foodCommodities';
import { runRecommendationPipeline } from '../services/recommendationEngine';
import { RequirementCards } from './RequirementCards';
import { RecommendationsResultsSection } from './RecommendationsResultsSection';
import { ExplainableSection } from './ExplainableSection';
import { ConfidenceStatusBanner } from './ConfidenceStatusBanner';
import { ReportSummaryModal } from './ReportSummaryModal';
import {
  Thermometer,
  Droplets,
  Calendar,
  Building2,
  Truck,
  ShieldAlert,
  Flame,
  CloudRain,
  DollarSign,
  Leaf,
  FileText,
  RotateCcw,
  Check,
  Activity,
  Layers,
  Sparkles,
  Info,
  Clock,
  Package,
  Snowflake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Scale,
  PlusCircle,
  Edit3,
  Sliders,
  FlaskConical,
  Beaker
} from 'lucide-react';

interface RecommendationWorkflowProps {
  initialFoodId?: string;
  onNavigateToCompare: (materialId: string) => void;
}

type WizardStep = 1 | 2 | 3 | 4;

// 5 Core Pre-Loaded Commodities as strictly required
const CORE_PRELOADED_COMMODITY_IDS = [
  'potato-chips',
  'milk-powder',
  'fresh-vegetables',
  'wheat-flour',
  'spices'
];

export const RecommendationWorkflow: React.FC<RecommendationWorkflowProps> = ({
  initialFoodId,
  onNavigateToCompare
}) => {
  // Wizard State Machine: Steps 1, 2, 3, 4, and Final Results View
  const [activeStep, setActiveStep] = useState<WizardStep>(1);
  const [isResultsView, setIsResultsView] = useState<boolean>(false);
  const recommendationsHeaderRef = useRef<HTMLDivElement>(null);

  // Commodity Mode: Preloaded or Custom
  const isInitialCustom = initialFoodId === 'custom';
  const [isCustomCommodity, setIsCustomCommodity] = useState<boolean>(isInitialCustom);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(
    initialFoodId && initialFoodId !== 'custom' ? initialFoodId : 'potato-chips'
  );

  // Custom Commodity Metadata
  const [customName, setCustomName] = useState<string>('Custom Food Product');
  const [customCategory, setCustomCategory] = useState<string>('Specialty Packaged Food');

  // Initial reference commodity for default baseline
  const initialBaseFood = useMemo(() => {
    return FOOD_COMMODITIES.find(f => f.id === selectedFoodId) || FOOD_COMMODITIES[0];
  }, [selectedFoodId]);

  // =========================================================================
  // ALWAYS-VISIBLE, FULLY SYNCHRONIZED & EDITABLE PARAMETERS (STAGE 1)
  // =========================================================================
  
  // 1. Physicochemical Parameters (Always editable for both preloaded & custom)
  const [moistureLevel, setMoistureLevel] = useState<SensitivityLevel>(
    initialBaseFood.profile.moistureLevel
  );
  const [moisturePercentage, setMoisturePercentage] = useState<string>(
    initialBaseFood.profile.moisturePercentage
  );
  const [oxygenSensitivity, setOxygenSensitivity] = useState<SensitivityLevel>(
    initialBaseFood.profile.oxygenSensitivity
  );
  const [fatLevel, setFatLevel] = useState<SensitivityLevel>(
    initialBaseFood.profile.fatLevel
  );
  const [phValue, setPhValue] = useState<'Low (pH > 5.5)' | 'Medium (pH 4.5 - 5.5)' | 'High (pH < 4.5)'>(
    initialBaseFood.profile.acidity
  );
  const [isFreshProduce, setIsFreshProduce] = useState<boolean>(
    initialBaseFood.profile.isFreshProduce
  );

  // 2. Batch & Shelf Life Parameters (Always editable & integrated)
  const [targetShelfLifeDays, setTargetShelfLifeDays] = useState<number>(
    initialBaseFood.recommendedShelfLifeDays || 180
  );
  const [currentShelfLifeDays, setCurrentShelfLifeDays] = useState<number>(
    Math.round((initialBaseFood.recommendedShelfLifeDays || 180) * 0.4)
  );
  const [quantityAmount, setQuantityAmount] = useState<number>(
    initialBaseFood.profile.defaultQuantity.amount || 100
  );
  const [quantityUnit, setQuantityUnit] = useState<ProductInput['quantityUnit']>(
    initialBaseFood.profile.defaultQuantity.unit || 'g'
  );

  // 3. Storage Boundary Conditions (Stage 1 & 2 Sync)
  const [storageMode, setStorageMode] = useState<StorageMode>(
    initialBaseFood.profile.isFreshProduce ? 'Chilled' : 'Ambient'
  );
  const [storageTemp, setStorageTemp] = useState<number>(
    initialBaseFood.recommendedStorageTemp || 22
  );
  const [storageRH, setStorageRH] = useState<number>(
    initialBaseFood.recommendedStorageRH || 50
  );
  const [facilityType, setFacilityType] = useState<StorageInput['environmentType']>('Indoor Ambient');

  // 4. Logistics & Transportation State (Stage 3)
  const [transitDays, setTransitDays] = useState<number>(3);
  const [transitDistanceKm, setTransitDistanceKm] = useState<number>(450);
  const [vehicleType, setVehicleType] = useState<string>('Covered Commercial Truck');
  const [handling, setHandling] = useState<TransportInput['handling']>('Standard Commercial');
  const [heatExposure, setHeatExposure] = useState<TransportInput['heatExposure']>('Moderate');
  const [moistureExposure, setMoistureExposure] = useState<TransportInput['moistureExposure']>('Moderate');

  // 5. User Decision Priorities (Stage 4)
  const [costPriority, setCostPriority] = useState<UserPreferences['costPriority']>('Medium');
  const [sustainabilityPriority, setSustainabilityPriority] = useState<UserPreferences['sustainabilityPriority']>('Medium');
  const [protectionPriority, setProtectionPriority] = useState<UserPreferences['protectionPriority']>('High');
  const [availabilityPriority, setAvailabilityPriority] = useState<UserPreferences['availabilityPriority']>('Medium');

  // 6. Selected breakdown material for Explainable AI
  const [activeBreakdownMaterial, setActiveBreakdownMaterial] = useState<ScoredMaterial | null>(null);

  // 7. Report Summary Modal
  const [showReportModal, setShowReportModal] = useState(false);

  // =========================================================================
  // CLEAN DATA SYNCHRONIZATION: Preloaded Commodity Selection Handler
  // Automatically populates all Physicochemical, Batch, and Shelf-Life inputs
  // with calibrated baseline values, while keeping them 100% editable.
  // =========================================================================
  const handleFoodSelect = (food: FoodCommodity) => {
    setIsCustomCommodity(false);
    setSelectedFoodId(food.id);

    // Sync Physicochemical Baseline
    setMoistureLevel(food.profile.moistureLevel);
    setMoisturePercentage(food.profile.moisturePercentage);
    setOxygenSensitivity(food.profile.oxygenSensitivity);
    setFatLevel(food.profile.fatLevel);
    setPhValue(food.profile.acidity);
    setIsFreshProduce(food.profile.isFreshProduce);

    // Sync Batch & Shelf-Life Baseline
    setTargetShelfLifeDays(food.recommendedShelfLifeDays);
    setCurrentShelfLifeDays(Math.max(1, Math.round(food.recommendedShelfLifeDays * 0.4)));
    setQuantityAmount(food.profile.defaultQuantity.amount);
    setQuantityUnit(food.profile.defaultQuantity.unit);

    // Sync Storage Conditions Baseline
    setStorageTemp(food.recommendedStorageTemp);
    setStorageRH(food.recommendedStorageRH);
    setStorageMode(food.profile.isFreshProduce ? 'Chilled' : 'Ambient');

    setActiveBreakdownMaterial(null);
  };

  const handleSelectCustomCommodity = () => {
    setIsCustomCommodity(true);
    setSelectedFoodId('custom-commodity');
    setActiveBreakdownMaterial(null);
  };

  // Construct Dynamic Commodity Object with Live Parameter Overrides
  const activeCommodity: FoodCommodity = useMemo(() => {
    const baseFood = isCustomCommodity
      ? null
      : (FOOD_COMMODITIES.find(f => f.id === selectedFoodId) || FOOD_COMMODITIES[0]);

    const name = isCustomCommodity
      ? (customName.trim() || 'Custom Food Matrix')
      : (baseFood?.name || 'Selected Food Product');

    const category = isCustomCommodity
      ? customCategory
      : (baseFood?.category || 'Specialty Packaged Commodity');

    const description = isCustomCommodity
      ? `User-defined formulation "${name}". Physicochemical profile: ${moistureLevel} moisture (${moisturePercentage}), ${fatLevel} lipids, ${oxygenSensitivity} O₂ sensitivity, ${phValue}.`
      : (baseFood?.description || '');

    return {
      id: isCustomCommodity ? 'custom-commodity' : (baseFood?.id || 'custom'),
      name,
      category,
      description,
      recommendedStorageTemp: storageTemp,
      recommendedStorageRH: storageRH,
      recommendedShelfLifeDays: targetShelfLifeDays,
      profile: {
        moistureLevel,
        moisturePercentage,
        fatLevel,
        acidity: phValue,
        oxygenSensitivity,
        moistureSensitivity: moistureLevel === 'Low' ? 'High' : 'Medium',
        lightSensitivity: fatLevel === 'High' ? 'High' : 'Medium',
        temperatureSensitivity: isFreshProduce ? 'High' : 'Medium',
        transportationSensitivity: 'Medium',
        typicalStorageCondition: isFreshProduce
          ? 'Cold chain distribution (8-12°C) with breathable / micro-perforated packaging'
          : 'Cool, dry ambient storage away from direct sunlight',
        primaryDeteriorationMode: isFreshProduce
          ? 'Desiccation, anaerobic fermentation, and respiratory decay if gas balance is blocked.'
          : fatLevel === 'High'
          ? 'Lipid oxidation yielding hexanal off-flavors and loss of textural crispness.'
          : 'Moisture absorption and atmospheric staleness.',
        isFreshProduce,
        respirationCategory: isFreshProduce ? 'Moderate' : 'None',
        respirationRateRange: isFreshProduce ? '15 - 25 mg CO2/kg·h @ 10°C' : 'None (Non-respiring processed food)',
        targetGasEnvironment: isFreshProduce
          ? { o2Percent: '3% - 5%', co2Percent: '3% - 6%', n2Percent: 'Balance' }
          : { o2Percent: '< 1.5%', co2Percent: '0%', n2Percent: '> 98.5%' },
        prototypeBasis: 'PROTOTYPE_SYNTHETIC',
        defaultIngredients: baseFood?.profile.defaultIngredients || 'Custom food recipe & formulation',
        defaultQuantity: {
          amount: quantityAmount,
          unit: quantityUnit
        }
      }
    };
  }, [
    isCustomCommodity,
    customName,
    customCategory,
    selectedFoodId,
    storageTemp,
    storageRH,
    targetShelfLifeDays,
    moistureLevel,
    moisturePercentage,
    fatLevel,
    phValue,
    oxygenSensitivity,
    isFreshProduce,
    quantityAmount,
    quantityUnit
  ]);

  // Compile inputs for Recommendation Pipeline
  const productInput: ProductInput = useMemo(() => ({
    foodId: activeCommodity.id,
    quantityAmount,
    quantityUnit,
    ingredients: activeCommodity.profile.defaultIngredients,
    moistureKnown: true,
    moisturePercentage: moisturePercentage,
    fatKnown: true,
    fatPercentage: fatLevel,
    phKnown: true,
    phValue: phValue,
    respirationRateKnown: true,
    currentShelfLifeDays,
    targetShelfLifeDays
  }), [
    activeCommodity.id,
    activeCommodity.profile.defaultIngredients,
    quantityAmount,
    quantityUnit,
    moisturePercentage,
    fatLevel,
    phValue,
    currentShelfLifeDays,
    targetShelfLifeDays
  ]);

  const storage: StorageInput = useMemo(() => ({
    temperatureC: storageMode === 'Frozen' ? -18 : storageMode === 'Chilled' ? 4 : storageTemp,
    relativeHumidityPercent: storageRH,
    storageDurationDays: targetShelfLifeDays,
    storageMode,
    environmentType: facilityType
  }), [storageMode, storageTemp, storageRH, targetShelfLifeDays, facilityType]);

  const transport: TransportInput = useMemo(() => ({
    durationDays: transitDays,
    distanceKm: transitDistanceKm,
    vehicleType,
    handling,
    heatExposure: storageMode === 'Ambient' ? heatExposure : 'Low',
    moistureExposure
  }), [transitDays, transitDistanceKm, vehicleType, handling, storageMode, heatExposure, moistureExposure]);

  const preferences: UserPreferences = useMemo(() => ({
    costPriority,
    sustainabilityPriority,
    protectionPriority,
    availabilityPriority
  }), [costPriority, sustainabilityPriority, protectionPriority, availabilityPriority]);

  // Run Recommendation Pipeline
  const recommendationResult = useMemo(() => {
    return runRecommendationPipeline(activeCommodity, productInput, storage, transport, preferences);
  }, [activeCommodity, productInput, storage, transport, preferences]);

  // Current material for Explainable AI breakdown
  const currentBreakdown = activeBreakdownMaterial || recommendationResult.topRecommendations.bestOverall;

  const handleResetToFoodDefaults = () => {
    if (isCustomCommodity) {
      handleSelectCustomCommodity();
    } else {
      const food = FOOD_COMMODITIES.find(f => f.id === selectedFoodId) || FOOD_COMMODITIES[0];
      handleFoodSelect(food);
    }
    setStorageMode('Ambient');
    setFacilityType('Indoor Ambient');
    setTransitDays(3);
    setTransitDistanceKm(450);
    setVehicleType('Covered Commercial Truck');
    setHandling('Standard Commercial');
    setHeatExposure('Moderate');
    setMoistureExposure('Moderate');
    setCostPriority('Medium');
    setSustainabilityPriority('Medium');
    setProtectionPriority('High');
    setAvailabilityPriority('Medium');
    setIsResultsView(false);
    setActiveStep(1);
  };

  const applyStoragePreset = (mode: StorageMode, temp: number, rh: number) => {
    setStorageMode(mode);
    setStorageTemp(temp);
    setStorageRH(rh);
  };

  // Pre-loaded core commodities (5 tiles)
  const preloadedCommodities = FOOD_COMMODITIES.filter(f =>
    CORE_PRELOADED_COMMODITY_IDS.includes(f.id)
  );

  const steps = [
    { num: 1 as WizardStep, title: 'Product Profile', subtitle: 'Physicochemical & batch specs' },
    { num: 2 as WizardStep, title: 'Storage Conditions', subtitle: 'Ambient, cold chain & RH' },
    { num: 3 as WizardStep, title: 'Logistics & Handling', subtitle: 'Transit stress & distance' },
    { num: 4 as WizardStep, title: 'Decision Priorities', subtitle: 'Cost vs eco vs barrier strictness' }
  ];

  return (
    <div className="space-y-3 pb-12 w-full">
      {/* 1. ENGINEERING WIZARD TOP CONTROLS */}
      <div className="bg-white rounded-md border border-[#CBD5E1] p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-[#059669] border border-emerald-300">
              Deterministic Wizard
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Active Commodity: <strong className="text-slate-900">{activeCommodity.name}</strong>
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Multi-Criteria Packaging Recommendation Wizard
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetToFoodDefaults}
            className="px-3 py-1.5 rounded text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-[#CBD5E1] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Wizard</span>
          </button>
          {isResultsView && (
            <button
              type="button"
              id="btn-generate-report"
              onClick={() => setShowReportModal(true)}
              className="px-3.5 py-1.5 rounded text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-200" />
              <span>Export Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SEQUENTIAL STEPPER BAR (Always Visible Progress Across Stages 1, 2, 3, 4) */}
      <div className="bg-white rounded-md border border-[#CBD5E1] p-2 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {steps.map(s => {
            const isStepActive = !isResultsView && activeStep === s.num;
            const isStepCompleted = isResultsView || activeStep > s.num;

            return (
              <button
                key={s.num}
                type="button"
                id={`wizard-stepper-btn-${s.num}`}
                onClick={() => {
                  setActiveStep(s.num);
                  setIsResultsView(false);
                }}
                className={`p-2 rounded text-left transition-all flex items-center gap-2.5 cursor-pointer border ${
                  isStepActive
                    ? 'bg-[#059669] text-white border-[#047857] shadow-xs'
                    : isStepCompleted
                    ? 'bg-emerald-50 text-slate-900 border-emerald-300 hover:bg-emerald-100/70'
                    : 'bg-[#F8FAFC] text-slate-600 border-[#CBD5E1] hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center shrink-0 ${
                    isStepActive
                      ? 'bg-white text-[#059669]'
                      : isStepCompleted
                      ? 'bg-[#059669] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isStepCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                </div>
                <div className="min-w-0">
                  <span className={`block text-xs font-bold truncate ${isStepActive ? 'text-white' : 'text-slate-900'}`}>
                    {s.title}
                  </span>
                  <span className={`block text-[10px] truncate ${isStepActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {s.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. STEPPER VIEW FORM CONTAINERS (Stages 1 to 4) */}
      {!isResultsView && (
        <div className="bg-white rounded-md border border-[#CBD5E1] p-3.5 sm:p-4 shadow-xs space-y-4">
          
          {/* ========================================================================= */}
          {/* STAGE 1: PRODUCT PROFILE & COMMODITY SELECTION */}
          {/* ========================================================================= */}
          {activeStep === 1 && (
            <div className="space-y-4">
              
              {/* TOP SECTION: COMMODITY SELECTION (5 Preloaded Tiles + Interactive Custom Option) */}
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#059669] text-white flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Commodity Selection &amp; Formulation</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Select a baseline commodity or define a custom food matrix
                  </span>
                </div>

                {/* 5 Core Pre-loaded Commodity Tiles + 1 Custom Card */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-2.5">
                  {preloadedCommodities.map(food => {
                    const isSelected = !isCustomCommodity && food.id === selectedFoodId;
                    return (
                      <button
                        key={food.id}
                        type="button"
                        id={`btn-select-food-${food.id}`}
                        onClick={() => handleFoodSelect(food)}
                        className={`p-2 rounded-md text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-[#059669] ring-2 ring-[#059669] shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#059669]' : 'text-slate-900'}`}>
                            {food.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-0.5 truncate">
                          {food.category}
                        </span>
                      </button>
                    );
                  })}

                  {/* INTERACTIVE CUSTOM COMMODITY CARD */}
                  <button
                    type="button"
                    id="btn-select-custom-commodity"
                    onClick={handleSelectCustomCommodity}
                    className={`p-2 rounded-md text-left border transition-all cursor-pointer ${
                      isCustomCommodity
                        ? 'bg-emerald-50 border-[#059669] ring-2 ring-[#059669] shadow-xs'
                        : 'bg-[#F8FAFC] hover:bg-emerald-50/50 border-dashed border-[#059669]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-[#059669] flex items-center gap-1">
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Custom</span>
                      </span>
                      {isCustomCommodity && <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
                    </div>
                    <span className="block text-[10px] text-slate-600 font-medium mt-0.5 truncate">
                      Enter New Commodity
                    </span>
                  </button>
                </div>

                {/* Sub-bar for Custom Commodity Name if Custom is selected */}
                {isCustomCommodity ? (
                  <div className="mt-2.5 p-2 rounded bg-emerald-50 border border-emerald-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F172A] shrink-0">
                      <Edit3 className="w-4 h-4 text-[#059669]" />
                      <span>Custom Commodity Name:</span>
                    </div>
                    <input
                      type="text"
                      id="input-custom-commodity-name"
                      value={customName}
                      onChange={e => setCustomName(e.target.value)}
                      placeholder="e.g. Artisan Dark Chocolate / Fresh Paneer"
                      className="flex-1 px-2.5 py-1 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#059669]"
                    />
                    <input
                      type="text"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      placeholder="Category (e.g. Specialty Dairy)"
                      className="w-full sm:w-48 px-2.5 py-1 rounded border border-[#CBD5E1] bg-white text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#059669]"
                    />
                  </div>
                ) : (
                  <div className="mt-2 px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span className="truncate">
                      Baseline loaded: <strong>{activeCommodity.name}</strong> ({activeCommodity.category}). All physicochemical &amp; batch values below are fully editable.
                    </span>
                    <span className="text-[10px] font-mono text-[#059669] font-bold shrink-0 ml-2">
                      Live Parameter Engine
                    </span>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* ALWAYS-VISIBLE PHYSICOCHEMICAL & BATCH / SHELF LIFE PARAMETERS PANEL */}
              {/* ALWAYS renders regardless of preloaded or custom selection! */}
              {/* ========================================================================= */}
              <div className="border border-[#CBD5E1] rounded-md bg-[#F8FAFC] p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#059669]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Physicochemical Specifications &amp; Batch / Shelf-Life Parameters
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Auto-Synchronized &amp; Editable
                  </span>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                  
                  {/* COLUMN 1: PHYSICOCHEMICAL PROPERTIES */}
                  <div className="bg-white p-3 rounded border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Beaker className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Physicochemical Matrix &amp; Sensitivities</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Chemical Stability</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Moisture Content (%) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Moisture Content (%)
                          </label>
                          <span className="text-[10px] font-mono text-slate-500">{moisturePercentage}</span>
                        </div>
                        <div className="flex gap-2">
                          <select
                            value={moistureLevel}
                            onChange={e => {
                              const val = e.target.value as SensitivityLevel;
                              setMoistureLevel(val);
                              if (val === 'Low') setMoisturePercentage('1.5% - 4.0%');
                              else if (val === 'Medium') setMoisturePercentage('10.0% - 15.0%');
                              else setMoisturePercentage('65% - 90%');
                            }}
                            className="w-1/2 px-2 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                          >
                            <option value="Low">Low (&lt; 5% w/w)</option>
                            <option value="Medium">Medium (5% - 20%)</option>
                            <option value="High">High (&gt; 20%)</option>
                          </select>
                          <input
                            type="text"
                            value={moisturePercentage}
                            onChange={e => setMoisturePercentage(e.target.value)}
                            placeholder="e.g. 2.0% - 3.5%"
                            className="w-1/2 px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Oxygen Sensitivity */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Oxygen Sensitivity (Oxidative Spoilage)
                        </label>
                        <select
                          value={oxygenSensitivity}
                          onChange={e => setOxygenSensitivity(e.target.value as SensitivityLevel)}
                          className="w-full px-2 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                        >
                          <option value="High">High (Rapid lipid rancidity / hexanal formation)</option>
                          <option value="Medium">Medium (Gradual oxidative loss)</option>
                          <option value="Low">Low (Inert dry food)</option>
                        </select>
                      </div>

                      {/* Fat / Lipid Content (%) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Fat / Lipid Content (%)
                        </label>
                        <select
                          value={fatLevel}
                          onChange={e => setFatLevel(e.target.value as SensitivityLevel)}
                          className="w-full px-2 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                        >
                          <option value="High">High (&gt; 20% w/w - Vulnerable to rancidity)</option>
                          <option value="Medium">Medium (5% - 20% w/w)</option>
                          <option value="Low">Low / Lean (&lt; 5% w/w)</option>
                        </select>
                      </div>

                      {/* pH Classification */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          pH / Acidity Classification
                        </label>
                        <select
                          value={phValue}
                          onChange={e => setPhValue(e.target.value as any)}
                          className="w-full px-2 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                        >
                          <option value="Low (pH > 5.5)">Low Acid (pH &gt; 5.5 - C. botulinum risk)</option>
                          <option value="Medium (pH 4.5 - 5.5)">Medium Acid (pH 4.5 - 5.5)</option>
                          <option value="High (pH < 4.5)">High Acid (pH &lt; 4.5 - Citrus/Tomato)</option>
                        </select>
                      </div>

                      {/* Biological Metabolism (Respiration) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Biological Metabolism (Produce Respiration)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsFreshProduce(false);
                              setStorageMode('Ambient');
                            }}
                            className={`py-1.5 px-2 rounded border text-xs font-bold cursor-pointer transition-colors ${
                              !isFreshProduce
                                ? 'bg-[#059669] text-white border-[#047857]'
                                : 'bg-white text-slate-700 border-[#CBD5E1]'
                            }`}
                          >
                            Processed Dry Food
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsFreshProduce(true);
                              setStorageMode('Chilled');
                            }}
                            className={`py-1.5 px-2 rounded border text-xs font-bold cursor-pointer transition-colors ${
                              isFreshProduce
                                ? 'bg-[#059669] text-white border-[#047857]'
                                : 'bg-white text-slate-700 border-[#CBD5E1]'
                            }`}
                          >
                            Fresh Produce (Respiring)
                          </button>
                        </div>
                        {isFreshProduce && (
                          <p className="text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded border border-emerald-200 mt-1.5 leading-tight">
                            ⚠️ Active produce respiration: hermetic foil laminates are eliminated to prevent tissue anaerobiosis and alcoholic fermentation.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: BATCH, STORAGE BASELINE & SHELF LIFE */}
                  <div className="bg-white p-3 rounded border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Batch, Shelf Life &amp; Storage Regimes</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Commercial Target</span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Target Shelf Life (Days) with Dual Input + Slider */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Target Shelf Life (Days)
                          </label>
                          <div className="flex items-center gap-1 font-mono">
                            <input
                              type="number"
                              min={1}
                              max={730}
                              value={targetShelfLifeDays}
                              onChange={e => setTargetShelfLifeDays(Math.max(1, Number(e.target.value)))}
                              className="w-16 px-1.5 py-0.5 text-right font-black text-xs border border-[#CBD5E1] rounded text-[#059669]"
                            />
                            <span className="text-slate-500 font-semibold">days</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={7}
                          max={730}
                          step={1}
                          value={targetShelfLifeDays}
                          onChange={e => setTargetShelfLifeDays(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#059669]"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>7d</span>
                          <span>90d</span>
                          <span>180d (Default)</span>
                          <span>365d</span>
                          <span>730d</span>
                        </div>
                      </div>

                      {/* Batch Size / Net Quantity */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Batch Size / Unit Quantity
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={1}
                            max={10000}
                            value={quantityAmount}
                            onChange={e => setQuantityAmount(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#059669]"
                          />
                          <select
                            value={quantityUnit}
                            onChange={e => setQuantityUnit(e.target.value as any)}
                            className="px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-slate-50 text-xs font-bold text-slate-800"
                          >
                            <option value="g">grams (g)</option>
                            <option value="kg">kilograms (kg)</option>
                            <option value="ml">milliliters (ml)</option>
                            <option value="L">liters (L)</option>
                          </select>
                        </div>
                      </div>

                      {/* Baseline Unpackaged Shelf Life */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Baseline Unpackaged Shelf Life (Pre-pack)
                          </label>
                          <span className="text-[10px] font-mono text-slate-500">Days to spoil</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            max={365}
                            value={currentShelfLifeDays}
                            onChange={e => setCurrentShelfLifeDays(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                          />
                          <span className="text-xs text-slate-500 shrink-0 font-medium">days</span>
                        </div>
                      </div>

                      {/* Target Storage Temp (°C) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Target Storage Temp (°C)
                          </label>
                          <span className="text-[10px] font-mono font-bold text-[#059669]">{storageTemp}°C</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="number"
                            min={-25}
                            max={60}
                            value={storageTemp}
                            onChange={e => setStorageTemp(Number(e.target.value))}
                            className="w-24 px-2 py-1 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                          />
                          <div className="flex-1 flex gap-1">
                            <button
                              type="button"
                              onClick={() => { setStorageTemp(22); setStorageMode('Ambient'); }}
                              className={`flex-1 py-1 text-[10px] font-bold rounded border ${storageTemp === 22 ? 'bg-[#059669] text-white border-[#047857]' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                              22°C Ambient
                            </button>
                            <button
                              type="button"
                              onClick={() => { setStorageTemp(4); setStorageMode('Chilled'); }}
                              className={`flex-1 py-1 text-[10px] font-bold rounded border ${storageTemp === 4 ? 'bg-[#059669] text-white border-[#047857]' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                              4°C Cold
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Target Ambient RH (%) */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Ambient Relative Humidity (% RH)
                          </label>
                          <span className="text-[10px] font-mono font-bold text-blue-700">{storageRH}% RH</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                          <input
                            type="range"
                            min={15}
                            max={95}
                            value={storageRH}
                            onChange={e => setStorageRH(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <input
                            type="number"
                            min={10}
                            max={100}
                            value={storageRH}
                            onChange={e => setStorageRH(Math.min(100, Math.max(10, Number(e.target.value))))}
                            className="w-14 px-1.5 py-0.5 text-right font-mono font-bold text-xs border border-[#CBD5E1] rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* NAVIGATION FOOTER FOR STAGE 1 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">
                  Stage 1 of 4: Product Profile &amp; Specifications
                </span>
                <button
                  type="button"
                  id="btn-stage1-next"
                  onClick={() => {
                    setActiveStep(2);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-5 py-2 rounded-md text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Next: Storage Conditions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: STORAGE ENVIRONMENT */}
          {/* ========================================================================= */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#059669] text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Storage Conditions &amp; Facility Regimes</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Environmental Boundary Inputs</span>
              </div>

              {/* Presets Bar */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  Quick Storage Presets
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => applyStoragePreset('Ambient', 25, 60)}
                    className={`p-2 rounded-md border text-left cursor-pointer transition-colors ${
                      storageMode === 'Ambient' && storageTemp === 25
                        ? 'bg-emerald-50 border-[#059669] ring-1 ring-[#059669]'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">Ambient Standard</span>
                    <span className="text-[11px] text-slate-500 font-mono">25°C • 60% RH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyStoragePreset('Chilled', 4, 85)}
                    className={`p-2 rounded-md border text-left cursor-pointer transition-colors ${
                      storageMode === 'Chilled'
                        ? 'bg-emerald-50 border-[#059669] ring-1 ring-[#059669]'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">Cold Chain</span>
                    <span className="text-[11px] text-slate-500 font-mono">4°C • 85% RH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyStoragePreset('Frozen', -18, 90)}
                    className={`p-2 rounded-md border text-left cursor-pointer transition-colors ${
                      storageMode === 'Frozen'
                        ? 'bg-emerald-50 border-[#059669] ring-1 ring-[#059669]'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">Deep Frozen</span>
                    <span className="text-[11px] text-slate-500 font-mono">-18°C • 90% RH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyStoragePreset('Ambient', 38, 85)}
                    className={`p-2 rounded-md border text-left cursor-pointer transition-colors ${
                      storageMode === 'Ambient' && storageTemp === 38
                        ? 'bg-amber-50 border-amber-600 ring-1 ring-amber-600'
                        : 'bg-[#F8FAFC] border-[#CBD5E1] hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-amber-900 block">Hot Tropical Stress</span>
                    <span className="text-[11px] text-amber-700 font-mono">38°C • 85% RH</span>
                  </button>
                </div>
              </div>

              {/* Specific Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Storage Temperature (°C)
                  </label>
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={storageTemp}
                      onChange={e => setStorageTemp(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                    />
                    <span className="text-xs text-slate-500 font-mono">°C</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relative Humidity (% RH)
                  </label>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={storageRH}
                      onChange={e => setStorageRH(Math.min(100, Math.max(10, Number(e.target.value))))}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                    />
                    <span className="text-xs text-slate-500 font-mono">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Facility / Storage Regime
                  </label>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <select
                      value={facilityType}
                      onChange={e => setFacilityType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="Indoor Ambient">Indoor Ambient Warehouse</option>
                      <option value="Climate Controlled">Climate Controlled (HVAC)</option>
                      <option value="Cold Storage">Cold Storage Unit</option>
                      <option value="Open Air">Semi-open Canopy / High Exposure</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* NAVIGATION FOOTER FOR STAGE 2 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  id="btn-stage2-back"
                  onClick={() => {
                    setActiveStep(1);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Product Profile</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                    Stage 2 of 4: Storage Conditions
                  </span>
                  <button
                    type="button"
                    id="btn-stage2-next"
                    onClick={() => {
                      setActiveStep(3);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className="px-5 py-2 rounded-md text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Next: Logistics &amp; Handling</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: LOGISTICS & HANDLING */}
          {/* ========================================================================= */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#059669] text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Distribution Logistics &amp; Mechanical Stress</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Transit &amp; Environmental Exposure</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transit Duration (Days)
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={transitDays}
                      onChange={e => setTransitDays(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                    />
                    <span className="text-xs text-slate-500 font-mono">days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Transit Distance (km)
                  </label>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={10}
                      max={5000}
                      value={transitDistanceKm}
                      onChange={e => setTransitDistanceKm(Math.max(10, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] text-xs font-bold text-slate-900"
                    />
                    <span className="text-xs text-slate-500 font-mono">km</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Handling Rigor
                  </label>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <select
                      value={handling}
                      onChange={e => setHandling(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="Careful Palletized">Careful Palletized / Mechanized</option>
                      <option value="Standard Commercial">Standard Commercial Logistics</option>
                      <option value="Rough Manual">Rough Manual Multiple Transfer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Solar / Heat Exposure in Transit
                  </label>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-slate-400" />
                    <select
                      value={heatExposure}
                      onChange={e => setHeatExposure(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="Low">Low (Air-conditioned / refrigerated)</option>
                      <option value="Moderate">Moderate (Standard covered truck)</option>
                      <option value="High">High (Direct radiant tarp / open vehicle)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rain / Moisture Exposure
                  </label>
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-slate-400" />
                    <select
                      value={moistureExposure}
                      onChange={e => setMoistureExposure(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded border border-[#CBD5E1] bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="Low">Low (Waterproof sealed shipping container)</option>
                      <option value="Moderate">Moderate (Tarpaulin covered)</option>
                      <option value="High">High (Monsoon transit / open exposure)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* NAVIGATION FOOTER FOR STAGE 3 */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  id="btn-stage3-back"
                  onClick={() => {
                    setActiveStep(2);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Storage Conditions</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                    Stage 3 of 4: Logistics &amp; Handling
                  </span>
                  <button
                    type="button"
                    id="btn-stage3-next"
                    onClick={() => {
                      setActiveStep(4);
                      window.scrollTo({ top: 100, behavior: 'smooth' });
                    }}
                    className="px-5 py-2 rounded-md text-sm font-bold text-white bg-[#059669] hover:bg-[#047857] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Next: Decision Priorities</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: DECISION PRIORITIES */}
          {/* ========================================================================= */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-[#059669] text-white flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Decision Trade-offs &amp; Strategic Priorities</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-medium">Scoring Weights Calibration</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                {/* Cost Sensitivity */}
                <div className="p-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      <span>Cost Sensitivity</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">{costPriority}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Low', 'Medium', 'High'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCostPriority(p)}
                        className={`py-1 rounded text-xs font-bold cursor-pointer border ${
                          costPriority === p
                            ? 'bg-[#059669] text-white border-[#047857]'
                            : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Higher weight rewards lower cost-per-kg packaging substrates.
                  </p>
                </div>

                {/* Sustainability / EPR */}
                <div className="p-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Sustainability</span>
                    </span>
                    <span className="font-mono font-bold text-[#059669]">{sustainabilityPriority}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Low', 'Medium', 'High'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSustainabilityPriority(p)}
                        className={`py-1 rounded text-xs font-bold cursor-pointer border ${
                          sustainabilityPriority === p
                            ? 'bg-[#059669] text-white border-[#047857]'
                            : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Rewards mono-material polyolefins and high recyclability rates.
                  </p>
                </div>

                {/* Barrier Strictness */}
                <div className="p-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Barrier Protection</span>
                    </span>
                    <span className="font-mono font-bold text-blue-800">{protectionPriority}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Low', 'Medium', 'High'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setProtectionPriority(p)}
                        className={`py-1 rounded text-xs font-bold cursor-pointer border ${
                          protectionPriority === p
                            ? 'bg-blue-700 text-white border-blue-700'
                            : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Prioritizes ultra-low OTR &amp; WVTR transmission rates over cost.
                  </p>
                </div>

                {/* Converter Availability */}
                <div className="p-2.5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-slate-600" />
                      <span>Availability</span>
                    </span>
                    <span className="font-mono font-bold text-slate-800">{availabilityPriority}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['Low', 'Medium', 'High'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setAvailabilityPriority(p)}
                        className={`py-1 rounded text-xs font-bold cursor-pointer border ${
                          availabilityPriority === p
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Prioritizes ready commercial availability in Indian packaging hubs.
                  </p>
                </div>
              </div>

              {/* NAVIGATION FOOTER FOR STAGE 4 -> LAUNCH RECOMMENDATIONS */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  id="btn-stage4-back"
                  onClick={() => {
                    setActiveStep(3);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back: Logistics &amp; Handling</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                    Stage 4 of 4: Ready for Pipeline Execution
                  </span>
                  <button
                    type="button"
                    id="btn-view-recommendations"
                    onClick={() => {
                      setIsResultsView(true);
                      setTimeout(() => {
                        recommendationsHeaderRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }, 100);
                    }}
                    className="px-6 py-2 rounded-md text-sm font-black text-white bg-[#059669] hover:bg-[#047857] flex items-center gap-2 shadow-sm transition-all cursor-pointer transform active:scale-98"
                  >
                    <ArrowRight className="w-4 h-4 text-emerald-100" strokeWidth={1.5} />
                    <span>View Engineered Recommendations</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FINAL RECOMMENDATION RESULTS VIEW */}
      {/* (STRICTLY HIDDEN UNTIL STAGE 4 "VIEW RECOMMENDATIONS" IS CLICKED) */}
      {/* ========================================================================= */}
      {isResultsView && (
        <div id="recommendation-results-view" className="space-y-4">
          {/* Results Summary Header with Back Navigation */}
          <div className="bg-white rounded-md border border-[#CBD5E1] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#059669]">
                  Evaluation Completed • Final Dossier
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Grade: {recommendationResult.confidenceGrade} ({recommendationResult.confidenceScore}%)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                Packaging Recommendation Summary — {activeCommodity.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Batch: {quantityAmount} {quantityUnit} • Target Shelf Life: {targetShelfLifeDays} Days • Storage: {storageMode} ({storageTemp}°C / {storageRH}% RH) • Moisture: {moisturePercentage} • Fat: {fatLevel}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                id="btn-back-to-wizard"
                onClick={() => {
                  setIsResultsView(false);
                  setActiveStep(4);
                  window.scrollTo({ top: 100, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-[#CBD5E1] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit Parameters</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 rounded text-xs font-bold text-white bg-[#059669] hover:bg-[#047857] shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-200" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          {/* SECTION A: CONFIDENCE & CALIBRATION BANNER */}
          <section id="results-confidence-section">
            <ConfidenceStatusBanner
              confidenceGrade={recommendationResult.confidenceGrade}
              confidenceScore={recommendationResult.confidenceScore}
              confidenceReason={recommendationResult.confidenceReason}
              missingDataWarnings={recommendationResult.missingDataWarnings}
              systemWarnings={recommendationResult.warnings}
              prototypeStatusTags={recommendationResult.prototypeStatusTags}
            />
          </section>

          {/* SECTION B: DERIVED TARGET BARRIER REQUIREMENTS */}
          <section id="results-target-requirements">
            <RequirementCards requirements={recommendationResult.requirements} />
          </section>

          {/* SECTION C & ACCORDIONS: 4 HERO RECOMMENDATIONS + 5 STRUCTURED DROPDOWNS */}
          <section id="results-top-solutions">
            <RecommendationsResultsSection
              result={recommendationResult}
              activeCommodity={activeCommodity}
              targetShelfLifeDays={targetShelfLifeDays}
              currentShelfLifeDays={currentShelfLifeDays}
              quantityAmount={quantityAmount}
              quantityUnit={quantityUnit}
              storage={storage}
              onNavigateToCompare={onNavigateToCompare}
              onSelectForBreakdown={mat => setActiveBreakdownMaterial(mat)}
              resultsHeaderRef={recommendationsHeaderRef}
            />
          </section>

          {/* SECTION D: EXPLAINABLE AI AUDIT TRAIL */}
          {currentBreakdown && (
            <section id="results-explainable-section">
              <ExplainableSection
                material={currentBreakdown}
                requirements={recommendationResult.requirements}
              />
            </section>
          )}
        </div>
      )}

      {/* Summary Report Modal */}
      {showReportModal && (
        <ReportSummaryModal
          result={recommendationResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
