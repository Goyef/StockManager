import { CreateBooking, GetAllBookings } from "@/services/bookingService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const bookings = await GetAllBookings();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newBooking = await CreateBooking({ 
      startDate: body.startDate, 
      endDate: body.endDate,
      apartmentId: body.apartmentId,
      userId: body.userId,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

