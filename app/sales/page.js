"use client";

import React, { useEffect, useState } from "react";
import { addDays, format, subDays } from "date-fns"; // Import subDays for date calculations
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "./salesStyles.css";
import { useRouter } from "next/navigation";

// Fetch data function
const getSoldShoes = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/shoes/soldShoes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading shoes: ", error);
    return { shoes: [] }; // Return an empty array in case of error
  }
};

const DatePickerWithPresets = ({ dateRange, setDateRange }) => {
  const [preset, setPreset] = useState("");

  const handlePresetChange = (value) => {
    setPreset(value);
    const today = new Date();

    if (value === "0") {
      // This Month
      setDateRange({
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
      });
    } else if (value === "1") {
      // This Year
      setDateRange({
        from: new Date(today.getFullYear(), 0, 1),
        to: new Date(today.getFullYear() + 1, 0, 0),
      });
    } else if (value === "3") {
      // Custom date range selection
      setDateRange(undefined); // Clear the selection for custom
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal text-white",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select onValueChange={handlePresetChange}>
          <SelectTrigger className="bg-black text-white hover:bg-slate-900">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">This Month</SelectItem>
            <SelectItem value="1">This Year</SelectItem>
            <SelectItem value="3">Custom</SelectItem>
          </SelectContent>
        </Select>
        {preset === "3" && (
          <div className="rounded-md border">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shoes, setShoes] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 31), // Set to 31 days ago
    to: new Date(), // Set to current date
  });

  useEffect(() => {
    // Check authentication status
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/"); // Redirect to home page
    }
  }, [status]);

  useEffect(() => {
    const fetchShoes = async () => {
      const data = await getSoldShoes();
      setShoes(data.shoes);
    };

    if (status === "authenticated") {
      fetchShoes(); // Only fetch shoes if authenticated
    }
  }, [status]);

  // Filter shoes based on date range
  const filteredShoes = shoes.filter((shoe) => {
    const dateSold = new Date(shoe?.dateSold);
    return (
      (!dateRange?.from || dateSold >= dateRange?.from) &&
      (!dateRange?.to || dateSold <= dateRange?.to)
    );
  });

  // Calculate total sales, total profit, and commissions
  const totalSales = filteredShoes.reduce(
    (total, shoe) => total + (shoe?.priceSold || 0),
    0
  );
  const totalProfit = filteredShoes.reduce(
    (total, shoe) => total + (shoe?.profit || 0),
    0
  );

  const totalFitzCommission = filteredShoes.reduce(
    (total, shoe) => total + (shoe.commissions?.fitz || 0),
    0
  );
  const totalBryanCommission = filteredShoes.reduce(
    (total, shoe) => total + (shoe.commissions?.bryan || 0),
    0
  );
  const totalAshleyCommission = filteredShoes.reduce(
    (total, shoe) => total + (shoe.commissions?.ashley || 0),
    0
  );

  // Count shoes sold by each seller
  const fitzShoesSold = filteredShoes.filter(
    (shoe) => shoe?.soldBy === "Fitz"
  ).length;
  const bryanShoesSold = filteredShoes.filter(
    (shoe) => shoe?.soldBy === "Bryan"
  ).length;
  const ashleyShoesSold = filteredShoes.filter(
    (shoe) => shoe?.soldBy === "Ashley"
  ).length;

  const sneakfitzSold = filteredShoes.filter(
    (shoe) => shoe?.soldBy === "Fitz" && shoe?.location === "Page"
  ).length;

  const sneakergramSold = filteredShoes.filter(
    (shoe) => shoe?.soldBy === "Bryan" && shoe.location === "Page"
  ).length;

  const totalSneakfitzCommission = filteredShoes
    .filter((shoe) => shoe.location === "Page") // Filter by location matching the page
    .reduce((total, shoe) => total + (shoe.commissions?.fitz || 0), 0);

  const totalSneakergramCommission = filteredShoes
    .filter((shoe) => shoe.location === "Page") // Filter by location matching the page
    .reduce((total, shoe) => total + (shoe.commissions?.bryan || 0), 0);

  return (
    <div className="profit-sales-container">
      <h1 className="text-4xl text-white font-bold mb-6">
        Profit & Sales Dashboard
      </h1>
      <div className="ps-date-picker">
        <DatePickerWithPresets
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
      <div className="ps-board-container">
        <div className="ps-board-row">
          <div className="ps-board ps-stats bg-custom-green">
            <h4>Total Sales</h4>
            <h1>₱{totalSales.toLocaleString()}</h1>
          </div>
          <div className="ps-board ps-stats bg-custom-orange">
            <h4>Total Profit</h4>
            <h1>₱{totalProfit.toLocaleString()}</h1>
          </div>
          <div className="ps-board ps-stats bg-custom-blue">
            <h4>Shoes Sold</h4>
            <h1>{filteredShoes.length}</h1>
          </div>
        </div>
        <div className="ps-board-row">
          <div className="ps-board">
            <h4>Fitz Profit</h4>
            <h1>₱{totalFitzCommission.toLocaleString()}</h1>
            <h4 className="shoes-sold-headline">Shoes Sold</h4>
            <h5>{fitzShoesSold}</h5>
          </div>
          <div className="ps-board">
            <h4>Bryan Profit</h4>
            <h1>₱{totalBryanCommission.toLocaleString()}</h1>
            <h4 className="shoes-sold-headline">Shoes Sold</h4>
            <h5>{bryanShoesSold}</h5>
          </div>
          <div className="ps-board">
            <h4>Ashley Profit</h4>
            <h1>₱{totalAshleyCommission.toLocaleString()}</h1>
            <h4 className="shoes-sold-headline">Shoes Sold</h4>
            <h5>{ashleyShoesSold}</h5>
          </div>
        </div>
        <div className="ps-board-row">
          <div className="ps-board">
            <h4>Fitz Sneakfitz</h4>
            <h1>₱{totalSneakfitzCommission.toLocaleString()}</h1>
            <h4 className="shoes-sold-headline">Shoes Sold</h4>
            <h5>{sneakfitzSold}</h5>
          </div>
          <div className="ps-board">
            <h4>Bryan Sneakergram</h4>
            <h1>₱{totalSneakergramCommission.toLocaleString()}</h1>
            <h4 className="shoes-sold-headline">Shoes Sold</h4>
            <h5>{sneakergramSold}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
