import schema from "@/models/schema";
// import connectDB from "@/utils/db/database";
import { NextRequest, NextResponse } from "next/server";

interface userInformation {
  email: any
  fullName: any
  password: any
  RollNumber: any
}

//  this api for the student information

import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();


export async function GET(request: { nextUrl: URL }) {
  const id=request.nextUrl.searchParams.get("id")
  // if(id){
  //   return NextResponse.json({message:"something went wrong"})
  // }
  console.log(id)
  try {
    const allUsers = await prisma.question.findMany();
    console.log(allUsers);
    return NextResponse.json({ allUsers })
  } catch (error) {
    console.error('Error retrieving data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email,fullName,password,RollNumber }: userInformation = await request.json();
    console.log(email,fullName,password,RollNumber)
    const Register = await prisma.student.create({
      data: {
        email,fullName,password,RollNumber 
      },
    });

    return NextResponse.json(Register, { status: 200 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}