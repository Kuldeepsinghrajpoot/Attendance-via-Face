import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../api-error";
import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../api-response";

interface subject {
    subject: string;
    branch: string;
    year: string;
}

const prisma = new PrismaClient();
export async function POST(req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
        return NextResponse.json(new ApiError(401, "user not authorized"));
    }
    const { subject, branch, year }: subject = await req.json();
    if ([subject, branch, year].some((e) => e === "")) {
        return NextResponse.json(new ApiError(402, "invalid details"));
    }

    try {
        const response = await prisma.subject.create({
            data: {
                subjectName: subject,
                Branch: {
                    connect: {
                        id: branch,
                    },
                },
            },
        });

        if (response) {
            return NextResponse.json(
                new ApiResponse({
                    status: 201,
                    data: "subject created successfully",
                })
            );
        }
    } catch (error) {
        return NextResponse.json(new ApiError(403, "somethong went wrong"));
    } finally {
        prisma.$disconnect();
    }
}
