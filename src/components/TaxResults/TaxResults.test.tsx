import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaxResults from "./TaxResults";

const mockResult = {
    finalTax: 4500,
    taxPerBand: {
        "0-10000": 1000,
        "10000-20000": 2000,
        "20000+": 1500,
    },
    effectiveRate: 0.18,
};

describe("TaxResults Component Tests", () => {
    it("renders tax calculation results correctly", () => {
        render(<TaxResults result={mockResult} />);

        expect(screen.getByTestId("tax-results-title")).toBeInTheDocument();
        expect(screen.getByTestId("total-tax")).toHaveTextContent("Total Tax:$4500.00");
        expect(screen.getByTestId("effective-tax-rate")).toHaveTextContent("Effective Tax Rate:18.00%");
    });

    it("displays tax per band correctly", () => {
        render(<TaxResults result={mockResult} />);

        expect(screen.getByTestId("tax-band-0-10000")).toHaveTextContent("0-10000:$1000.00");
        expect(screen.getByTestId("tax-band-10000-20000")).toHaveTextContent("10000-20000:$2000.00");
        expect(screen.getByTestId("tax-band-20000+")).toHaveTextContent("20000+:$1500.00");
    });

    it("does not render anything when result is null", () => {
        render(<TaxResults result={null} />);
        expect(screen.queryByTestId("tax-results")).not.toBeInTheDocument();
    });
});