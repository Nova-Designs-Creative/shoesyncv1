"use client";
import React, { useEffect, useState } from "react";
import "./EditShoesStyle.css";
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
import { FaTrash } from "react-icons/fa6";
import DeleteBtn from "./DeleteBtn";

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

const EditShoesForm = ({
  id,
  owner,
  number,
  sku,
  name,
  size,
  price,
  location,
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [shoeList, setShoeList] = useState([]);
  const [value, setValue] = useState(name); // Changed newName to value
  const [newPrice, setNewPrice] = useState(price); // Initialize with price or empty string
  const [newNumber, setNewNumber] = useState(number); // Initialize with number or empty string
  const [newSku, setNewSku] = useState(sku); // Initialize with sku or empty string
  const [newSize, setNewSize] = useState(size); // Default size 1 US
  const [newOwner, setNewOwner] = useState(owner); // Default owner
  const [newLocation, setNewLocation] = useState(location); // Default location

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
    if (
      !value ||
      !newPrice ||
      !newNumber ||
      !newSku ||
      !newSize ||
      !newOwner ||
      !newLocation
    ) {
      alert("All fields are required.");
      return;
    }

    // Ensure price is a valid number
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      // Send a PUT request to update the shoe record
      const res = await fetch(`http://localhost:3000/api/shoes/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          newName: value,
          newPrice: parsedPrice,
          newNumber,
          newSku,
          newSize,
          newOwner,
          newLocation,
          availability: "AVAIL",
        }),
      });

      // If response is successful, redirect or reset form
      if (res.ok) {
        alert("Shoe updated successfully");
        router.push("/inventory");
      } else {
        throw new Error("Failed to update the shoe");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating the shoe. Please try again.");
    }
  };

  return (
    <div className="createShoes">
      <DeleteBtn id={id} />
      <h1>Editing Shoes</h1>
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
                              currentValue === value ? "" : currentValue // Changed newName to value
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === shoe.value // Changed newName to value
                                ? "opacity-100"
                                : "opacity-0"
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
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)} // Set price
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
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)} // Set ID
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
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)} // Set SKU
              />
            </div>
          </div>

          <div className="createShoes-select">
            <h2>Size - US</h2>
            <Select value={newSize} onValueChange={setNewSize}>
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
            <Select value={newOwner} onValueChange={setNewOwner}>
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
            <Select value={newLocation} onValueChange={setNewLocation}>
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditShoesForm;
