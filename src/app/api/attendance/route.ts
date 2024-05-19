import { Attendance, PrismaClient, Student } from "@prisma/client";

const prisma = new PrismaClient();
interface StudentRequest {
  avatar: string;
}

async function getAttendanceForDate(studentId: any, date: Date): Promise<Attendance | null> {
  const attendance = await prisma.attendance.findFirst({
    where: {
      studentId,
      createdAt: {
        gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    }
  });
  return attendance;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { avatar }: StudentRequest = await request.json();
    // console.log(avatar)
    if (!avatar) {
      return new Response(JSON.stringify({ status: 400, error: "Avatar not provided" }), { status: 400 });
    }

    const user: Student | null = await prisma.student.findUnique({
      where: { avatar: `${avatar}.jpeg` },
    });

    if (!user) {
      return new Response(JSON.stringify({ status: 404, error: "User not found" }), { status: 404 });
    }

    // Check if user has already been marked present for today's date
    const today = new Date();
    const attendanceForToday = await getAttendanceForDate(user.id, today);

    if (attendanceForToday) {
      return new Response(JSON.stringify({ message: "Already present" }));
    }

    // If user has not been marked present for today's date, create a new attendance record
    await prisma.attendance.create({
      data: {
        studentId: user.id,
        attendancevalue: "present"
      }
    });

    return new Response(JSON.stringify({ message: "Present" }));
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
  }
}

export async function GET(): Promise<Response> {

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
    try {
        const response: (Student & { attendances: Attendance[] })[] = await prisma.student.findMany({
            include: {
                attendances: {
                    where: { attendancevalue: "present",

                    createdAt: {
                      gte: currentDate, // Get attendance records from the current date onwards
                      lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) // up to the end of the current date
                  }
                     },
                    orderBy: { createdAt: "desc" }
                }
            },
        });


      

    

        return new Response(JSON.stringify({ response}));
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ status: 500, error: "Internal Server Error" }), { status: 500 });
    }
}

