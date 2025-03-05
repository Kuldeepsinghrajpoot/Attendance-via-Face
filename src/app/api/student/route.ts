import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../api-error";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
    const id = req.nextUrl.searchParams.get("id");
    if (!id)
        return NextResponse.json(
            new ApiError(401, "ID not found", "ID not found")
        );
    try {
        const users = await prisma.student.findMany({
            where: {
                role: "STUDENT",
            },
            select: {
                Firstname: true,
                lastname: true,
                email: true,
                phone: true,
                rollNumber: true,
                batch: {
                    select: {
                        id: true,
                        batch: true,
                    },
                },
                branch: {
                    select: {
                        id: true,
                        branchName: true,
                    },
                },
                Enroll: {
                    select: {
                        subject: {
                            select: {
                                id: true,
                                subjectName: true,
                                branch: {
                                    select: {
                                        id: true,
                                        branchName: true,

                                    },
                                },
                                scheduleAttendance: {
                                    select: {
                                       id: true,
                                       startTime: true,
                                       endTime: true,
                                    }
                                },
                            },
                        },
                        teacher: {
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                            },
                        },

                    },
                },
            },

        });

        if (users && users.length > 0) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: users,
                    message: "Users retrieved successfully",
                })
            );
        } else {
            return NextResponse.json(
                new ApiError(404, "No users found", "No users found")
            );
        }
    } catch (error) {
        return NextResponse.json(
            new ApiError(500, "Error fetching users", error)
        );
    } finally {
        await prisma.$disconnect();
    }
}
