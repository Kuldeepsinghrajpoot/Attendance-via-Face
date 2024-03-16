'use server';

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { subject:[]}}) {
  try {
    const s:any[] = params.subject;
    const subjectName = s[0]
    const viceSubject = s[1]
    // const {subjectone,viceSubject}= subject
    // return NextResponse.json({subjectName,viceSubject})

    // Find the Subject
    const foundSubjects = await prisma.subject.findMany({
      where: {
        subjectName
      },
      include: {
        viceSubjects: {
          where:{
            id:viceSubject
          },include:{
            questions:true
          }
        }
      }
    });

    return NextResponse.json({ subject: foundSubjects });
  } catch (error) {
    console.error('Error retrieving subject and questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
