import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") as string;
  // return NextResponse.json({'sfjklsflsflksfjs':'ksfljsalfklsfsklf'})
  try {
    const user = await prisma.student.findUnique({
      where: {
        id: id // Assuming id is a number, if not, adjust accordingly
      }
    });

    if (user) {
      return NextResponse.json({ user });
    } else {
      console.log('User not found');
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return NextResponse.json({ message: "Error retrieving user data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
