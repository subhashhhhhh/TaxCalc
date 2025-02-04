export interface TaxDetails {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  newRegimeTaxableIncome: number;
  oldRegimeTaxableIncome: number;
  newRegimeTax: number;
  oldRegimeTax: number;
  newRegimeSlabs: TaxSlab[];
  oldRegimeSlabs: TaxSlab[];
}

export interface TaxSlab {
  start: number;
  end: number | null;
  rate: number;
  tax: number;
}

export interface Deductions {
  section80C: number;
  section80D: number;
  hra: number;
  lta: number;
  nps: number;
  standardDeduction: number;
}

export interface TaxInput {
  income: number;
  employmentType: "salaried" | "self-employed";
  deductions: Deductions;
}