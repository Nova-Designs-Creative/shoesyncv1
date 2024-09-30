import connectMongoDB from "@/lib/mongodb";
import Sneaker from "@/models/shoes";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const shoes = await Sneaker.find({ availability: "SOLD" });

  const response = NextResponse.json({ shoes });
  response.headers.set("Cache-Control", "no-store"); // No cache
  return response;
}
