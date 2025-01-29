import { TaxBracket } from "../../types/tax";

export const fetchTaxBrackets = async (
    year: String
): Promise<{ tax_brackets: TaxBracket[] }> => {
    const response = await fetch(
        `http://localhost:5001/tax-calculator/tax-year/${year}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch tax brackets information");
    }
    return response.json();
};
