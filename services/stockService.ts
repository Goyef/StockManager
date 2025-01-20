import { Booking, PrismaClient, stocks, User } from "@prisma/client";
import JSONbig  from 'json-bigint';

const prisma = new PrismaClient();

enum type {
  medicament,
  materiel
}

 export interface SerializedStocks {
  id_stock: number;
    nom: string;
    description: string;
    quantite_disponible: number;
    type: type;
}

export async function GetAllStocks(): Promise<SerializedStocks[]> {
  try {
      const stocks = await prisma.stocks.findMany();
      const serializedStocks: SerializedStocks[] = JSON.parse(JSONbig.stringify(stocks));
      return serializedStocks;
  } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch stocks");
  }
}


