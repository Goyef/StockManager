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
export async function GetBookingById(id: string) {
  try {
    const user = await prisma.booking.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch booking by ID");
  }
}

export async function GetBookingsByUser(user: User) {
  try {
    const bookings = await prisma.booking.findUnique({
      where: {
        id: user?.id,
      },
    });
    if (!user) {
      throw new Error(`Bookings for the User ${user} not found`);
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch bookings by user");
  }
}

export async function CreateBooking(data: { name: string; email: string }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
}
