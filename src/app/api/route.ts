
// import connectDB from "@/utils/db/database";
import { NextRequest, NextResponse } from "next/server";



//  this api for the student information

import { PrismaClient, Student } from '@prisma/client';
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();


export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")
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
    const {id,email,Firstname,lastname,avatar,password,rollNumber}: Student = await request.json();
    console.log(email, Firstname, password, rollNumber)
    const Register = await prisma.student.create({data: {id,email,Firstname,lastname,avatar,password,rollNumber}});

    return NextResponse.json(Register, { status: 200 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}