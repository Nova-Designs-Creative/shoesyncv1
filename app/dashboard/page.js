"use client";

import React, { createContext, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react"; // Import signOut here
import DashboardSummary from "./components/DashboardSummary";
import "./dashboardStyle.css";
import DashboardTable from "./components/DashboardTable";
import { useRouter } from "next/navigation";

// Create context
export const AllAvailableShoesContext = createContext();
export const AllSoldShoesContext = createContext();

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allAvailableShoesState, setAllAvailableShoesState] = useState([]);
  const [allSoldShoesState, setAllSoldShoesState] = useState([]);

  useEffect(() => {
    // Redirect to "/" if the user is not authenticated
    if (status === "unauthenticated") {
      alert("Please login");
      router?.push("/");
    }
  }, [status, router]);

  // Fetch data for all available shoes
  useEffect(() => {
    const fetchAvailableShoes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/shoes", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch shoes");
        }

        const data = await res.json();
        setAllAvailableShoesState(data.shoes); // Assuming data.shoes contains the shoe data
      } catch (error) {
        console.log("Error loading shoes: ", error);
        setAllAvailableShoesState([]); // Fallback to empty array on error
      }
    };

    fetchAvailableShoes();
  }, []);

  // Fetch data for sold shoes
  useEffect(() => {
    const fetchSoldShoes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/shoes/soldShoes", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch shoes");
        }

        const data = await res.json();
        setAllSoldShoesState(data.shoes); // Assuming data.shoes contains the shoe data
      } catch (error) {
        console.log("Error loading shoes: ", error);
        setAllSoldShoesState([]); // Fallback to empty array on error
      }
    };

    fetchSoldShoes();
  }, []);

  if (status === "loading") {
    // Optionally, render a loading spinner while session status is loading
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      {session && ( // Ensure content is only displayed when the user is authenticated
        <AllAvailableShoesContext.Provider value={allAvailableShoesState}>
          <AllSoldShoesContext.Provider value={allSoldShoesState}>
            <DashboardSummary />
            <DashboardTable />
            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })} // Redirect to home after sign out
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </AllSoldShoesContext.Provider>
        </AllAvailableShoesContext.Provider>
      )}
    </div>
  );
};

export default Page;
