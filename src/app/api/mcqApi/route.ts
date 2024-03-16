
// import connectDB from "@/utils/db/database";
import { NextRequest, NextResponse } from "next/server";

interface Question {
  Question: any|undefined;
  option1: any|undefined;
  option2: any|undefined;
  option3: any|undefined;
  option4: any|undefined;
  subjectName: any|undefined ;
  vicesubjectName: any|undefined ;

}


import { PrismaClient } from '@prisma/client';
export const dynamic = 'force-dynamic'
const prisma = new PrismaClient();


export async function POST(request: NextRequest) {
  try {
    const { Question, option1, option2, option3, option4, subjectName, vicesubjectName }: Question = await request.json();

    // Find or create the Subject
    let subject = await prisma.subject.findFirst({
      where: {
        subjectName: subjectName,
      },
    });

    if (!subject) {
      // If the subject doesn't exist, create it
      subject = await prisma.subject.create({
        data: {
          subjectName: subjectName,
        },
      });
    }

    // Find or create the Vicesubject associated with the Subject
    let vicesubject = await prisma.vicesubject.findFirst({
      where: {
        subjectId: subject.id,
        subjectName: vicesubjectName,
      },
    });

    if (!vicesubject) {
      // If the vicesubject doesn't exist, create it
      vicesubject = await prisma.vicesubject.create({
        data: {
          subjectName: vicesubjectName,
          subject: { connect: { id: subject.id } }, // Connect to the Subject
        },
      });
    }

    // Create the question associated with the vicesubject
    const newQuestion = await prisma.question.create({
      data: {
        Question,
        option1,
        option2,
        option3,
        option4,
        viceSubjectId: vicesubject.id, // Use viceSubjectId instead of viceSubject
      },
      include: {
        viceSubject: true,
      },
    });

    return NextResponse.json(newQuestion, { status: 200 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}





export async function GET(request: NextRequest) {
  // console.log(request.nextUrl.searchParams.get('quiz'))
  // console.log(request.nextUrl.searchParams.get('id'))

  //   return NextResponse.json({status:200})
  try {
    const subjectName: any|undefined = request.nextUrl.searchParams.get('id');
    const vicesubjectName: any|undefined = request.nextUrl.searchParams.get('quiz');

    // Find the Subject
    const subject = await prisma.subject.findMany(
      // where: {
      //   subjectName,
      // },
      // include: {
      //   viceSubjects: {
      //     where: {
      //       subjectName: vicesubjectName,
      //     },
      //     include: {
      //       questions: true,
      //     },
      //   },
      // },
    );

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ subject });
  } catch (error) {
    console.error('Error retrieving subject and questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
