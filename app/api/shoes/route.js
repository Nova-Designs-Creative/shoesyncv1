import connectMongoDB from "@/lib/mongodb";
import Sneaker from "@/models/shoes";

import { NextResponse } from "next/server";

// API route for getting all available shoes
export async function GET() {
  await connectMongoDB();
  const shoes = await Sneaker.find({ availability: "AVAIL" });
  return NextResponse.json({ shoes });
}

export async function POST(request) {
  const { owner, number, name, price, size, location, sku, availability } =
    await request.json();
  await connectMongoDB();
  await Sneaker.create({
    owner,
    number,
    name,
    price,
    size,
    location,
    sku,
    availability,
  });
  return NextResponse.json({ message: "Shoe Created" }, { status: 201 });
}

//delete by id
export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await connectMongoDB();
  await Sneaker.findByIdAndDelete(id);
  return NextResponse.json({ message: "Shoes deleted" }, { status: 200 });
}
