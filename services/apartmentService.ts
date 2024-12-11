import { Apartment, Booking, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllApartment(): Promise<Apartment[]> {
  try {
      const apartment = await prisma.apartment.findMany();
      return apartment;
  } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch apartment");
  }
}