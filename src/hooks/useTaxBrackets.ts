import { useState, useEffect } from 'react';
import { getTaxBrackets } from "../services/taxProvider";
import { TaxBracket } from "../types/tax";

export const useTaxBrackets = (year: string, retryCount: number) => {
    const [taxBrackets, setTaxBrackets] = useState<TaxBracket[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTaxBrackets = async () => {
            setLoading(true);
            try {
                const brackets = await getTaxBrackets(year);
                setTaxBrackets(brackets);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch tax brackets');
            } finally {
                setLoading(false);
            }
        }

        if(year) {
            setError(null);
            fetchTaxBrackets()
        };
    },[year, retryCount]);

    return {taxBrackets, loading, error}
}