import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MortgageCalc = () => {
  const [loanAmount, setLoanAmount] = useState(
    localStorage.getItem("loanAmount") || ""
  );
  const [loanTerm, setLoanTerm] = useState(
    localStorage.getItem("loanTerm") || ""
  ); // State for loan term in years
  const [interestRate, setInterestRate] = useState(
    localStorage.getItem("interestRate") || ""
  ); // State for interest rate in percentage
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [startDate, setStartDate] = useState(
    localStorage?.getItem("startDate")
      ? new Date(localStorage.getItem("startDate"))
      : undefined
  );
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountStillOwed, setAmountStillOwed] = useState(0);
  const [monthsPaid, setMonthsPaid] = useState(0);
  const [yearsPaid, setYearsPaid] = useState(0);
  const [monthsRemaining, setMonthsRemaining] = useState(0);
  const [yearsRemaining, setYearsRemaining] = useState(0);

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const termInMonths = parseInt(loanTerm) * 12; // Loan term in months
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate

    if (principal && termInMonths && !isNaN(rate)) {
      let monthlyPayment;

      if (rate === 0) {
        monthlyPayment = principal / termInMonths;
      } else {
        monthlyPayment =
          (principal * rate) / (1 - Math.pow(1 + rate, -termInMonths));
      }

      setMonthlyPayment(monthlyPayment.toFixed(2));
    } else {
      setMonthlyPayment(0);
    }
  };

  const calculateAmountPaidAndStillOwed = () => {
    const today = new Date();
    const monthsElapsed =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());
    const totalPayments = parseInt(loanTerm) * 12;
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate

    if (principal && totalPayments && monthsElapsed >= 0 && !isNaN(rate)) {
      let totalPaid = 0;

      // Calculate total paid
      if (rate === 0) {
        totalPaid = monthsElapsed * (principal / totalPayments);
      } else {
        totalPaid =
          (principal * rate) / (1 - Math.pow(1 + rate, -totalPayments));
      }

      // Calculate remaining balance
      const remainingBalance = principal - totalPaid;

      setAmountPaid(totalPaid.toFixed(2));
      setAmountStillOwed(remainingBalance.toFixed(2));

      // Calculate months/years paid and remaining
      const yearsPaid = Math.floor(monthsElapsed / 12);
      const monthsPaid = monthsElapsed % 12;
      setYearsPaid(yearsPaid);
      setMonthsPaid(monthsPaid);

      const yearsRemaining = Math.floor((totalPayments - monthsElapsed) / 12);
      const monthsRemaining = (totalPayments - monthsElapsed) % 12;
      setYearsRemaining(yearsRemaining);
      setMonthsRemaining(monthsRemaining);
    } else {
      setAmountPaid(0);
      setAmountStillOwed(0);
      setYearsPaid(0);
      setMonthsPaid(0);
      setYearsRemaining(0);
      setMonthsRemaining(0);
    }
  };

  const clearAllFields = () => {
    setLoanAmount("");
    setLoanTerm("");
    setInterestRate("");
    setMonthlyPayment(0);
    setStartDate(new Date());
    setAmountPaid(0);
    setAmountStillOwed(0);
    setYearsPaid(0);
    setMonthsPaid(0);
    setYearsRemaining(0);
    setMonthsRemaining(0);

    // Clear local storage
    localStorage.removeItem("loanAmount");
    localStorage.removeItem("loanTerm");
    localStorage.removeItem("interestRate");
    localStorage.removeItem("startDate");
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [loanAmount, loanTerm, interestRate]);

  useEffect(() => {
    if (startDate) {
      calculateAmountPaidAndStillOwed();
    } else {
      setAmountPaid("0");
      setAmountStillOwed("0");
    }
  }, [startDate, interestRate]);

  useEffect(() => {
    // Save to local storage whenever loanAmount, loanTerm, interestRate, or startDate changes
    localStorage.setItem("loanAmount", loanAmount);
    localStorage.setItem("loanTerm", loanTerm);
    localStorage.setItem("interestRate", interestRate);
    if (startDate && !isNaN(startDate.getTime())) {
      localStorage.setItem("startDate", startDate.toISOString());
    } else {
      localStorage.removeItem("startDate"); // Clear the item if startDate is invalid or null
    }
  }, [loanAmount, loanTerm, interestRate, startDate]);

  return (
    <div className="p-4 flex flex-col gap-1 items-center">
      <div className="p-4 flex flex-col gap-1 items-center">
        <Button onClick={clearAllFields} className="w-[100px] p-1 flex gap-1">
          <X size={15} /> Clear All
        </Button>
        <div className="flex flex-col pt-2 gap-1">
          <Label className="pl-2 text-xs">Loan Amount</Label>
          <Input
            value={loanAmount}
            className="h-[25px] w-[300px]"
            placeholder="Loan Amount $"
            onChange={(e) => setLoanAmount(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-2">
          <div className="flex items-center">
            <Select onValueChange={(e) => setLoanTerm(e)} value={loanTerm}>
              <SelectTrigger className="w-[120px] h-[45px]">
                <SelectValue placeholder="Loan Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15y</SelectItem>
                <SelectItem value="30">30y</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-2">
            <Label className="pl-2 text-xs">Interest Rate</Label>
            <Input
              value={interestRate}
              className="h-[25px] w-[173px]"
              placeholder="Interest Rate %"
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-2">
          <Label className="pl-2 text-xs">Monthly Payment</Label>
          <Input
            value={monthlyPayment}
            className="h-[25px] w-[300px]"
            disabled
          />
        </div>
      </div>
      <div className="flex flex-col items-center w-[300px]">
        <Label>Start Date</Label>
        <Calendar
          mode="single"
          selected={startDate}
          onSelect={setStartDate}
          defaultMonth={startDate || new Date()}
        />

        <div className="pt-2">
          <Label className="pl-2 text-xs">Amount Paid</Label>
          <Input value={amountPaid} className="h-[25px] w-[300px]" disabled />
        </div>

        <div className="pt-2">
          <Label className="pl-2 text-xs">Amount Still Owed</Label>
          <Input
            value={amountStillOwed}
            className="h-[25px] w-[300px]"
            disabled
          />
        </div>

        <div className="pt-2">
          <Label className="pl-2 text-xs">Months Paid</Label>
          <Input
            value={`${yearsPaid} years ${monthsPaid} months`}
            className="h-[25px] w-[300px]"
            disabled
          />
        </div>

        <div className="pt-2">
          <Label className="pl-2 text-xs">Months Remaining</Label>
          <Input
            value={`${yearsRemaining} years ${monthsRemaining} months`}
            className="h-[25px] w-[300px]"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default MortgageCalc;
