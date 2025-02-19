import {
  CreateUtilisateurs,
  GetAllUtilisateurs,
} from "@/services/utilisateurService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const utilisateurs = await GetAllUtilisateurs();

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error("Error fetching utilisateurs:", error);
    return NextResponse.json(
      { error: "Failed to fetch utilisateurs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, prenom, email, password } = body;

    const utilisateur = await CreateUtilisateurs({
      nom,
      prenom,
      email,
      password,
    });
    
    return NextResponse.json({ success: true, utilisateur });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
