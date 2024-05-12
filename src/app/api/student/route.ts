import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(): Promise<any> {
  try {
    const users = await prisma.student.findMany({});

    if (users && users.length > 0) {
      return NextResponse.json({ users });
    } else {
      console.log('Users not found');
      return NextResponse.json({ message: "Users not found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving users data:', error);
    return NextResponse.json({ message: "Error retrieving users data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
