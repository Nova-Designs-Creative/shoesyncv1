import connectMongoDB from "@/lib/mongodb";
import Sneaker from "@/models/shoes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const shoes = await Sneaker.find({ availability: "SOLD" }).sort({
      updatedAt: -1,
    }); // Sorting by latest updates
    console.log("Fetched shoes data: ", shoes); // Debugging line

    const response = NextResponse.json({ shoes });
    response.headers.append("Cache-Control", "no-store"); // Use append to avoid issues
    return response;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
