import { FoodCommodity } from '../types';

export const FOOD_COMMODITIES: FoodCommodity[] = [
  {
    id: 'potato-chips',
    name: 'Potato Chips',
    category: 'Fried Snack Foods',
    description: 'Crispy fried snack high in unsaturated lipids (30-35%), vulnerable to crispness loss through moisture uptake and oxidative rancidity from oxygen and light.',
    recommendedStorageTemp: 22,
    recommendedStorageRH: 45,
    recommendedShelfLifeDays: 180,
    profile: {
      moistureLevel: 'Low',
      moisturePercentage: '1.5% - 2.5%',
      fatLevel: 'High',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'High',
      moistureSensitivity: 'High',
      lightSensitivity: 'High',
      temperatureSensitivity: 'Medium',
      transportationSensitivity: 'High',
      typicalStorageCondition: 'Cool, dark, dry storage away from direct sunlight and radiant heat',
      primaryDeteriorationMode: 'Loss of critical crispness (aw threshold > 0.40) and lipid auto-oxidation yielding hexanal off-flavors.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Non-respiring processed dry food)',
      targetGasEnvironment: {
        o2Percent: '< 1.5%',
        co2Percent: '0%',
        n2Percent: '> 98.5%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Potatoes (65%), refined palmolein oil (33%), iodized salt (2%)',
      defaultQuantity: {
        amount: 50,
        unit: 'g'
      }
    }
  },
  {
    id: 'biscuits',
    name: 'Biscuits / Crackers',
    category: 'Baked Goods & Confectionery',
    description: 'Dry baked cereal product with low equilibrium relative humidity, prone to atmospheric moisture uptake and mechanical crushing during manual logistics.',
    recommendedStorageTemp: 24,
    recommendedStorageRH: 50,
    recommendedShelfLifeDays: 180,
    profile: {
      moistureLevel: 'Low',
      moisturePercentage: '2.0% - 4.5%',
      fatLevel: 'Medium',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'Medium',
      moistureSensitivity: 'High',
      lightSensitivity: 'Medium',
      temperatureSensitivity: 'Low',
      transportationSensitivity: 'High',
      typicalStorageCondition: 'Ambient dry storage with structural crush protection',
      primaryDeteriorationMode: 'Loss of crispness due to moisture absorption; mechanical fracture under transit vibration and stacking load.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Dry baked food)',
      targetGasEnvironment: {
        o2Percent: 'Ambient or < 5%',
        co2Percent: '0%',
        n2Percent: 'Balance'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Refined wheat flour (maida 60%), sugar (20%), edible vegetable fat (15%), invert syrup, leavening agents',
      defaultQuantity: {
        amount: 150,
        unit: 'g'
      }
    }
  },
  {
    id: 'milk-powder',
    name: 'Milk Powder (WMP/SMP)',
    category: 'Dairy Products',
    description: 'Dehydrated whole or skim dairy powder containing milk lactose, proteins, and free fats. Highly hygroscopic and prone to caking and lipid oxidation.',
    recommendedStorageTemp: 20,
    recommendedStorageRH: 40,
    recommendedShelfLifeDays: 365,
    profile: {
      moistureLevel: 'Low',
      moisturePercentage: '3.0% - 4.0%',
      fatLevel: 'High',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'High',
      moistureSensitivity: 'High',
      lightSensitivity: 'High',
      temperatureSensitivity: 'Medium',
      transportationSensitivity: 'Medium',
      typicalStorageCondition: 'Hermetically sealed, climate-controlled, dark warehouse',
      primaryDeteriorationMode: 'Lactose crystallization causing irreversible caking/lumping; photo-activated cholesterol and fatty acid oxidation.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Powdered dairy food)',
      targetGasEnvironment: {
        o2Percent: '< 1.0%',
        co2Percent: '0%',
        n2Percent: '> 99.0%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Pasteurized whole bovine milk solids (100%), milk fat (26% min)',
      defaultQuantity: {
        amount: 1,
        unit: 'kg'
      }
    }
  },
  {
    id: 'spices',
    name: 'Ground Spices (Turmeric / Chilli)',
    category: 'Seasonings & Condiments',
    description: 'Aromatic ground spices rich in volatile essential oils (e.g. curcumin, capsaicin, terpenes) vulnerable to aroma loss and photodegradation.',
    recommendedStorageTemp: 20,
    recommendedStorageRH: 50,
    recommendedShelfLifeDays: 365,
    profile: {
      moistureLevel: 'Low',
      moisturePercentage: '8.0% - 10.0%',
      fatLevel: 'Medium',
      acidity: 'Medium (pH 4.5 - 5.5)',
      oxygenSensitivity: 'High',
      moistureSensitivity: 'High',
      lightSensitivity: 'High',
      temperatureSensitivity: 'Medium',
      transportationSensitivity: 'Low',
      typicalStorageCondition: 'Airtight, opaque barrier packaging in cool ambient pantry',
      primaryDeteriorationMode: 'Loss of aroma volatiles by permeation; fading of color pigments (curcumin bleaching) from visible/UV light; caking.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Ground spice)',
      targetGasEnvironment: {
        o2Percent: '< 2.0%',
        co2Percent: '0%',
        n2Percent: '> 98.0%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Whole dried ground turmeric rhizomes (Curcuma longa 100%)',
      defaultQuantity: {
        amount: 500,
        unit: 'g'
      }
    }
  },
  {
    id: 'wheat-flour',
    name: 'Wheat Flour (Atta)',
    category: 'Cereal Grains & Flours',
    description: 'Milled whole wheat cereal flour containing gluten and starch; sensitive to ambient humidity uptake, fungal infestation, and insect penetration.',
    recommendedStorageTemp: 22,
    recommendedStorageRH: 60,
    recommendedShelfLifeDays: 180,
    profile: {
      moistureLevel: 'Medium',
      moisturePercentage: '12.0% - 14.0%',
      fatLevel: 'Low',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'Low',
      moistureSensitivity: 'High',
      lightSensitivity: 'Low',
      temperatureSensitivity: 'Low',
      transportationSensitivity: 'Medium',
      typicalStorageCondition: 'Ventilated, dry, pest-screened elevated indoor storage',
      primaryDeteriorationMode: 'Mold growth if ambient RH exceeds 65%; absorption of foreign environmental taints; weevil (Tribolium) infestation.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Milled grain)',
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Whole wheat grain (Triticum aestivum 100%)',
      defaultQuantity: {
        amount: 5,
        unit: 'kg'
      }
    }
  },
  {
    id: 'rice',
    name: 'Rice (Milled / Parboiled)',
    category: 'Grains & Pulses',
    description: 'Milled or brown staple cereal grain with long ambient shelf life when protected from moisture ingress and stored off cold concrete floors.',
    recommendedStorageTemp: 24,
    recommendedStorageRH: 60,
    recommendedShelfLifeDays: 365,
    profile: {
      moistureLevel: 'Medium',
      moisturePercentage: '11.0% - 13.0%',
      fatLevel: 'Low',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'Low',
      moistureSensitivity: 'Medium',
      lightSensitivity: 'Low',
      temperatureSensitivity: 'Low',
      transportationSensitivity: 'Low',
      typicalStorageCondition: 'Dry, moisture-resistant sacks in elevated pallet racks',
      primaryDeteriorationMode: 'Grain yellowing, insect infestation, fungal growth if grain moisture exceeds 14%.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Polished grain)',
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Parboiled polished long-grain rice (Oryza sativa 100%)',
      defaultQuantity: {
        amount: 10,
        unit: 'kg'
      }
    }
  },
  {
    id: 'fresh-vegetables',
    name: 'Fresh Tomatoes & Green Veg',
    category: 'Perishable Horticultural Produce',
    description: 'Living plant tissue with active respiration, high internal water activity (90%+), ethylene emission, and susceptibility to both wilting and anaerobic suffocation.',
    recommendedStorageTemp: 10,
    recommendedStorageRH: 90,
    recommendedShelfLifeDays: 14,
    profile: {
      moistureLevel: 'High',
      moisturePercentage: '92% - 95%',
      fatLevel: 'Low',
      acidity: 'Medium (pH 4.5 - 5.5)',
      oxygenSensitivity: 'Medium',
      moistureSensitivity: 'Medium',
      lightSensitivity: 'Medium',
      temperatureSensitivity: 'High',
      transportationSensitivity: 'High',
      typicalStorageCondition: 'Cold chain (8°C - 12°C) with breathable / micro-perforated packaging to prevent anaerobic rot',
      primaryDeteriorationMode: 'Wilting and desiccation if water vapor escapes; rapid anaerobic fermentation and ethanol rotting if hermetically sealed without gas transmission.',
      isFreshProduce: true,
      respirationCategory: 'Moderate',
      respirationRateRange: '15 - 28 mg CO2/kg·h @ 10°C (Active Respiration)',
      targetGasEnvironment: {
        o2Percent: '3% - 5%',
        co2Percent: '3% - 6%',
        n2Percent: '89% - 94%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Fresh vine-ripened tomatoes (Lycopersicon esculentum 100%)',
      defaultQuantity: {
        amount: 1,
        unit: 'kg'
      }
    }
  },
  {
    id: 'fruits',
    name: 'Fresh Table Fruits (Grapes / Apples)',
    category: 'Perishable Horticultural Produce',
    description: 'High-moisture sweet or acidic plant produce actively respiring and producing carbon dioxide and ethylene. Requires balanced equilibrium gas exchange.',
    recommendedStorageTemp: 4,
    recommendedStorageRH: 88,
    recommendedShelfLifeDays: 14,
    profile: {
      moistureLevel: 'High',
      moisturePercentage: '82% - 88%',
      fatLevel: 'Low',
      acidity: 'High (pH < 4.5)',
      oxygenSensitivity: 'Medium',
      moistureSensitivity: 'Medium',
      lightSensitivity: 'Medium',
      temperatureSensitivity: 'High',
      transportationSensitivity: 'High',
      typicalStorageCondition: 'Refrigerated cold storage with equilibrium modified atmosphere packaging (EMAP)',
      primaryDeteriorationMode: 'Mechanical impact bruising, mold decay (Botrytis cinerea), and over-ripening induced by accumulated ethylene.',
      isFreshProduce: true,
      respirationCategory: 'Moderate',
      respirationRateRange: '10 - 22 mg CO2/kg·h @ 5°C (Active Respiration)',
      targetGasEnvironment: {
        o2Percent: '3% - 5%',
        co2Percent: '5% - 8%',
        n2Percent: '87% - 92%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Fresh table grapes or apples (100%)',
      defaultQuantity: {
        amount: 500,
        unit: 'g'
      }
    }
  },
  {
    id: 'pickles',
    name: 'Pickles in Oil / Brine',
    category: 'Preserved Fermented Foods',
    description: 'High-acid, high-salt brine or oil-submerged preserved vegetable preparation (pH 3.0 - 4.2). Highly corrosive to bare metals and degrading to standard polyolefins.',
    recommendedStorageTemp: 24,
    recommendedStorageRH: 65,
    recommendedShelfLifeDays: 365,
    profile: {
      moistureLevel: 'High',
      moisturePercentage: '70% - 82%',
      fatLevel: 'Medium',
      acidity: 'High (pH < 4.5)',
      oxygenSensitivity: 'Medium',
      moistureSensitivity: 'Low',
      lightSensitivity: 'Medium',
      temperatureSensitivity: 'Medium',
      transportationSensitivity: 'Medium',
      typicalStorageCondition: 'Corrosion-resistant hermetic containers at ambient or cool temperatures',
      primaryDeteriorationMode: 'Liquid oil/brine leakage, acidic pinholing of non-lacquered metals, oxidative discoloration and surface yeast pellicle formation.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Acidified / Preserved)',
      targetGasEnvironment: {
        o2Percent: '< 2.0%',
        co2Percent: '0%',
        n2Percent: '> 98.0%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Raw mango pieces (60%), mustard oil (25%), iodized salt (10%), mixed spices, acetic acid (preservative)',
      defaultQuantity: {
        amount: 500,
        unit: 'g'
      }
    }
  },
  {
    id: 'bakery-products',
    name: 'Bakery Products (Bread / Cake)',
    category: 'Fresh Baked Goods',
    description: 'Soft yeast-leavened bread and sponge cakes with intermediate water activity (aw 0.85-0.92), susceptible to mold growth within 4-7 days.',
    recommendedStorageTemp: 22,
    recommendedStorageRH: 55,
    recommendedShelfLifeDays: 6,
    profile: {
      moistureLevel: 'Medium',
      moisturePercentage: '28% - 36%',
      fatLevel: 'Medium',
      acidity: 'Low (pH > 5.5)',
      oxygenSensitivity: 'High',
      moistureSensitivity: 'High',
      lightSensitivity: 'Low',
      temperatureSensitivity: 'Medium',
      transportationSensitivity: 'High',
      typicalStorageCondition: 'Ambient pantry shelf, sealed to prevent moisture loss while avoiding thermal condensation sweat',
      primaryDeteriorationMode: 'Amylose starch retrogradation (staling); rapid growth of Penicillium and Aspergillus mold if oxygen and water condense inside package.',
      isFreshProduce: false,
      respirationCategory: 'None',
      respirationRateRange: 'None (Moist baked food)',
      targetGasEnvironment: {
        o2Percent: '< 0.5%',
        co2Percent: '20% - 40%',
        n2Percent: '60% - 80%'
      },
      prototypeBasis: 'LITERATURE_BENCHMARK',
      defaultIngredients: 'Wheat flour, water, yeast, sugar, refined palm oil, calcium propionate (preservative)',
      defaultQuantity: {
        amount: 400,
        unit: 'g'
      }
    }
  }
];
