import React from "react";
import SoldShoesForm from "./SoldShoesForm";

//fetch data from id
const fetchShoesById = async (id) => {
  try {
    const res = await fetch(`https://shoesyncv1.vercel.app/api/shoes/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch shoes");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

const page = async ({ params }) => {
  const { id } = params;
  const { shoes } = await fetchShoesById(id);
  const { owner, number, sku, name, size, price, location } = shoes;
  return (
    <SoldShoesForm
      id={id}
      owner={owner}
      number={number}
      sku={sku}
      name={name}
      size={size}
      price={price}
      location={location}
    />
  );
};

export default page;
