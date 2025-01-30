import { NextRequest, NextResponse } from "next/server";
import { UpdateStatutCommande } from "@/services/commandeService"; // Assurez-vous d'importer la fonction
import { $Enums } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id_commande: number } }
) {
  try {
    const { id_commande } = params;

    if (!id_commande) {
      return NextResponse.json(
        { error: "Commande ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { statut } = body;

    if (!statut) {
      return NextResponse.json(
        { error: "Statut is required for update." },
        { status: 400 }
      );
    }

    const updatedCommande = await UpdateStatutCommande({
      id_commande: id_commande,
      statut: statut as $Enums.statut,
    });

    if (!updatedCommande) {
      return NextResponse.json(
        { error: "Failed to update commande." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCommande, { status: 200 });
  } catch (error) {
    console.error("Error updating commande:", error);
    return NextResponse.json(
      { error: "Failed to update commande." },
      { status: 500 }
    );
  }
}
