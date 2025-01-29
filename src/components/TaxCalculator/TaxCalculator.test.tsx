import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import TaxCalculator from "../../components/TaxCalculator/TaxCalculator";

jest.mock("../../hooks/useTaxBrackets", () => ({
    useTaxBrackets: jest.fn(() => ({
        taxBrackets: [{ min: 0, max: 10000, rate: 0.1 }],
        loading: false,
        error: null,
    })),
}));

describe("TaxCalculator Component Tests", () => {
    it("renders the TaxCalculator component correctly", () => {
        render(<TaxCalculator />);
        expect(screen.getByTestId("tax-calculator")).toBeInTheDocument();
        expect(screen.getByTestId("annual-income-input")).toBeInTheDocument();
        expect(screen.getByTestId("tax-year-select")).toBeInTheDocument();
        expect(screen.getByTestId("calculate-tax-button")).toBeInTheDocument();
    });

    it("validates and enables the button when inputs are correct", async () => {
        render(<TaxCalculator />);

        await act(async () => {
            fireEvent.change(screen.getByTestId("annual-income-input"), {
                target: { value: "50000" },
            });
            fireEvent.change(screen.getByTestId("tax-year-select"), {
                target: { value: "2022" },
            });
        });
        
        const button = screen.getByTestId("calculate-tax-button");
        expect(button).not.toBeDisabled();
        expect(button).toHaveClass("bg-blue-500 hover:bg-blue-700 text-white");
    });

    it("disables the button when inputs are invalid", () => {
        render(<TaxCalculator />);
        fireEvent.change(screen.getByTestId("annual-income-input"), {
            target: { value: "-100" },
        });
        const button = screen.getByTestId("calculate-tax-button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass(
            "bg-gray-400 text-gray-700 cursor-not-allowed"
        );
    });

    it("displays tax results when calculations are performed", async () => {
        render(<TaxCalculator />);
        fireEvent.change(screen.getByTestId("annual-income-input"), {
            target: { value: "50000" },
        });
        fireEvent.change(screen.getByTestId("tax-year-select"), {
            target: { value: "2022" },
        });
        fireEvent.click(screen.getByTestId("calculate-tax-button"));

        await waitFor(() => {
            expect(screen.getByTestId("tax-results")).toBeInTheDocument();
        });
    });
});
