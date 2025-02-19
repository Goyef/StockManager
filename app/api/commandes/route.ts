import { CreateCommande, GetAllCommandes } from "@/services/commandeService";
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
       
    const commandes = await GetAllCommandes(utilisateur.id_utilisateur);
    return NextResponse.json(commandes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCommande = await CreateCommande({
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
