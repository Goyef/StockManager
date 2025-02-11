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
}): Promise<SerializedCommandes | null> {
  try {
    const commande = await prisma.commandes.create({
      data: {
        id_utilisateur: parseInt(data.id_utilisateur, 10),
        quantite: parseInt(data.quantite, 10),
        id_stock: parseInt(data.id_stock, 10),
      },
    });
    const serializedCommandes: SerializedCommandes = JSON.parse(
      JSONbig.stringify(commande)
    );
    return serializedCommandes;
  } catch (error) {
    console.error("Error creating commande:", error);
    throw new Error("Failed to create commande");
  }
}
export async function CreateCommandeAdmin(data: {
  id_utilisateur: string;
  quantite: string;
  id_stock: string;
}): Promise<SerializedCommandes | null> {
  try {
    const commande = await prisma.commandes.create({
      data: {
        id_utilisateur: parseInt(data.id_utilisateur, 10),
        quantite: parseInt(data.quantite, 10),
        statut: "validee",
        id_stock: parseInt(data.id_stock, 10),
      },
    });
    const serializedCommandes: SerializedCommandes = JSON.parse(
      JSONbig.stringify(commande)
    );
    const stock = await prisma.stocks.findUnique({
      where: { id_stock: BigInt(data.id_stock) },
    });

    if (!stock) {
      throw new Error("Stock non trouvée.");
    }
    await prisma.stocks.update({
      where: { id_stock: BigInt(data.id_stock) },
      data: {
        quantite_disponible: stock.quantite_disponible + BigInt(data.quantite),
      },
    });

    await prisma.mouvements.create({
      data: {
        id_stock: BigInt(data.id_stock),
        type_mouvement: "entree",
        quantite: BigInt(data.quantite),
        id_commande: BigInt(commande.id_commande),
      },
    });

    return serializedCommandes;
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
}): Promise<SerializedCommandes | null> {
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

    if (data.statut === "validee" && data.id_stock && data.quantite) {
      const stock = await prisma.stocks.findUnique({
        where: { id_stock: BigInt(data.id_stock) },
      });

      if (!stock) {
        throw new Error("Stock non trouvée.");
      }

      if (stock.quantite_disponible < BigInt(data.quantite)) {
        throw new Error("Quantité non valide.");
      }

      await prisma.stocks.update({
        where: { id_stock: BigInt(data.id_stock) },
        data: {
          quantite_disponible:
            stock.quantite_disponible - BigInt(data.quantite),
        },
      });

      await prisma.mouvements.create({
        data: {
          id_stock: BigInt(data.id_stock),
          type_mouvement: "sortie",
          quantite: BigInt(data.quantite),
          id_commande: BigInt(data.id_commande),
        },
      });
    }

    const updatedCommande = await prisma.commandes.update({
      where: { id_commande: BigInt(data.id_commande) },
      data: updateData,
    });
    const serializedCommandes: SerializedCommandes = JSON.parse(
      JSONbig.stringify(updatedCommande)
    );
    return serializedCommandes;
  } catch (error) {
    console.error("Error updating commande:", error);
    throw error;
  }
}

export async function DeleteCommande(id: number): Promise<boolean> {
  try {
    const commande = await prisma.commandes.findUnique({
      where: { id_commande: BigInt(id) },
    });

    if (!commande) return false;

    await prisma.commandes.delete({
      where: { id_commande: BigInt(id) },
    });

    return true;
  } catch (error) {
    return false;
  }
}
