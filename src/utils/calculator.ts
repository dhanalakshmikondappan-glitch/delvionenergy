export type PropertyType = "residential" | "commercial" | "industrial";
export type RoofType = "rcc" | "metal" | "other";

export interface CalculatorInputs {
  monthlyBill: number;
  propertyType: PropertyType;
  roofType: RoofType;
}

export interface CalculatorResults {
  systemSizeKw: number;
  monthlySavings: number;
  annualSavings: number;
  lifetimeSavings: number;
  co2ReductionKgPerYear: number;
  paybackYears: number;
}

/**
 * Every constant here is a stated, illustrative average — not a per-user
 * quote. MASTER.md §44 forbids "Guaranteed Savings"-style claims; a real
 * proposal requires a site visit. The UI surfaces these assumptions
 * directly rather than presenting the output as precise.
 */
const TARIFF_PER_UNIT: Record<PropertyType, number> = {
  residential: 7,
  commercial: 9,
  industrial: 8,
};

const ROOF_COST_MULTIPLIER: Record<RoofType, number> = {
  rcc: 1,
  metal: 1.08,
  other: 1.1,
};

const UNITS_PER_KW_PER_DAY = 4;
const OFFSET_RATIO = 0.9;
const COST_PER_KW = 55000;
/** India grid emission factor, illustrative (CEA baseline order of magnitude). */
const CO2_KG_PER_UNIT = 0.82;
const SYSTEM_LIFETIME_YEARS = 25;

export function calculateSavings({ monthlyBill, propertyType, roofType }: CalculatorInputs): CalculatorResults {
  if (!Number.isFinite(monthlyBill) || monthlyBill <= 0) {
    return {
      systemSizeKw: 0,
      monthlySavings: 0,
      annualSavings: 0,
      lifetimeSavings: 0,
      co2ReductionKgPerYear: 0,
      paybackYears: 0,
    };
  }

  const tariff = TARIFF_PER_UNIT[propertyType];
  const monthlyUnits = monthlyBill / tariff;
  const offsetUnits = monthlyUnits * OFFSET_RATIO;
  const systemSizeKw = offsetUnits / 30 / UNITS_PER_KW_PER_DAY;
  const monthlySavings = offsetUnits * tariff;
  const annualSavings = monthlySavings * 12;
  const systemCost = systemSizeKw * COST_PER_KW * ROOF_COST_MULTIPLIER[roofType];
  const paybackYears = annualSavings > 0 ? systemCost / annualSavings : 0;
  const lifetimeSavings = annualSavings * SYSTEM_LIFETIME_YEARS - systemCost;
  const co2ReductionKgPerYear = offsetUnits * 12 * CO2_KG_PER_UNIT;

  return { systemSizeKw, monthlySavings, annualSavings, lifetimeSavings, co2ReductionKgPerYear, paybackYears };
}
