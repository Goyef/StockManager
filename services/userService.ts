import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllUsers(): Promise<User[]> {
    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        throw new Error("Failed to fetch users");
    }
}

export async function GetUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user by ID");
  }
}

export async function CreateUser(data: { name: string; email: string }): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
}
