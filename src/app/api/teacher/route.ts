import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function POST(req: NextRequest, res: NextResponse) {
    const { role, email, password, Firstname, phone } = await req.json();

    if ([role, email, password].some((e) => e === "")) {
        return NextResponse.json(new ApiError(402, "invalid details", ""));
    }

    try {
        const teacher = await prisma.teacher.create({
            data: {
                role,
                email,
                password,
                Firstname,
                phone,
            },
        });

        if (teacher) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: "account is created",
                    message: "successfully",
                })
            );
        }
    } catch (error) {
        return NextResponse.json(new ApiError(401, "your not authorized"));
    } finally {
        prisma.$disconnect();
    }
}

// get data of teacher

export async function GET(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(new ApiError(403, "you are not authorised"));
    }
    try {
        const getTeachers = await prisma.teacher.findMany({
            select: {
                id: true,
                Firstname: true,
                email: true,
                subject: true,
            },
        });
        if (getTeachers) {
            return NextResponse.json(
                new ApiResponse({
                    status: 200,
                    data: getTeachers,
                    message: "successfully",
                })
            );
        }
    } catch (error) {
        return NextResponse.json(new ApiError(401, "unauthorized user", ""));
    }finally{
        prisma.$disconnect()
    }
}
