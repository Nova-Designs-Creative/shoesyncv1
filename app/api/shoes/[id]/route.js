import connectMongoDB from "@/lib/mongodb";
import Shoes from "@/models/shoes";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;
  await connectMongoDB();
  const shoes = await Shoes.findOne({ _id: id });
  return NextResponse.json({ shoes }, { status: 200 });
}

export async function PUT(request, { params }) {
  const { id } = params; // Extract the shoe ID from the params

  const {
    newNumber: number,
    newPrice: price,
    newName: name,
    newSku: sku,
    newSize: size,
    newOwner: owner,
    newLocation: location,
    newAvailability: availability,
    newDateSold: dateSold, // Add this if you want to update the sold date
    newPriceSold: priceSold, // Add this if you want to update the sold price
    newSoldTo: soldTo, // Add this if you want to update who it was sold to
    newSoldBy: soldBy, // Add this if you want to update who sold it
    newProfit: profit, // Add this if you want to update the profit
    newCommissions: commissions, // Assuming this is an object { fitz: value, bryan: value, ashley: value }
  } = await request.json();

  // Connect to MongoDB
  await connectMongoDB();

  try {
    // Update the shoe document in the database
    const updateData = {
      number,
      price,
      name,
      sku,
      size,
      owner,
      location,
      availability,
      dateSold: dateSold || null, // Default to null if not provided
      priceSold: priceSold || null, // Default to null if not provided
      soldTo: soldTo || null, // Default to null if not provided
      soldBy: soldBy || null, // Default to null if not provided
      profit: profit || null, // Default to null if not provided
      ...(commissions && {
        "commissions.fitz": commissions.fitz || 0,
        "commissions.bryan": commissions.bryan || 0,
        "commissions.ashley": commissions.ashley || 0,
      }),
    };

    await Shoes.findByIdAndUpdate(id, updateData);

    return NextResponse.json(
      { message: "Shoe updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating shoe:", error);
    return NextResponse.json(
      { message: "Failed to update shoe." },
      { status: 500 }
    );
  }
}
