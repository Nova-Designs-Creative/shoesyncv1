"use client";

import React, { useEffect, useState, useContext } from "react";
import "../dashboardStyle.css";
import { PiSneakerBold } from "react-icons/pi";
import { PiMoneyBold } from "react-icons/pi";
import { LuMonitor } from "react-icons/lu";
import { AllAvailableShoesContext } from "../page"; // Import the context for available shoes
import { AllSoldShoesContext } from "../page"; // Import the context for sold shoes

const DashboardSummary = () => {
  const allAvailableShoes = useContext(AllAvailableShoesContext); // Context for available shoes
  const allSoldShoes = useContext(AllSoldShoesContext); // Context for sold shoes
  const [totalSold, setTotalSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);

  useEffect(() => {
    // Calculate total sold shoes and total revenue based on sold shoes
    const soldCount = allSoldShoes.length; // Count of sold shoes
    const revenue = allSoldShoes.reduce(
      (acc, shoe) => acc + (shoe?.priceSold || 0),
      0
    ); // Total revenue from sold shoes
    const inventory = allAvailableShoes.length; // Total count of available shoes

    setTotalSold(soldCount);
    setTotalRevenue(revenue);
    setInventoryCount(inventory); // Set inventory count based on available shoes
  }, [allAvailableShoes, allSoldShoes]); // Recalculate when available or sold shoes data changes

  return (
    <div className="dashboard-summary">
      {/* Total Shoes Sold */}
      <div className="ds-stats">
        <div className="ds-logo">
          <PiSneakerBold size={40} color="black" />
        </div>
        <div className="ds-info">
          <h4>Total Shoes Sold</h4>
          <h2>{totalSold}</h2>
          <div className="ds-trend">
            <p>31 days ago</p>
          </div>
        </div>
      </div>
      <hr className="divider" />

      {/* Revenue */}
      <div className="ds-stats">
        <div className="ds-logo">
          <PiMoneyBold size={40} color="black" />
        </div>
        <div className="ds-info">
          <h4>Revenue</h4>
          <h2>₱{totalRevenue.toLocaleString()}</h2>
          <div className="ds-trend">
            <p>31 days ago</p>
          </div>
        </div>
      </div>
      <hr className="divider" />

      {/* Shoe Inventory */}
      <div className="ds-stats">
        <div className="ds-logo">
          <LuMonitor size={40} color="black" />
        </div>
        <div className="ds-info">
          <h4>Shoes Inventory</h4>
          <h2>{inventoryCount}</h2> {/* Display total available shoes */}
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
