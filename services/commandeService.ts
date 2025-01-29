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

export async function CreateCommande(data: {
  id_utilisateur: string;
  quantite: string;
  id_stock: string;
}): Promise<SerializedCommandes> {
  try {
    const commande = await prisma.commandes.create({
      data: {
        id_utilisateur: parseInt(data.id_utilisateur, 10),
        quantite: parseInt(data.quantite, 10),
        id_stock: parseInt(data.id_stock, 10),
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

export async function UpdateCommande(data: {
  id_commande: number;
  id_utilisateur?: string;
  statut?: string;
  date_commande?: Date;
  id_stock?: string;
  quantite?: number;
}): Promise<commandes | null> {
  try {
    const updatedCommande = await prisma.commandes.update({
      where: { id_commande: data.id_commande },
      data: {
        ...(data.id_utilisateur && { statut: data.id_utilisateur }),
        ...(data.statut && { statut: data.statut }),
        ...(data.date_commande && { statut: data.date_commande }),
        ...(data.id_stock && { id_stock: data.id_stock }),
        ...(data.quantite && { quantite: data.quantite }),
      },
    });

    return updatedCommande;
  } catch (error) {
    console.error("Error updating commande:", error);
    return null;
  }
}
