// This function formats a number to include commas as thousand separators
// For Eg: 1000000 => 1,000,000
export const formatValue = (value: string) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
