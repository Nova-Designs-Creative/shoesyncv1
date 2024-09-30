"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReturnTable from "./returnTable";

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

  const fetchShoes = useCallback(async () => {
    const fetchedShoes = await getShoes();
    setShoes(fetchedShoes);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      alert("Please log in");
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchShoes();
    }
  }, [status, fetchShoes]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="returnTable-container">
      <ReturnTable shoes={shoes} refreshShoes={fetchShoes} />
    </div>
  );
};

export default Page;
