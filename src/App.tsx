import TaxCalculator from "./components/TaxCalculator/TaxCalculator";

function App() {
  return (
    <main className="p-10 h-screen space-y-5 overflow-y-auto">
      <h1 className="font-bold text-3xl text-center">Tax Calculator</h1>
      <div className="max-w-lg mx-auto space-y-4 bg-slate-100 rounded p-5 border-gray-400 border-2">
        <TaxCalculator />
      </div>
    </main>
  );
}

export default App;
