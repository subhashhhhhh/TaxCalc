import { TaxDetails, TaxInput, TaxSlab } from "./types";

const NEW_REGIME_SLABS = [
  { start: 0, end: 400000, rate: 0 },
  { start: 400000, end: 800000, rate: 5 },
  { start: 800000, end: 1200000, rate: 10 },
  { start: 1200000, end: 1600000, rate: 15 },
  { start: 1600000, end: 2000000, rate: 20 },
  { start: 2000000, end: 2400000, rate: 25 },
  { start: 2400000, end: null, rate: 30 },
];

const OLD_REGIME_SLABS = [
  { start: 0, end: 250000, rate: 0 },
  { start: 250000, end: 500000, rate: 5 },
  { start: 500000, end: 1000000, rate: 20 },
  { start: 1000000, end: null, rate: 30 },
];

function calculateSlabTax(income: number, slabs: typeof NEW_REGIME_SLABS): TaxSlab[] {
  return slabs.map(slab => {
    const slabIncome = slab.end
      ? Math.max(0, Math.min(income, slab.end) - slab.start)
      : Math.max(0, income - slab.start);
    
    return {
      start: slab.start,
      end: slab.end,
      rate: slab.rate,
      tax: (slabIncome * slab.rate) / 100,
    };
  });
}

function calculateTotalTax(slabs: TaxSlab[]): number {
  return slabs.reduce((total, slab) => total + slab.tax, 0);
}

export function calculateTax(input: TaxInput): TaxDetails {
  const { income, employmentType, deductions } = input;
  
  // Calculate deductions for old regime
  const totalDeductions = Object.values(deductions).reduce((sum, value) => sum + value, 0);
  
  // Calculate taxable income for both regimes
  const standardDeduction = employmentType === "salaried" ? 75000 : 0;
  const newRegimeTaxableIncome = Math.max(0, income - standardDeduction);
  const oldRegimeTaxableIncome = Math.max(0, income - totalDeductions);

  // Calculate tax for both regimes
  const newRegimeSlabs = calculateSlabTax(newRegimeTaxableIncome, NEW_REGIME_SLABS);
  const oldRegimeSlabs = calculateSlabTax(oldRegimeTaxableIncome, OLD_REGIME_SLABS);

  let newRegimeTax = calculateTotalTax(newRegimeSlabs);
  let oldRegimeTax = calculateTotalTax(oldRegimeSlabs);

  // Apply rebate for new regime (no tax up to 12.75L for salaried)
  if (employmentType === "salaried" && newRegimeTaxableIncome <= 1275000) {
    newRegimeTax = 0;
  }

  // Apply rebate for old regime (no tax up to 5L)
  if (oldRegimeTaxableIncome <= 500000) {
    oldRegimeTax = 0;
  }

  return {
    grossIncome: income,
    standardDeduction,
    totalDeductions,
    newRegimeTaxableIncome,
    oldRegimeTaxableIncome,
    newRegimeTax,
    oldRegimeTax,
    newRegimeSlabs,
    oldRegimeSlabs,
  };
}