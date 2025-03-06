import { Attendance, PrismaClient, Student } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";

const prisma = new PrismaClient();
interface StudentRequest {
    avatar: string;
}

async function getAttendanceForDate(
    studentId: any,
    date: Date
): Promise<Attendance | null> {
    console.log(studentId);
    const attendance = await prisma.attendance.findFirst({
        where: {
            studentId,
            createdAt: {
                gte: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                ),
                lt: new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 1
                ),
            },
        },
    });
    return attendance;
}

export async function POST(req: NextRequest): Promise<Response> {
    const id = req.nextUrl.searchParams.get("id");
    console.log(id);
    if (!id) {
        return NextResponse.json(new ApiError(400, "Bad Request", "ID not provided"));
    }
    try {
        const { avatar, subjectId, scheduleId } = await req.json();
        if (!avatar) {
            return new Response(
                JSON.stringify({ status: 400, error: "Avatar not provided" }),
                { status: 400 }
            );
        }

        const user: Student | null = await prisma.student.findFirst({
            where: {
                avatar: `${avatar}.jpeg`,
                id
            },
        });

        if (!user) {
            return NextResponse.json(
                new ApiError(404, "Not Found", "Student not found") 
            );
        }

        // Check if user has already been marked PRESENT for today's date
        const today = new Date();
        const attendanceForToday = await getAttendanceForDate(user.id, today);

        if (attendanceForToday) {
            return new Response(
                JSON.stringify({ message: "Already PRESENT", id: user.id })
            );
        }

        // If user has not been marked PRESENT for today's date, create a new attendance record
        await prisma.attendance.create({
            data: {
                studentId: user.id,

                attendancevalue: "PRESENT",
            },
        });

        return new Response(
            JSON.stringify({ message: "PRESENT", id: user.id })
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ status: 500, error }), {
            status: 500,
        });
    }
}

export async function GET(): Promise<Response> {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    try {
        const response = await prisma.student.findMany({
            include: {
                Attendance: {
                    where: {
                        attendancevalue: "PRESENT",

                        createdAt: {
                            gte: currentDate, // Get attendance records from the current date onwards
                            lt: new Date(currentDate.getMonth()), // up to the end of the current date
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
            where: {
                role: "STUDENT",
            },
        });
        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: response,
                message: "Fetched successfully",
            })
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            new ApiError(500, "Internal Server Error", error)
        );
    }
}
