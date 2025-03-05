import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // Allow public routes (e.g., login, register)
    if (pathname.startsWith("/") || pathname.startsWith("/register")) {
        return NextResponse.next();
    }

    // If user is not authenticated, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    // Role-based access control (Example: Only admin can access "/dashboard/role")
    if (
        pathname.startsWith("/dashboard/role") &&
        pathname.startsWith("/dashboard/student") &&
        token.role !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"], // Protect all dashboard routes
};
