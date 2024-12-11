import { NextRequest, NextResponse } from "next/server";
import { DeleteBooking, UpdateBooking } from "@/services/bookingService";

//DELETE BOOKING WITH ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const bookingDeleted = await DeleteBooking(id);

    if (!bookingDeleted) {
      return NextResponse.json({ error: "Failed to delete booking." }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Booking deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking." },
      { status: 500 }
    );
  }
}

//UPDATE BOOKING WITH ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    const body = await req.json();

    const { startDate, endDate, apartmentId, userId } = body;

    if (!startDate && !endDate && !apartmentId && !userId) {
      return NextResponse.json(
        { error: "At least one field must be provided for update." },
        { status: 400 }
      );
    }

    const updatedBooking = await UpdateBooking({
      id,
      startDate,
      endDate,
      apartmentId,
      userId,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
  }
}


