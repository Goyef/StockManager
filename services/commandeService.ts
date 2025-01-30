import { $Enums, Booking, commandes, PrismaClient, User } from "@prisma/client";
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
export async function GetPendingCommandes(): Promise<SerializedCommandes[]> {
  try {
    const commandes = await prisma.commandes.findMany({
      include: {
        utilisateurs: true,
        stocks: true,
      },
      where: {
        statut: "en_attente",
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
export async function GetCommandegById(
  id_commande: number
): Promise<commandes> {
  try {
    const commande = await prisma.commandes.findUnique({
      where: {
        id_commande: id_commande,
      },
    });
    if (!commande) {
      throw new Error(`Commande with ID ${id_commande} not found`);
    }
    return commande;
  } catch (error) {
    throw new Error("Failed to fetch commande by ID");
  }
}

export async function CreateCommande(data: {
  id_utilisateur: string;
  quantite: string;
  id_stock: string;
}): Promise<commandes> {
  try {
    const commande = await prisma.commandes.create({
      data: {
        id_utilisateur: parseInt(data.id_utilisateur, 10),
        quantite: parseInt(data.quantite, 10),
        id_stock: parseInt(data.id_stock, 10),
      },
    });
    return commande;
  } catch (error) {
    console.error("Error creating commande:", error);
    throw new Error("Failed to create commande");
  }
}
export async function UpdateStatutCommande(data: {
  id_commande: number;
  id_utilisateur?: string;
  statut?: $Enums.statut;
  date_commande?: Date;
  id_stock?: string;
  quantite?: string;
}): Promise<commandes | null> {
  try {
    const updateData: Partial<commandes> = {};

    if (data.id_utilisateur !== undefined) {
      updateData.id_utilisateur = BigInt(data.id_utilisateur);
    }
    if (data.statut !== undefined) {
      updateData.statut = data.statut;
    }
    if (data.date_commande !== undefined) {
      updateData.date_commande = new Date(data.date_commande);
    }
    if (data.id_stock !== undefined) {
      updateData.id_stock = BigInt(data.id_stock);
    }
    if (data.quantite !== undefined) {
      updateData.quantite = BigInt(data.quantite);
    }

    const updatedCommande = await prisma.commandes.update({
      where: { id_commande: BigInt(data.id_commande) },
      data: updateData,
    });

    return updatedCommande;
  } catch (error) {
    console.error("Error updating commande:", error);
    return null;
  }
}
