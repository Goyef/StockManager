import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }
    const utilisateur = await prisma.utilisateurs.findFirst({
      where: {
        email: email
      }
    });
    if (!utilisateur) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }
    const serializedUser = {
      ...utilisateur,
      id_utilisateur: Number(utilisateur.id_utilisateur),
      id_role: Number(utilisateur.id_role)
    };
    return NextResponse.json(serializedUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}





