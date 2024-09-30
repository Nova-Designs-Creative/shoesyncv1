"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReturnTable from "./returnTable";

// Fetch data function
const getShoes = async () => {
  try {
    const res = await fetch(
      "https://shoesyncv1.vercel.app/api/shoes/soldShoes",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    const data = await res.json();
    return data.shoes || []; // Ensure we always return an array
  } catch (error) {
    console.error("Error loading shoes: ", error);
    return []; // Return an empty array in case of error
  }
};

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchShoes = async () => {
      const fetchedShoes = await getShoes();
      setShoes(fetchedShoes);
    };

    if (status === "authenticated") {
      fetchShoes();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null; // or a message, if you prefer
  }

  return (
    <div className="returnTable-container">
      <ReturnTable shoes={shoes} />
    </div>
  );
};

export default Page;
