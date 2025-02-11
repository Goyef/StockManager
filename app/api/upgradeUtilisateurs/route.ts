import { GetAllUsersUtilisateurs } from "@/services/utilisateurService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const utilisateurs = await GetAllUsersUtilisateurs();

    return NextResponse.json(utilisateurs, { status: 200 });
  } catch (error) {
    console.error("Error fetching utilisateurs:", error);
    return NextResponse.json(
      { error: "Failed to fetch utilisateurs" },
      { status: 500 }
    );
  }
}
