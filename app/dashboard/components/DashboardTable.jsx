"use client";
import React, { useState, useEffect } from "react";
import DashboardTableList from "./DashboardTableList";
import DashboardTableHead from "./DashboardTableHead";
import "../dashboardStyle.css";

// Fetch data function
const getShoes = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/shoes", {
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

const DashboardTable = () => {
  const [shoes, setShoes] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState(""); // Key for sorting (e.g., 'price')
  const [sortDirection, setSortDirection] = useState("asc"); // Sorting direction

  useEffect(() => {
    const fetchShoes = async () => {
      const data = await getShoes();
      setShoes(data.shoes);
    };

    fetchShoes();
  }, []);

  // Filter data based on input value
  const filteredShoes = shoes.filter(
    (shoe) =>
      shoe.name.toLowerCase().includes(filter.toLowerCase()) ||
      shoe.sku.toLowerCase().includes(filter.toLowerCase()) ||
      shoe.number.toLowerCase().includes(filter.toLowerCase()) ||
      shoe.owner.toLowerCase().includes(filter.toLowerCase()) ||
      shoe.location.toLowerCase().includes(filter.toLowerCase()) ||
      shoe.size.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort data based on sortKey and sortDirection
  const sortedShoes = [...filteredShoes].sort((a, b) => {
    if (sortKey) {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  return (
    <div className="mt-10 dh-table">
      <DashboardTableHead
        filter={filter}
        setFilter={setFilter}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />
      <DashboardTableList shoes={sortedShoes} />
    </div>
  );
};

export default DashboardTable;
