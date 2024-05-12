import { PrismaClient, Student, Attendance } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();
interface StudentRequest {
  avatar: string;
}

export async function POST(request: Request): Promise<Response> {

 

  try {
    const { avatar }: StudentRequest = await request.json();

    if (!avatar) {
      return Response.json({ status: 400, error: "user not found" });
    }

    const user: Student | null = await prisma.student.findUnique({
      where: {
        avatar: `${avatar}.jpeg`
      },
    });

    if (!user) {
      return Response.json({ status: 404, error: "User not found" });
    }

    const attendance: Attendance | null = await prisma.attendance.findFirst({
      where: {
        studentId: user.id
      }
    });

    if (attendance) {
      return Response.json({ message: "Already present" });
    }

    await prisma.attendance.create({
      data: {
        studentId: user.id,
        attendancevalue: "present"
      }
    });

    return Response.json({ message: "Present" });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ status: 500, error: "Internal Server Error" });
  }
}

export async function GET(): Promise<Response> {
  try {
    const response: (Student & { attendances: Attendance[] })[] = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            attendancevalue: "present"
          }
        }
      },
      
      // select: {
      //   id: true,
      //   email: true,
      //   Firstname: true,
      //   lastname: true,
      //   avatar: true,
      //   rollNumber: true,
      //   attendances: true
      // }
    });

    return Response.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ status: 500, error: "Internal Server Error" });
  }
}
