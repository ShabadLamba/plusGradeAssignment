import { TaxBracket, TaxCalculationResult } from "../types/tax";
import { fetchTaxBrackets } from "./api/taxApi";

const TAX_BRACKETS_KEY = "taxBrackets";

// this function fetches tax brackets from the API and stores them in localStorage
export const getTaxBrackets = async (year: string): Promise<TaxBracket[]> => {
    const cachedData = JSON.parse(
        localStorage.getItem(TAX_BRACKETS_KEY) || "{}"
    );
    if (cachedData[year]) return cachedData[year];

    const data = await fetchTaxBrackets(year);
    localStorage.setItem(
        TAX_BRACKETS_KEY,
        JSON.stringify({ ...cachedData, [year]: data.tax_brackets })
    );

    return data.tax_brackets;
};

export const calculateTax = (
    income: number,
    brackets: TaxBracket[]
): TaxCalculationResult => {
    let finalTax = 0;
    const taxPerBand: { [band: string]: number } = {};

    for(const {min, max, rate} of brackets) {
        if(income > min) {
            const taxableIncome = max ? Math.min(income, max) - min : income - min;
            const bandTax = taxableIncome * rate;
            finalTax += bandTax;
            const bandKey = max ? `${min}-${max}` : `${min}+`;
            taxPerBand[bandKey] = bandTax;
        }
    }

    return  {
        finalTax,
        taxPerBand,
        effectiveRate: finalTax/income,
    }
};
