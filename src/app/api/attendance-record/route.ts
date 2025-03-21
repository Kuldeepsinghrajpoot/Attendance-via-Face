import { PrismaClient, Student, Attendance } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";

const prisma = new PrismaClient();
// this is a get method of returing the values

export async function GET(request: NextRequest): Promise<Response> {
    const url = new URL(request.url);

    const dateString = url.searchParams.get("date") as string;
    const currentDate = new Date(dateString) || new Date();

    // Set the time of currentDate to midnight
    currentDate.setHours(0, 0, 0, 0);
    try {
        const user = await prisma.student.findMany({
            include: {
                Attendance: {
                    where: {
                        status: "PRESENT",
                        createdAt: {
                            gte: new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate()
                            ),
                            lt: new Date(
                                currentDate.getFullYear(),
                                currentDate.getMonth(),
                                currentDate.getDate() + 1
                            ),
                        },
                        subjectId:"67c579d2875f3ef2663a08ac",
                        batchId:"67c579d2875f3ef2663a08ac"
                    },
                },

            },
            where: {
                role: "STUDENT",
            },
        });

        // Get the count of students who have attended on the current date
        const presentStudentsCount = await prisma.attendance.count({
            where: {
                status: "PRESENT",
                createdAt: {
                    gte: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate()
                    ),
                    lt: new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 1
                    ),
                },
            },
        });
        // total students are in the class room
        const totalstudent = await prisma.student.count({
            where: {
                role: "STUDENT",
            },
        });
        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: { user, presentStudentsCount, totalstudent },
                message: "Success",
            })
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            new ApiError(500, "Internal Server Error", error)
        );
    }
}
