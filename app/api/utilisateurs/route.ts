import { CreateBooking, GetAllBookings } from "@/services/bookingService";
import { GetAllStocks } from "@/services/stockService";
import { GetAllUtilisateurs } from "@/services/utilsateurService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const utilisateurs = await GetAllUtilisateurs();

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error("Error fetching utilisateurs:", error);
    return NextResponse.json(
      { error: "Failed to fetch utilisateurs" },
      { status: 500 }
    );
  }
}
