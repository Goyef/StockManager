import { GetAllApartment } from "@/services/apartmentService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apartments = await GetAllApartment();
    return NextResponse.json(apartments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
  }
}