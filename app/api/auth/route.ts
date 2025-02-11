import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/services/authService";

export async function GET() {
  try {
    const data = await getUser();
    console.log("User data:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
