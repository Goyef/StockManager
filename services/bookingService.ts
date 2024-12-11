import { Booking, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllBookings(): Promise<Booking[]> {
  try {
      const bookings = await prisma.booking.findMany({
          include: {
              user: true,
              apartment: true,
          },
      });
      return bookings;
  } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch bookings");
  }
}

export async function GetBookingById(id: string) : Promise<Booking> {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        apartment: true,
      },
    });
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    return booking;
  } catch (error) {
    throw new Error("Failed to fetch booking by ID");
  }
}

export async function GetBookingsByUser(user: User): Promise<Booking[]> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        id: user?.id,
      },
      include: {
        user: true,
        apartment: true,
      },
    });
    if (!bookings) {
      throw new Error(`Bookings for the User ${user} not found`);
    }
    return bookings;
  } catch (error) {
    throw new Error("Failed to fetch bookings by user");
  }
}

export async function CreateBooking(data: { endDate: Date; startDate: Date; apartmentId: string, userId: string }): Promise<Booking> {
    try {
      const booking = await prisma.booking.create({
        data: {
          endDate: data.endDate,
          startDate: data.startDate,
          apartmentId: data.apartmentId,
          userId: data.userId,
        },
      });
      return booking;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking");
    }
}

export async function UpdateBooking(data: { 
  id: string; 
  endDate?: Date; 
  startDate?: Date; 
  apartmentId?: string; 
  userId?: string; 
}): Promise<Booking | null> {
  try {

    const updatedBooking = await prisma.booking.update({
      where: { id: data.id }, 
      data: {
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.apartmentId && { apartmentId: data.apartmentId }),
        ...(data.userId && { userId: data.userId }),
      },
    });

    return updatedBooking; 
  } catch (error) {
    console.error("Error updating booking:", error);
    return null;
  }
}

export async function DeleteBooking(id: string): Promise<boolean> {
  try {

    // Vérifie si la réservation existe
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) return false;

    // Supprime la réservation
    await prisma.booking.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    return false;
  }
}