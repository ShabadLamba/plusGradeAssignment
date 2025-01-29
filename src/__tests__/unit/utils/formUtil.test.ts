import { formatValue } from '../../../utils/formUtils';

describe('formatValue', () => {
  it('formats numbers with commas', () => {
    expect(formatValue('1000')).toBe('1,000');
    expect(formatValue('1000000')).toBe('1,000,000');
    expect(formatValue('500')).toBe('500');
  });
});