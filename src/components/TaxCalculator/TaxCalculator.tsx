import React, { useState } from "react";
import TaxResults from "../TaxResults/TaxResults";
import { formatValue } from "../../utils/formUtils";
import { useTaxBrackets } from "../../hooks/useTaxBrackets";
import { TaxCalculationResult } from "../../types/tax";
import { calculateTax } from "../../services/taxProvider";

interface taxForm {
    income?: string;
    year?: string;
}

const TaxCalculator: React.FC = () => {
    const [annualIncome, setAnnualIncome] = useState<string>("");
    const [taxYear, setTaxYear] = useState<string>("");
    const [retryCount, setRetryCount] = useState<number>(0);
    const { taxBrackets, loading, error } = useTaxBrackets(taxYear, retryCount);
    const [result, setResult] = useState<TaxCalculationResult | null>(null);
    const [validationErrors, setValidationErrors] = useState<taxForm>({});

    const validationTaxForm = () => {
        let errors: taxForm = {};

        const income = annualIncome
            ? parseInt(annualIncome?.replace(/,/g, ""), 10)
            : 0;

        if (!annualIncome) {
            errors.income = "Annual income is required.";
        } else if (isNaN(income) || income <= 0) {
            errors.income =
                "Annual income must be a positive number or greater than 0.";
        }

        if (!taxYear) {
            errors.year = "Please select a tax year.";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleAnnualIncomeChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const rawValue = e.target.value.replace(/\D/g, "");
        const formattedValue = formatValue(rawValue);
        setAnnualIncome(formattedValue);
        setResult(null); // Reset the result when the form input changes
        setValidationErrors({ ...validationErrors, income: "" });
    };

    const handleTaxYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTaxYear(e.target.value);
        setResult(null); // Reset the result when the form input changes
        setValidationErrors({ ...validationErrors, year: "" });
    };

    const handleCalculateTax = () => {
        if (!validationTaxForm() || !taxBrackets) return;

        // Remove commas from the annnual income and conver it to a number
        const income = annualIncome
            ? parseInt(annualIncome.replace(/,/g, ""), 10)
            : 0;
        const taxResult = calculateTax(income, taxBrackets);
        setResult(taxResult);
    };

    // TODO or further optimization: A user can click retry multiple times, if the API fails fast, the user can make multiple requests in a short period of time.
    // Add a throttle to the retry button to prevent multiple requests in a short period of time.
    const handleRetry = () => setRetryCount((prev) => prev + 1);

    // Disable the button if the form is invalid, or if the data is loading, or if the tax year is not selected
    let isDisabled = () =>
        loading ||
        !taxYear ||
        !!validationErrors.income ||
        !!validationErrors.year;

    return (
        <div data-testid="tax-calculator">
            <div className="space-x-4 p-5">
                <label htmlFor="annual-income">Annual Income($USD):</label>
                <input
                    type="text"
                    pattern="[0-9]*"
                    placeholder="Annual Income(in $USD)"
                    value={annualIncome}
                    name="annual-income"
                    onChange={handleAnnualIncomeChange}
                    className="p-2 rounded border-gray-400 border-2"
                    data-testid="annual-income-input"
                    aria-describedby="income-error"
                    aria-invalid={!!validationErrors.income}
                />
                {validationErrors.income && (
                    <p className="text-red-500" data-testid="income-error">
                        {validationErrors.income}
                    </p>
                )}
            </div>
            <div className="space-x-4 p-5">
                <label htmlFor="tax-year">Tax Year:</label>
                <select
                    value={taxYear}
                    name="tax-year"
                    onChange={handleTaxYear}
                    className="p-2 rounded border-gray-400 border-2"
                    data-testid="tax-year-select"
                    aria-describedby="year-error"
                    aria-invalid={!!validationErrors.year}
                >
                    <option value="" disabled>
                        Select Tax Year
                    </option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                </select>
                {error && (
                    <button
                        className="text-red-500 mx-5 my-5"
                        onClick={handleRetry}
                    >
                        Retry
                    </button>
                )}
                {validationErrors.year && (
                    <p className="text-red-500" data-testid="year-error">
                        {validationErrors.year}
                    </p>
                )}
            </div>

            <button
                className={`font-bold py-2 px-4 m-5 rounded ${
                    !isDisabled()
                        ? "bg-blue-500 hover:bg-blue-700 text-white cursor-pointer"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
                onClick={handleCalculateTax}
                disabled={isDisabled()}
                data-testid="calculate-tax-button"
                aria-disabled={isDisabled()}
            >
                Calculate Tax
            </button>

            {loading && (
                <p className="my-5 mx-5">Loading tax bracket information...</p>
            )}
            {error && <p className="text-red-500 my-5 mx-5">Error: {error}</p>}
            {calculateTax !== null && <TaxResults result={result} />}
        </div>
    );
};

export default TaxCalculator;
