import { Booking, commandes, PrismaClient, User } from "@prisma/client";
import JSONbig from "json-bigint";

const prisma = new PrismaClient();

enum statut {
  en_attente,
  validee,
  invalidee,
}

export interface SerializedCommandes {
  id_commande: number;
  id_stock: number;
  id_utilisateur: number;
  statut: statut;
  date_commande: string;
  quantite: number;
}

export async function GetAllCommandes(): Promise<SerializedCommandes[]> {
  try {
    const commandes = await prisma.commandes.findMany({
      include: {
        utilisateurs: true,
        stocks: true,
      },
    });
    const serializedCommandes: SerializedCommandes[] = JSON.parse(
      JSONbig.stringify(commandes)
    );

    return serializedCommandes;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch commandes");
  }
}

export async function GetBookingById(id: string): Promise<Booking> {
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

export async function CreateCommande(data: {
  id_utilisateur: number;
  quantite: number;
  id_stock: number;
}): Promise<SerializedCommandes> {
  try {
    const commande = await prisma.commandes.create({
      data: {
        id_utilisateur: data.id_utilisateur,
        quantit_: data.quantite,
        id_stock: data.id_stock,
      },
    });
    const serializedCommande: SerializedCommandes = JSON.parse(
      JSONbig.stringify(commande)
    );
    return serializedCommande;
  } catch (error) {
    console.error("Error creating commande:", error);
    throw new Error("Failed to create commande");
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
