import { ThemeProvider } from "@/components/theme-provider";
import MortgageCalc from "./components/MortgageCalc";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full flex justify-center h-[50px] border-b-2 items-center">
        Mortgage Calculator
      </div>
      <div className="h-[calc(100vh-50px)] w-full">
        <MortgageCalc />
      </div>
    </ThemeProvider>
  );
}

export default App;
