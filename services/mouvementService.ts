import { Booking, PrismaClient, stocks, User } from "@prisma/client";
import JSONbig from "json-bigint";

const prisma = new PrismaClient();

enum type_mouvement {
  entree,
  sortie,
}

export interface SerializedMouvements {
  id_mouvement: number;
  id_stock: number;
  type_mouvement: type_mouvement;
  quantite: number;
  date_mouvement: string;
  id_commande: number;
}

export async function GetAllMouvements(): Promise<SerializedMouvements[]> {
  try {
    const mouvements = await prisma.mouvements.findMany({
      include: {
        stocks: true,
      },
    });
    const serializedMouvements: SerializedMouvements[] = JSON.parse(
      JSONbig.stringify(mouvements)
    );
    return serializedMouvements;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch mouvements");
  }
}
