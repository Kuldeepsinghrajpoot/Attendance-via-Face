import { PrismaClient, Student, Attendance } from "@prisma/client";

const prisma = new PrismaClient();


function getCurrentDate(): string {
  const currentDate = new Date();
  return currentDate.toISOString();
}



// this is a get method of returing the values

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const dateString = url.searchParams.get('date') as string;
  const currentDate = new Date(dateString);

  // Set the time of currentDate to midnight
  currentDate.setHours(0, 0, 0, 0);
  try {
    const response: (Student & { attendances: Attendance[] })[] = await prisma.student.findMany({
      include: {
        attendances: {
          where: {
            attendancevalue: "present",

            createdAt: {
              gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
              lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
            }
          },

        }
      },
    });

    // Get the count of students who have attended on the current date
    const presentStudentsCount = await prisma.attendance.count({
      where: {
        attendancevalue: "present",
        createdAt: {
          gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
          lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1)
        }
      }
    });
    // total students are in the class room
    const totalstudent = await prisma.student.count();


    return new Response(JSON.stringify({ response, presentStudentsCount,totalstudent }));
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
  }
}