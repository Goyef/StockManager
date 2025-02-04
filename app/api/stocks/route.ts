import { CreateBooking, GetAllBookings } from "@/services/bookingService";
import { CreateStocks, GetAllStocks } from "@/services/stockService";
import { Description } from "@radix-ui/react-toast";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const stocks = await GetAllStocks();

    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newStock = await CreateStocks({
      nom: body.nom,
      description: body.description,
      type: body.type,
    });
    return NextResponse.json(newStock, { status: 201 });
  } catch (error) {
    console.error("Error creating stock:", error);
    return NextResponse.json(
      { error: "Failed to create stock" },
      { status: 500 }
    );
  }
}
