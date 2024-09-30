"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// You'll need to create these CSS files or include the styles in your component
import "./soldShoesStyle.css";
import "./EditShoesStyle.css";
import { useRouter } from "next/navigation";

const SoldShoesForm = ({
  id,
  owner,
  number,
  sku,
  name,
  size,
  price,
  location: initialLocation,
}) => {
  const [formPrice, setFormPrice] = useState(price);
  const [priceSale, setPriceSale] = useState(0);
  const [formSeller, setFormSeller] = useState(owner);
  const [formLocation, setFormLocation] = useState(initialLocation);
  const [profit, setProfit] = useState(0);
  const [commissions, setCommissions] = useState({
    fitz: 0,
    bryan: 0,
    ashley: 0,
  });

  // Automatically set to the current date in YYYY-MM-DD format
  const [dateSold, setDateSold] = useState(
    new Date().toISOString().split("T")[0]
  );

  const players = ["Fitz", "Bryan", "Ashley"];

  useEffect(() => {
    const newProfit = priceSale - formPrice;
    setProfit(newProfit);
    calculateCommissions(newProfit);
  }, [priceSale, formPrice, owner, formSeller, formLocation]);

  const calculateCommissions = (newProfit) => {
    let newCommissions = { fitz: 0, bryan: 0, ashley: 0 };

    if (formLocation === "Store") {
      if (owner === formSeller) {
        // Scenario 1: Store, owner is seller
        newCommissions[owner.toLowerCase()] = newProfit * 0.8;
        players.forEach((player) => {
          if (player.toLowerCase() !== owner.toLowerCase()) {
            newCommissions[player.toLowerCase()] = newProfit * 0.1;
          }
        });
      } else {
        // Scenario 2: Store, owner is not seller
        newCommissions[owner.toLowerCase()] = newProfit * 0.45;
        newCommissions[formSeller.toLowerCase()] = newProfit * 0.45;
        players.forEach((player) => {
          if (
            player.toLowerCase() !== owner.toLowerCase() &&
            player.toLowerCase() !== formSeller.toLowerCase()
          ) {
            newCommissions[player.toLowerCase()] = newProfit * 0.1;
          }
        });
      }
    } else if (formLocation === "Page") {
      if (owner === formSeller) {
        // Scenario 3: Page, owner is seller
        newCommissions[owner.toLowerCase()] = newProfit;
      } else {
        // Scenario 4: Page, owner is not seller
        newCommissions[owner.toLowerCase()] = newProfit * 0.5;
        newCommissions[formSeller.toLowerCase()] = newProfit * 0.5;
      }
    } else if (formLocation === "Random Walk In") {
      // Scenario 5: Random Walk In
      newCommissions.fitz = newProfit * 0.8;
      newCommissions.bryan = newProfit * 0.2;
      newCommissions.ashley = newProfit * 0.2;
    } else if (formLocation === "Marketplace") {
      // Scenario 6: Marketplace
      newCommissions[owner.toLowerCase()] = newProfit;
    }

    setCommissions(newCommissions);
  };

  const renderCommissions = () => {
    return (
      <div className="soldshoes-commissions">
        <div className="player">
          <h2>Profit:</h2>
          <p>₱{profit.toFixed(2)}</p>
        </div>
        {players.map(
          (player) =>
            commissions[player.toLowerCase()] > 0 && (
              <div className="player" key={player}>
                <h2>{player}:</h2>
                <h3>
                  (
                  {((commissions[player.toLowerCase()] / profit) * 100).toFixed(
                    0
                  )}
                  %)
                </h3>
                <p>₱{commissions[player.toLowerCase()].toFixed(2)}</p>
              </div>
            )
        )}
      </div>
    );
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // PUT request to update shoe availability
      const putData = {
        newPrice: formPrice,
        newAvailability: "SOLD", // Mark as SOLD
        newProfit: profit,
        newPriceSold: priceSale,
        newSoldBy: formSeller,
        newLocation: formLocation,
        newCommissions: commissions,
        newDateSold: dateSold, // Automatically set date sold
      };

      const putResponse = await fetch(
        `https://shoesyncv1.vercel.app/api/shoes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putData),
        }
      );

      if (!putResponse.ok) {
        throw new Error("Failed to update shoe availability");
      }

      const putResult = await putResponse.json();
      console.log(putResult.message);

      alert("Shoe sold successfully and inventory updated!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error processing shoe sale:", error);
      alert("Failed to process shoe sale. Please try again.");
    }
  };

  return (
    <form className="soldshoes-container" onSubmit={handleSubmit}>
      <h1>Sold Section</h1>
      <div className="soldshoes-info">
        <div className="soldshoes-data">
          <p>ID NO.</p>
          <h4>{number}</h4>
        </div>
        <div className="soldshoes-data">
          <p>SKU NO.</p>
          <h4>{sku}</h4>
        </div>
        <div className="soldshoes-data">
          <p>Shoes Name</p>
          <h4>{name}</h4>
        </div>
        <div className="soldshoes-data">
          <p>Price</p>
          <h4>₱{price}</h4>
        </div>
        <div className="soldshoes-data">
          <p>Size</p>
          <h4>{size} US</h4>
        </div>
        <div className="soldshoes-data">
          <p>Owner</p>
          <h4>{owner}</h4>
        </div>
      </div>

      <div className="soldshoes-input">
        <div className="createShoes-price">
          <h2>Price</h2>
          <div className="input-wrapper">
            <span className="currency-sign">₱</span>
            <input
              type="number"
              className="currency-input"
              placeholder="0.00"
              min="0"
              value={formPrice}
              onChange={(e) => setFormPrice(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="createShoes-price">
          <h2>Price Sale</h2>
          <div className="input-wrapper">
            <span className="currency-sign">₱</span>
            <input
              type="number"
              className="currency-input"
              placeholder="0.00"
              min="0"
              value={priceSale}
              onChange={(e) => setPriceSale(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="createShoes-select">
          <h2>Seller</h2>
          <Select
            value={formSeller}
            onValueChange={(value) => setFormSeller(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Seller" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="createShoes-select">
          <h2>Location</h2>
          <Select
            value={formLocation}
            onValueChange={(value) => setFormLocation(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Store">Store</SelectItem>
              <SelectItem value="Page">Page</SelectItem>
              <SelectItem value="Random Walk In">Random Walk In</SelectItem>
              <SelectItem value="Marketplace">Marketplace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="soldshoes-commissions">{renderCommissions()}</div>
      <div className="createShoe-btns">
        <button className="close-btn">Close</button>
        <button className="submit-btn" type="submit">
          Sold
        </button>
      </div>
    </form>
  );
};

export default SoldShoesForm;
