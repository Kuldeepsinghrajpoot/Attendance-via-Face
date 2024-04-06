import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

// Prisma client for accessing the database
const prisma = new PrismaClient();

interface UserInfo {
    email: string,
    fullName:string
}

export const authOptions: { providers: any[] } = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials: any): Promise<any | null> {
                try {
                    // Extract email from credentials
                    const { email, password } = credentials;
                   
                    // Query the database to find a user with the provided email
                    const response: UserInfo | null = await prisma.student.findFirst({
                        where: {
                            email: email,
                            password: password
                        }
                    });

                   

                    // If user found, return only the email
                    if (response) {
                        return {
                            email: response.email,
                            fullName: response.fullName,
                        };
                    } else {
                        // If user not found, return null
                        return null;
                    }
                } catch (error) {
                    // Handle any errors that occur during database query
                    console.error("Error:", error);
                    return null;
                }
                
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.email = user.email
                token.fullName = user.fullName

            }
            return token;
        },

        async session({ session, token }: any) {
            if (session?.user) {
                session.user.email = token.email
                session.user.fullName = token.fullName

            };
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/Login",
        signOut: '/Login'
    },
} as any;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
