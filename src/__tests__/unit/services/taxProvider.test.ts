import { getTaxBrackets } from "../../../services/taxProvider";
import { fetchTaxBrackets } from "../../../services/api/taxApi";

jest.mock("../../../services/api/taxApi", () => ({
    fetchTaxBrackets: jest.fn(),
}));

const mockFetchTaxBrackets = fetchTaxBrackets as jest.MockedFunction<
    typeof fetchTaxBrackets
>;

describe("taxProvider", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("fetches tax brackets from API and caches them", async () => {
        const mockTaxBrackets: any = {
            tax_brackets: [{ min: 0, max: 5000, rate: 0.1 }],
        };

        mockFetchTaxBrackets.mockResolvedValue(mockTaxBrackets);

        const result = await getTaxBrackets("2024");
        expect(result).toEqual(mockTaxBrackets.tax_brackets);

        const cachedData = JSON.parse(
            localStorage.getItem("taxBrackets") || "{}"
        );
        expect(cachedData["2024"]).toEqual(mockTaxBrackets.tax_brackets);
    });

    it("returns cached tax brackets if available", async () => {
        const mockTaxBrackets = [{ min: 0, max: 5000, rate: 0.1 }];
        localStorage.setItem(
            "taxBrackets",
            JSON.stringify({ "2024": mockTaxBrackets })
        );

        const result = await getTaxBrackets("2024");
        expect(result).toEqual(mockTaxBrackets);

        expect(mockFetchTaxBrackets).not.toHaveBeenCalled();
    });

    it("throws an error if API fails", async () => {
        mockFetchTaxBrackets.mockRejectedValue(new Error("API Error"));

        await expect(getTaxBrackets("2024")).rejects.toThrow("API Error");
    });
});
