import { PrismaClient, Student, Attendance } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();
// this is a get method of returing the values

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);

  const dateString = url.searchParams.get('date') as string;
  const currentDate = new Date(dateString) || new Date();

  // Set the time of currentDate to midnight
  currentDate.setHours(0, 0, 0, 0);
  try {
    const response: (Student & { attendances: Attendance[] })[] = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            attendancevalue: "PRESENT",

            createdAt: {
              gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
              lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
            }
          },

        }
      },
      where:{
        role:"STUDENT"
      }
    });

    // Get the count of students who have attended on the current date
    const presentStudentsCount = await prisma.attendance.count({
      where: {
        attendancevalue: "PRESENT",
        createdAt: {
          gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      }
    });
    // total students are in the class room
    const totalstudent = await prisma.student.count({
      where:{
        role:"STUDENT"
      }
    });

    return new Response(JSON.stringify({ response, presentStudentsCount,totalstudent }));
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
  }
}