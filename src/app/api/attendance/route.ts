import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(request:NextRequest) {
  try {
    const {student_id}= await request.json();
console.log(student_id)
  
const user = await prisma.student.findUnique({
    where: {
      id: student_id // Assuming id is a number, if not, adjust accordingly
    }
  });
  if (user) {
    
      return NextResponse.json(student_id)
  }
  } catch (error) {
    return NextResponse.json({status:404})
  }
}