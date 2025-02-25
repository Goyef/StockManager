import { DeleteCommande } from "@/services/commandeService";
import { NextRequest, NextResponse } from "next/server";

type routeContext = {
  params: Promise<{ id: number }>
};

export async function DELETE(
  req: NextRequest,
  context: routeContext
) {
  try {
    const params = await context.params;
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Commande_id est requis." },
        { status: 400 }
      );
    }

    const commandeDeleted = await DeleteCommande(id);

    if (!commandeDeleted) {
      return NextResponse.json({
        error: "Erreur lors de la suppression commande.",
      });
    }

    return NextResponse.json(
      { message: "Commande supprimer avec succèss." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "erreur lors de la suppression commande." },
      { status: 500 }
    );
  }
}
