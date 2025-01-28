import {
  Booking,
  PrismaClient,
  stocks,
  User,
  utilisateurs,
} from "@prisma/client";
import JSONbig from "json-bigint";

const prisma = new PrismaClient();

export interface SerializedUtilisateurs {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  id_role: number;
}

export async function GetAllUtilisateurs(): Promise<SerializedUtilisateurs[]> {
  try {
    const utilisateurs = await prisma.utilisateurs.findMany({
      include: {
        roles: true,
      },
    });
    const SerializedUtilisateurs: SerializedUtilisateurs[] = JSON.parse(
      JSONbig.stringify(utilisateurs)
    );
    return SerializedUtilisateurs;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch stocks");
  }
}
