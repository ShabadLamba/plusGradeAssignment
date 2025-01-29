export interface TaxBracket {
    min: number;
    max?: number;
    rate: number;
}

export interface TaxCalculationResult { 
    finalTax: number;
    taxPerBand: { [band: string]: number};
    effectiveRate: number;
}