import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";

const prisma = new PrismaClient()
export async function GET(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json(new ApiError(403, "", "id not found",));

    try {
        const [student] = await Promise.all([
            prisma.student.findMany({
                where: {
                    id,
                },
                include: {
                    Enroll: {
                        select: {
                            session: true,
                            year: true,
                            batch: {
                                select: {
                                    id: true,
                                    batch: true,
                                }
                            },
                            subject: {
                                select: {
                                    id: true,
                                    subjectName: true,
                                    branch: {
                                        select: {
                                            id: true,
                                            branchName: true,
                                        }
                                    },
                                    teacher: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            phone: true,
                                        }
                                    },
                                    scheduleAttendance: {
                                        select: {
                                            id: true,
                                            startTime: true,
                                            endTime: true,
                                        }
                                    },
                                    attendance: {
                                        select: {
                                            id: true,
                                            attendancevalue: true,
                                            createdAt: true,
                                        }
                                    }
                                },
                            },
                            teacher: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                    phone: true,
                                }
                            },
                        }
                    },
                    Attendance: {
                        select: {
                            id: true,
                            attendancevalue: true,
                            createdAt: true,

                        },


                    }
                }
            })
        ])
        return NextResponse.json(new ApiResponse({ status: 200, data: student }));
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json(new ApiError(403, "Something went wrong", error));

    }
}