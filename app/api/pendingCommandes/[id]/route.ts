import { NextRequest, NextResponse } from "next/server";
import { UpdateStatutCommande } from "@/services/commandeService";
import { $Enums } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Commande ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { statut, id_stock, quantite } = body;

    if (!statut) {
      return NextResponse.json(
        { error: "Statut is required for update." },
        { status: 400 }
      );
    }
    const updatedCommande = await UpdateStatutCommande({
      id_commande: id,
      statut: statut as $Enums.statut,
      id_stock: id_stock,
      quantite: quantite,
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
      { error: ` ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
