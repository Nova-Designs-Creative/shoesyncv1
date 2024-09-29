"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import InventoryHead from "./components/InventoryHead";
import InventoryTable from "./components/InventoryTable";
import { useRouter } from "next/navigation";
import Loading from "./loading";

const getShoes = async () => {
  try {
    const res = await fetch("https://shoesyncv1.vercel.app/api/shoes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading shoes: ", error);
    return { shoes: [] };
  }
};

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shoesInventory, setShoesInventory] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [locationFilter, setLocationFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    // Check authentication status
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/"); // Redirect to home page
    }
  }, [status]);

  useEffect(() => {
    const fetchShoes = async () => {
      setLoading(true); // Set loading to true before fetching
      const data = await getShoes();
      setShoesInventory(data.shoes);
      setLoading(false); // Set loading to false after fetching
    };

    // Only fetch shoes if the user is authenticated
    if (status === "authenticated") {
      fetchShoes();
    } else {
      setLoading(false); // Set loading to false if not authenticated
    }
  }, [status]);

  // Filter data based on input, location, and owner
  const filteredShoes = shoesInventory.filter((shoe) => {
    const shoeLocation = shoe.location.toLowerCase();
    const shoeOwner = shoe.owner.toLowerCase();
    const searchFilter = filter.toLowerCase();
    const selectedLocation = locationFilter.toLowerCase();
    const selectedOwner = ownerFilter.toLowerCase();

    return (
      (shoe.name.toLowerCase().includes(searchFilter) ||
        shoe.sku.toLowerCase().includes(searchFilter) ||
        shoe.number.toLowerCase().includes(searchFilter) ||
        shoe.price.toString().includes(searchFilter) ||
        shoe.size.toString().includes(searchFilter)) &&
      (selectedLocation ? shoeLocation === selectedLocation : true) &&
      (selectedOwner ? shoeOwner === selectedOwner : true)
    );
  });

  // Sort data based on sortKey and sortDirection
  const sortedShoes = [...filteredShoes].sort((a, b) => {
    if (sortKey) {
      const aValue = sortKey === "price" ? parseFloat(a[sortKey]) : a[sortKey];
      const bValue = sortKey === "price" ? parseFloat(b[sortKey]) : b[sortKey];
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  // Show loading state or the table
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="inventoryParent">
      <InventoryHead
        filter={filter}
        setFilter={setFilter}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        ownerFilter={ownerFilter}
        setOwnerFilter={setOwnerFilter}
      />
      <InventoryTable shoeInventoryData={sortedShoes} />
    </div>
  );
};

export default Page;
