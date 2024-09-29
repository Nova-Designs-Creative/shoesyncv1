"use client";
import React, { useEffect, useState } from "react";
import "./createShoesStyle.css";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Fetch data function
const getShoesList = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/shoelist", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading shoes: ", error);
    return { ShoeList: [] };
  }
};

const Page = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [shoeList, setShoeList] = useState([]);
  const [price, setPrice] = useState("");
  const [number, setNumber] = useState("");
  const [sku, setsku] = useState("");
  const [size, setSize] = useState("1"); // Default size 1 US
  const [owner, setOwner] = useState("Fitz"); // Default owner
  const [location, setLocation] = useState("Store"); // Default location

  useEffect(() => {
    const fetchShoesList = async () => {
      const data = await getShoesList();
      setShoeList(data.ShoeList || []);
    };

    fetchShoesList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if required fields are filled
    if (!value || !price || !number || !sku || !size || !owner || !location) {
      alert("All fields are required.");
      return;
    }

    try {
      // Send a POST request to create a new shoe record
      const res = await fetch("http://localhost:3000/api/shoes", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: value, // Shoe name (value selected from the list)
          price: parseFloat(price), // Ensure price is a number
          number, // Shoe number
          sku, // Shoe SKU
          size, // Shoe size
          owner, // Owner of the shoe
          location, // Shoe location
          availability: "AVAIL", // Setting default availability
        }),
      });

      // If response is successful, redirect or reset form
      if (res.ok) {
        alert("Shoe created successfully");
        router.push("/inventory");
        // You could redirect or reset the form here
      } else {
        throw new Error("Failed to create the shoe");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="createShoes">
      <h1>Adding New Shoes</h1>
      <form onSubmit={handleSubmit}>
        <div className="firstpart-create">
          <div className="selectShoes">
            <h2>Shoes</h2>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[500px] h-16 justify-between text-lg"
                >
                  {value
                    ? shoeList.find((shoe) => shoe.value === value)?.label
                    : "Select Shoes..."}
                  <ChevronsUpDown className="ml-2 h-4 w-5 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search Shoes..." />
                  <CommandList>
                    <CommandEmpty>No shoes found.</CommandEmpty>
                    <CommandGroup>
                      {shoeList.map((shoe) => (
                        <CommandItem
                          key={shoe.value}
                          value={shoe.value}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === shoe.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {shoe.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="createShoes-price">
            <h2>Price</h2>
            <div className="input-wrapper">
              <span className="currency-sign">₱</span>
              <input
                type="text"
                className="currency-input"
                placeholder="0.00"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)} // Set price
              />
            </div>
          </div>

          <div className="createShoes-price">
            <h2>ID</h2>
            <div className="input-wrapper">
              <span className="currency-sign">#</span>
              <input
                type="text"
                className="currency-input uppercase-input"
                placeholder="F101"
                value={number}
                onChange={(e) => setNumber(e.target.value)} // Set ID
              />
            </div>
          </div>
        </div>

        <hr className="mt-11 dividerist" />

        <div className="createShoes-more mt-4">
          <div className="createShoes-price">
            <h2>SKU</h2>
            <div className="input-wrapper">
              <span className="currency-sign">#</span>
              <input
                type="text"
                className="currency-input uppercase-input"
                placeholder="123"
                value={sku}
                onChange={(e) => setsku(e.target.value)} // Set ID
              />
            </div>
          </div>

          <div className="createShoes-select">
            <h2>Size - US</h2>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="1" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(20)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    {i + 1} US
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="createShoes-select">
            <h2>Owner</h2>
            <Select value={owner} onValueChange={setOwner}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fitz" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fitz">Fitz</SelectItem>
                <SelectItem value="Bryan">Bryan</SelectItem>
                <SelectItem value="Ashley">Ashley</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="createShoes-select">
            <h2>Location</h2>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Store">Store</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="createShoe-btns">
          <button className="close-btn">Close</button>
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
