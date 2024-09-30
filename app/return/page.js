"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReturnTable from "./returnTable";

// Function to fetch shoes data
const getShoes = async () => {
  try {
    const res = await fetch(
      "https://shoesyncv1.vercel.app/api/shoes/soldShoes",
      {
        cache: "no-store", // Ensures fresh data on each fetch
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    const data = await res.json();
    return data.shoes || [];
  } catch (error) {
    console.error("Error loading shoes: ", error);
    return [];
  }
};

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shoes, setShoes] = useState([]);

  // Fetch shoes and update state
  const fetchShoes = useCallback(async () => {
    const fetchedShoes = await getShoes();
    setShoes(fetchedShoes);
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/");
    }
  }, [status, router]);

  // Fetch shoes on mount and set up polling
  useEffect(() => {
    let interval;

    if (status === "authenticated") {
      fetchShoes(); // Initial fetch
      interval = setInterval(() => {
        fetchShoes(); // Poll every 10 seconds
      }, 10000); // 10 seconds polling
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [status, fetchShoes]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="returnTable-container">
      {/* Pass shoes data and fetchShoes function to ReturnTable */}
      <ReturnTable shoes={shoes} refreshShoes={fetchShoes} />
    </div>
  );
};

export default Page;
