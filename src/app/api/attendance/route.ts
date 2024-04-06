import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface StudentRequest {
  student_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const { student_id }: StudentRequest = await request.json();

    const user = await prisma.student.findUnique({
      where: {
        id: student_id // Assuming id is a number, if not, adjust accordingly
      },
    });

    if (!user) {
      return NextResponse.json({ status: 404, error: "User not found" });
    }

    const attendance = await prisma.attendance.findFirst({
      where: {
        studentId: student_id
      }
    });

    if (attendance) {
      return NextResponse.json({ message: 'Already present' });
    }

    const register = await prisma.attendance.create({
      data: {
        studentId: student_id,
        attendancevalue: "present"
      }
    });

    return NextResponse.json(register);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function GET() {
  try {
    // This line queries the database for all students and their attendances
    const response = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            attendancevalue: "present"
          }
        }
      }
    });

    // Filter out students with no 'present' attendance
    const filteredResponse = response.filter(student => student.attendances.length > 0);

    // This line returns the filtered response as JSON
    return NextResponse.json({ response: filteredResponse });
  } catch (error) {
    // If there's an error, it's caught here and logged
    console.error("Error:", error);
    // This line returns a 500 status code if there's an error
    return NextResponse.json({ status: 500 });
  }
}
