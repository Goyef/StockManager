import { UpdateRoleUtilisateur } from "@/services/utilisateurService";
import { $Enums } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Utilisateur ID is required." },
        { status: 400 }
      );
    }

    const updatedUtilisateur = await UpdateRoleUtilisateur(id);

    if (!updatedUtilisateur) {
      return NextResponse.json(
        { error: "Failed to update utilisateur." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedUtilisateur, { status: 200 });
  } catch (error) {
    console.error("Error updating utilisateurs:", error);
    return NextResponse.json(
      { error: ` ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
