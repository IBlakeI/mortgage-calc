import { useState, useEffect } from "react";
import { X, CalendarIcon } from "lucide-react";

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MortgageCalc = () => {
  const [loanAmount, setLoanAmount] = useState(
    localStorage.getItem("loanAmount") || "",
  );
  const [loanTerm, setLoanTerm] = useState(
    localStorage.getItem("loanTerm") || "",
  );

  const [interestRate, setInterestRate] = useState(
    localStorage.getItem("interestRate") || "",
  );

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [startDate, setStartDate] = useState(
    localStorage.getItem("startDate")
      ? new Date(localStorage.getItem("startDate"))
      : new Date(2023, 4, 1),
  );
  const [amountPaid, setAmountPaid] = useState(0);
  const [amountStillOwed, setAmountStillOwed] = useState(0);
  const [monthsPaid, setMonthsPaid] = useState(0);
  const [yearsPaid, setYearsPaid] = useState(0);
  const [monthsRemaining, setMonthsRemaining] = useState(0);
  const [yearsRemaining, setYearsRemaining] = useState(0);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(startDate);

  function formatDate(date) {
    if (!date) return "";

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function isValidDate(date) {
    if (!date) return false;

    return !isNaN(date.getTime());
  }

  const [dateValue, setDateValue] = useState(formatDate(startDate));

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const termInMonths = parseInt(loanTerm) * 12;
    const rate = parseFloat(interestRate) / 100 / 12;

    if (principal && termInMonths && !isNaN(rate)) {
      let payment = 0;
      if (rate === 0) {
        payment = principal / termInMonths;
      } else {
        payment = (principal * rate) / (1 - Math.pow(1 + rate, -termInMonths));
      }
      setMonthlyPayment(payment.toFixed(2));
    } else {
      setMonthlyPayment(0);
    }
  };

  const calculateAmountPaidAndStillOwed = () => {
    if (!startDate) return;

    const today = new Date();
    const monthsElapsed =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());
    const totalPayments = parseInt(loanTerm) * 12;
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;

    if (principal && totalPayments && monthsElapsed >= 0 && !isNaN(rate)) {
      let payment = 0;
      let remainingBalance = 0;
      if (rate === 0) {
        payment = principal / totalPayments;
        const principalPaid = payment * monthsElapsed;
        remainingBalance = principal - principalPaid;
        setAmountPaid(principalPaid.toFixed(2));
        setAmountStillOwed(Math.max(remainingBalance, 0).toFixed(2));
      } else {
        payment = (principal * rate) / (1 - Math.pow(1 + rate, -totalPayments));
        remainingBalance =
          principal * Math.pow(1 + rate, monthsElapsed) -
          payment * ((Math.pow(1 + rate, monthsElapsed) - 1) / rate);
        const totalPaid = payment * monthsElapsed;
        setAmountPaid(totalPaid.toFixed(2));
        setAmountStillOwed(Math.max(remainingBalance, 0).toFixed(2));
      }

      const paidYears = Math.floor(monthsElapsed / 12);
      const paidMonths = monthsElapsed % 12;

      setYearsPaid(paidYears);
      setMonthsPaid(paidMonths);

      const remainingMonths = Math.max(totalPayments - monthsElapsed, 0);
      const remainYears = Math.floor(remainingMonths / 12);
      const remainMonths = remainingMonths % 12;

      setYearsRemaining(remainYears);
      setMonthsRemaining(remainMonths);
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
    setStartDate(undefined);
    setDateValue("");
    setAmountPaid(0);
    setAmountStillOwed(0);
    setYearsPaid(0);
    setMonthsPaid(0);
    setYearsRemaining(0);
    setMonthsRemaining(0);

    localStorage.removeItem("loanAmount");
    localStorage.removeItem("loanTerm");
    localStorage.removeItem("interestRate");
    localStorage.removeItem("startDate");
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [loanAmount, loanTerm, interestRate]);

  useEffect(() => {
    calculateAmountPaidAndStillOwed();
  }, [startDate, loanAmount, loanTerm, interestRate]);

  useEffect(() => {
    localStorage.setItem("loanAmount", loanAmount);
    localStorage.setItem("loanTerm", loanTerm);
    localStorage.setItem("interestRate", interestRate);

    if (startDate && !isNaN(startDate.getTime())) {
      localStorage.setItem("startDate", startDate.toISOString());
    } else {
      localStorage.removeItem("startDate");
    }
  }, [loanAmount, loanTerm, interestRate, startDate]);

  return (
    <div className="p-4 flex flex-col gap-1 items-center">
      <div className="p-4 flex flex-col gap-1 items-center">
        <Button onClick={clearAllFields} className="w-[100px] p-1 flex gap-1">
          <X size={15} />
          Clear All
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
        <Label className="pb-2">Start Date</Label>
        <div className="relative w-[300px]">
          <Input
            value={dateValue}
            placeholder="May 01, 2023"
            className="h-[25px] pr-8"
            onChange={(e) => {
              const date = new Date(e.target.value);
              setDateValue(e.target.value);
              if (isValidDate(date)) {
                setStartDate(date);
                setMonth(date);
              }
            }}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Select date"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <CalendarIcon size={14} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={startDate}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  setStartDate(date);
                  setDateValue(formatDate(date));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

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
          <Label className="pl-2 text-xs">Time Paid</Label>

          <Input
            value={`${yearsPaid} years ${monthsPaid} months`}
            className="h-[25px] w-[300px]"
            disabled
          />
        </div>

        <div className="pt-2">
          <Label className="pl-2 text-xs">Time Remaining</Label>

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
