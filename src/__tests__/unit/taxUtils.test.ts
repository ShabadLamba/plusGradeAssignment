import { calculateTax } from '../../services/taxProvider';
import { TaxBracket } from '../../types/tax';

describe('calculateTax', () => {
  it('calculates total tax, tax per band, and effective rate correctly', () => {
    const brackets: TaxBracket[] = [
      { min: 0, max: 10000, rate: 0.1 },
      { min: 10000, max: 20000, rate: 0.2 },
      { min: 20000, rate: 0.3 },
    ];

    const income = 25000;
    const result = calculateTax(income, brackets);

    expect(result.finalTax).toBe(4500);
    expect(result.effectiveRate).toBeCloseTo(0.18);
    expect(result.taxPerBand).toEqual({
      '0-10000': 1000,
      '10000-20000': 2000,
      '20000+': 1500,
    });
  });
});