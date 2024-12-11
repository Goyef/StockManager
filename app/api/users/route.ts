import { GetAllUsers, CreateUser } from "@/services/userService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const employees = await GetAllUsers();
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields: name or email" },
        { status: 400 }
      );
    }

    const newUser = await CreateUser({ 
      name: body.name, 
      email: body.email 
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

