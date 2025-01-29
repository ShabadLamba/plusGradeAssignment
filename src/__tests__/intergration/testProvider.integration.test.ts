import { getTaxBrackets } from "../../services/taxProvider";
import { fetchTaxBrackets } from "../../services/api/taxApi";

jest.mock("../../services/api/taxApi", () => ({
    fetchTaxBrackets: jest.fn(),
}));

const mockFetchTaxBrackets = fetchTaxBrackets as jest.MockedFunction<
    typeof fetchTaxBrackets
>;

describe("taxProvider Integration Test", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("fetches tax brackets from the API and stores them in localStorage", async () => {
        const mockTaxBrackets = {
            tax_brackets: [
                { min: 0, max: 10000, rate: 0.1 },
                { min: 10000, max: 20000, rate: 0.2 },
            ],
        };

        mockFetchTaxBrackets.mockResolvedValue(mockTaxBrackets);

        const result = await getTaxBrackets("2023");
        expect(result).toEqual(mockTaxBrackets.tax_brackets);

        const cachedData = JSON.parse(
            localStorage.getItem("taxBrackets") || "{}"
        );
        expect(cachedData["2023"]).toEqual(mockTaxBrackets.tax_brackets);
    });
});
