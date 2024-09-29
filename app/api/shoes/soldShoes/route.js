import connectMongoDB from "@/lib/mongodb";
import Sneaker from "@/models/shoes";
import { NextResponse } from "next/server";

// API route for getting all available shoes
export async function GET() {
  await connectMongoDB();
  const shoes = await Sneaker.find({ availability: "SOLD" });
  return NextResponse.json({ shoes });
}
