import React from "react";
import { TaxCalculationResult } from "../../types/tax";

interface TaxResultProps {
    result: TaxCalculationResult | null;
}

const TaxResults: React.FC<TaxResultProps> = ({ result }) => {
    return result ? (
        <div  data-testid="tax-results"  className="mx-5">
            <h2 data-testid="tax-results-title" className="font-bold mr-2">Tax Calculation Results</h2>
            <p data-testid="total-tax">
                <span className="font-bold mr-2">Total Tax:</span>$
                {result.finalTax.toFixed(2)}
            </p>
            <p data-testid="effective-tax-rate">
                <span className="font-bold mr-2">Effective Tax Rate:</span>
                {(result.effectiveRate * 100).toFixed(2)}%
            </p>
            <h3>
                <span className="font-bold mr-2">Tax Per Band:</span>
            </h3>
            <ul data-testid="tax-per-band">
                {Object.entries(result.taxPerBand).map(([band, tax]) => (
                    <li key={band} data-testid={`tax-band-${band}`}>
                        <span className="font-bold mr-2">{band}:</span>$
                        {tax.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    ) : (
        <></>
    );
};

export default TaxResults;
