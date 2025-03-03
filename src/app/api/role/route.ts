import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "../api-response";
import { ApiError } from "../api-error";
import { PrismaClient, Roles } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const id = new URL(req.url).searchParams.get("id");
        console.log(id);

        if (!id) {
            return NextResponse.json(
                new ApiError(401, "ID not found", "ID not found")
            );
        }

        const data = await req.json();
        const { email, role, password, firstName, phone, lastName } = data?.values;

        console.log(data);

        if (
            ![email, role, password, firstName, phone, lastName].every(
                (value) => value
            )
        ) {
            return NextResponse.json(
                new ApiError(402, "Invalid details", "Invalid details")
            );
        }

        // Check if email is already registered
        const checkEmail = await prisma.roles.findUnique({ where: { email } });
        if (checkEmail) {
            return NextResponse.json(
                new ApiError(402, "", "Email already registered")
            );
        }

        // Create new teacher role
        const teacher = await prisma.roles.create({
            data: { role, email, password, firstName, phone, lastName },
        });

        console.log(teacher);

        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: "Account is created",
                message: "Successfully created",
            })
        );
    } catch (error) {
        return NextResponse.json(
            new ApiError(403, "You're not authorized", error)
        );
    } finally {
        await prisma.$disconnect();
    }
}

// GET roles
export async function GET(req: NextRequest) {
    try {
        const id = new URL(req.url).searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                new ApiError(403, "You are not authorized")
            );
        }

        const [getUser, teacherCount, adminCount] = await Promise.all([
            prisma.roles.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    phone: true,
                    subjects:true
                },
            }),
            prisma.roles.count({
                where: { role: "TEACHER" },
            }),
            prisma.roles.count({
                where: { role: "ADMIN" },
            }),
        ]);

        return NextResponse.json(
            new ApiResponse({
                status: 200,
                data: { getUser, teacherCount, adminCount },
                message: "Fetched successfully",
            })
        );
    } catch (error) {
        return NextResponse.json(new ApiError(401, "Unauthorized user", error));
    } finally {
        await prisma.$disconnect();
    }
}
