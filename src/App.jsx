import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full flex justify-center h-[50px] border-b-2 items-center">
        Mortgage Calculator
      </div>
    </ThemeProvider>
  );
}

export default App;
