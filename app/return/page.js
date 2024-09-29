"use client";
import React, { useEffect, useState } from "react";
import ReturnTable from "./returnTable";
import { useSession } from "next-auth/react"; // Import useSession
import { useRouter } from "next/navigation"; // Import useRouter

// Fetch data function
const getShoes = async () => {
  try {
    const res = await fetch("https://shoesyncv1.vercel.app/api/shoes/soldShoes", {
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

const Page = () => {
  // Capitalize the component name
  const { data: session, status } = useSession(); // Use useSession to get the session data
  const router = useRouter(); // Initialize router
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    // Check authentication status
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/"); // Redirect to home page
    }
  }, [status]);

  useEffect(() => {
    const fetchShoes = async () => {
      const data = await getShoes();
      setShoes(data?.shoes);
    };

    fetchShoes();
  }, []);

  return (
    <div className="returnTable-container">
      <ReturnTable shoes={shoes} />
    </div>
  );
};

export default Page; // Export the capitalized component
