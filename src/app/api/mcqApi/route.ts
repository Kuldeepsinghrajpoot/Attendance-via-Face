import schema from "@/models/schema";
// import connectDB from "@/utils/db/database";
import { NextRequest, NextResponse } from "next/server";

interface Question {
  Question: any;
  option1: any;
  option2: any;
  option3: any; 
  option4: any
}


import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();


export async function GET() {
  try {
    const question = await prisma.question.findMany();
    // console.log(allUsers);
    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error retrieving data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { Question, option1, option2, option3, option4 }: { Question: string, option1: string, option2: string, option3: string, option4: string } = await request.json();

    // console.log(fullName);

    const newAttendance = await prisma.question.create({

      data: {Question, option1, option2, option3, option4 },
      // Add other properties as needed

    });

    return NextResponse.json(newAttendance, { status: 200 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}