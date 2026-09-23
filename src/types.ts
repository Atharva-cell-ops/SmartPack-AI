export type SensitivityLevel = 'Low' | 'Medium' | 'High';
export type RequirementLevel = 'Required' | 'Preferred' | 'Low Priority';
export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type IndoorOutdoorType = 'Indoor Controlled' | 'Indoor Ambient' | 'Outdoor Sheltered' | 'Outdoor Exposed';
export type HandlingCondition = 'Gentle / Automated' | 'Standard Commercial' | 'Rough / Manual';
export type ExposureRisk = 'Low' | 'Moderate' | 'High';
export type StorageMode = 'Ambient' | 'Chilled' | 'Frozen';
export type PrototypeStatus = 'WORKING' | 'PARTIAL' | 'SIMULATED' | 'PLANNED';
export type ConfidenceGrade = 'HIGH' | 'MEDIUM' | 'LOW' | 'NO RECOMMENDATION';

export interface FoodProfile {
  moistureLevel: SensitivityLevel;
  moisturePercentage: string;
  fatLevel: SensitivityLevel;
  acidity: 'Low (pH > 5.5)' | 'Medium (pH 4.5 - 5.5)' | 'High (pH < 4.5)';
  oxygenSensitivity: SensitivityLevel;
  moistureSensitivity: SensitivityLevel;
  lightSensitivity: SensitivityLevel;
  temperatureSensitivity: SensitivityLevel;
  transportationSensitivity: SensitivityLevel;
  typicalStorageCondition: string;
  primaryDeteriorationMode: string;
  // Fresh produce / MAP attributes
  isFreshProduce: boolean;
  respirationCategory: 'None' | 'Low' | 'Moderate' | 'High' | 'Very High';
  respirationRateRange: string; // e.g. "15-25 mg CO2/kg·h @ 10°C" or "None (Processed Dry Food)"
  targetGasEnvironment?: {
    o2Percent: string;
    co2Percent: string;
    n2Percent: string;
  };
  prototypeBasis: 'PROTOTYPE_SYNTHETIC' | 'LITERATURE_BENCHMARK';
  defaultIngredients: string;
  defaultQuantity: {
    amount: number;
    unit: 'g' | 'kg' | 'ml' | 'L';
  };
}

export interface FoodCommodity {
  id: string;
  name: string;
  category: string;
  description: string;
  profile: FoodProfile;
  recommendedStorageTemp: number; // in °C
  recommendedStorageRH: number; // in %
  recommendedShelfLifeDays: number;
}

export interface ProductInput {
  foodId: string;
  quantityAmount: number;
  quantityUnit: 'g' | 'kg' | 'ml' | 'L';
  ingredients: string;
  moistureKnown: boolean;
  moisturePercentageInput?: number;
  fatKnown: boolean;
  fatPercentageInput?: number;
  phKnown: boolean;
  phValueInput?: number;
  respirationRateKnown: boolean;
  respirationCategoryInput?: 'None' | 'Low' | 'Moderate' | 'High' | 'Very High';
  currentShelfLifeDays: number;
  targetShelfLifeDays: number;
}

export interface StorageInput {
  storageMode: StorageMode;
  temperatureC: number;
  relativeHumidityPercent: number;
  storageDurationDays: number;
  environmentType: IndoorOutdoorType;
}

export interface TransportInput {
  durationDays: number;
  distanceKm: number;
  handling: HandlingCondition;
  heatExposure: ExposureRisk;
  moistureExposure: ExposureRisk;
}

export interface UserPreferences {
  costPriority: PriorityLevel;
  sustainabilityPriority: PriorityLevel;
  protectionPriority: PriorityLevel;
  availabilityPriority: PriorityLevel;
}

export interface PackagingRequirement {
  id: string;
  name: string;
  level: RequirementLevel;
  targetScore: number; // 0-100 threshold
  reason: string;
  requiredMetric?: string; // e.g. "< 1.5 cm³/m²·day"
}

export interface PackagingPrescription {
  // 1. Package format
  packageFormat: string;
  // 2. Material / Structure
  materialStructure: string;
  // 3. Thickness or prototype thickness range
  thicknessRange: string;
  recommendedGauge: string; // Alias for backward compatibility
  // 4. Moisture barrier
  moistureBarrier: string;
  // 5. Oxygen barrier
  oxygenBarrier: string;
  // 6. Light barrier
  lightBarrier: string;
  // 7. Mechanical strength
  mechanicalStrength: string;
  // 8. Sealability
  sealability: string;
  sealIntegrity: string; // Alias for backward compatibility
  // 9. Gas permeability where applicable
  gasPermeability?: string;
  // 10. MAP requirement where applicable
  mapRequirement: string;
  mapRecommendation: string; // Alias for backward compatibility
  // 11. Cost
  cost: string;
  // 12. Sustainability
  sustainability: string;
  // 13. Suitability score
  suitabilityScore: number;
  // 14. Explanation
  explanation: string;
  // 15. Limitations
  limitations: string[];
  // 16. Confidence / data completeness
  confidenceCompleteness: string;
  // Target specs bundle for backward compatibility
  barrierTargets: {
    otrTarget: string;
    wvtrTarget: string;
    lightBarrier: string;
  };
  specificationNotes: string;
}

export type PackagingCategory =
  | 'Flexible Multilayer Laminates'
  | 'Monolithic Polymers'
  | 'Metalized Films'
  | 'Sustainable/Bio-Plastics'
  | 'Glass & Rigid Containers'
  | 'Paperboard & Foils'
  | 'Active & Intelligent Packaging'
  | 'Cellulosic / Paper'
  | 'Glass'
  | 'Metal'
  | 'Polymer (Rigid/Flexible)'
  | 'Composite / Multilayer'
  | 'Bio-based';

export interface PackagingMaterial {
  id: string;
  name: string;
  category: PackagingCategory | string;
  description: string;
  structure: string;
  monoOrMultilayer: 'Mono-material' | 'Multilayer composite';
  isMonoMaterial: boolean;
  // Permeability and physics properties
  otrValue: number; // cm³/m²·day·atm @ 23°C, 0% RH
  wvtrValue: number; // g/m²·day @ 38°C, 90% RH
  co2Permeability?: number; // cm³/m²·day·atm
  lightBarrierType: 'Total Opaque (100%)' | 'UV Blocking Tinted' | 'Semi-translucent' | 'High Transmission (Clear)';
  thicknessGauge: string; // e.g. "12μm PET / 9μm Al / 50μm PE"
  // Normalized 0-100 benchmark scores
  moistureProtection: number;
  oxygenProtection: number;
  lightProtection: number;
  mechanicalStrength: number;
  punctureResistance: number;
  heatResistance: number;
  sealability: number;
  sealTempRange: string; // e.g. "115°C - 135°C"
  tempToleranceRange: string; // e.g. "-20°C to +85°C"
  // Economics & circularity
  costLevel: 'Low' | 'Medium' | 'High' | 'Very High';
  costScore: number; // 0-100 (Higher = more economical)
  estimatedCostPerKg: string;
  availabilityScore: number; // 0-100 in Indian packaging supply chain
  recyclabilityPercent: number; // 0-100
  compostability: boolean;
  compostabilityScore: number; // 0-100
  compostabilityStandard?: string;
  recycledContentPercent: number;
  // Application parameters
  suitableFoodTypes: string[];
  advantages: string[];
  limitations: string[];
  densityGcm3?: number;
  barrierNotes?: string;
  dataSource: string;
  testConditions: string;
  confidenceBenchmark: 'High' | 'Medium' | 'Low';
  // Regulatory & Advanced Specs for Enterprise Detail Drawer
  migrationLimit?: string; // e.g. "< 8.2 mg/dm² (IS 9845 / IS 15609 Compliant)"
  fssaiStandard?: string; // e.g. "FSSAI Section 2.1 / IS 10146"
  dartDropImpact?: string; // e.g. "320 g (ASTM D1709)"
  tensileStrength?: string; // e.g. "180 - 240 MPa (ASTM D882)"
}

export interface MaterialScoreBreakdown {
  protectionScore: number; // max 30
  storageSuitability: number; // max 20
  transportStrength: number; // max 15
  costScore: number; // max 15
  sustainabilityScore: number; // max 10
  availabilityScore: number; // max 10
  penalties: number; // subtracted
  rawScore: number;
  finalScore: number; // 0-100
}

export interface ScoredMaterial {
  material: PackagingMaterial;
  score: number; // 0-100
  breakdown: MaterialScoreBreakdown;
  prescription: PackagingPrescription;
  protectionRating: 'Superior' | 'Good' | 'Moderate' | 'Limited';
  costRating: 'Budget Friendly' | 'Moderate' | 'Premium';
  sustainabilityRating: 'High Eco-Value' | 'Moderate' | 'Low';
  reasonsPositive: string[];
  reasonsNegative: string[];
  warnings: string[];
  keyReason: string;
  isFilteredOut: boolean;
  filterReason?: string;
}

export interface FreshProduceMapDetails {
  respirationCategory: string;
  respirationRateText: string;
  targetO2Range: string;
  targetCO2Range: string;
  permeabilityRequirement: string;
  mapRecommendation: string;
  anaerobicRiskWarning: string;
}

export interface NoFeasibleAnalysis {
  failedConstraints: string[];
  closestCandidate: ScoredMaterial | null;
  requiredModifications: string[];
  tradeOffSummary: string;
}

export interface RecommendationResult {
  food: FoodCommodity;
  productInput: ProductInput;
  storage: StorageInput;
  transport: TransportInput;
  preferences: UserPreferences;
  requirements: PackagingRequirement[];
  eligibleMaterials: ScoredMaterial[];
  filteredMaterials: ScoredMaterial[];
  topRecommendations: {
    bestOverall: ScoredMaterial | null;
    bestForShelfLife: ScoredMaterial | null;
    mostEconomical: ScoredMaterial | null;
    mostSustainable: ScoredMaterial | null;
  };
  feasibleAlternatives: ScoredMaterial[];
  isNoFeasibleSolution: boolean;
  noFeasibleAnalysis?: NoFeasibleAnalysis;
  isFreshProducePathway: boolean;
  produceMapDetails?: FreshProduceMapDetails;
  confidenceGrade: ConfidenceGrade;
  confidenceScore: number; // 0-100
  confidenceReason: string;
  missingDataWarnings: string[];
  warnings: string[];
  evaluatedAt: string;
  prototypeStatusTags: Record<string, PrototypeStatus>;
}

export interface WhatIfDelta {
  materialName: string;
  previousScore: number;
  newScore: number;
  delta: number;
  rankChange: number;
  driverReason: string;
}

export interface ExistingPackageAuditInput {
  commodityId: string;
  currentMaterialName: string;
  currentStructure: string;
  currentGaugeMicrons: number;
  currentOtrKnown: boolean;
  currentOtrValue?: number;
  currentWvtrKnown: boolean;
  currentWvtrValue?: number;
  achievedShelfLifeDays: number;
  targetShelfLifeDays: number;
  observedIssues: {
    leakage: boolean;
    moistureLossOrGain: boolean;
    oxidationRancidity: boolean;
    mechanicalCrushing: boolean;
    colorFading: boolean;
    packageSwelling: boolean;
  };
}

export interface ExistingPackageAuditResult {
  adequacyRating: 'Adequate' | 'Marginal' | 'Substandard / High Failure Risk';
  requirementsMet: string[];
  requirementsFailed: string[];
  diagnosedFailureModes: string[];
  immediateImprovementSuggestions: string[];
  recommendedUpgradeCandidate: ScoredMaterial | null;
}
