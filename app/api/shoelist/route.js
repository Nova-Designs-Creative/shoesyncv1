import connectMongoDB from "@/lib/mongodb";
import ShoeModel from "@/models/brand";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const ShoeList = await ShoeModel.find();
  return NextResponse.json({ ShoeList });
}
