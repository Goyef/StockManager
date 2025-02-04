import {
  CreateCommande,
  CreateCommandeAdmin,
  GetAllCommandes,
} from "@/services/commandeService";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCommande = await CreateCommandeAdmin({
      id_utilisateur: body.id_utilisateur,
      quantite: body.quantite,
      id_stock: body.id_stock,
    });
    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error("Error creating commande:", error);
    return NextResponse.json(
      { error: "Failed to create commande" },
      { status: 500 }
    );
  }
}
