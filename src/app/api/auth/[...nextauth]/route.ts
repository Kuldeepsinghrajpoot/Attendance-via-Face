import { PrismaClient, Student } from "@prisma/client";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google'
import { UserSchema } from '@/schema/UserSchema'
import { string } from "zod";
// Prisma client for accessing the database
const prisma = new PrismaClient();


export const authOptions: { providers: any[] } = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize(credentials: any) {
                try {
                    // Extract email from credentials
                    const { email, password } = credentials;
                    // Query the database to find a user with the provided email
                    const user: any = await prisma.student.findUnique({
                        where: {
                            email: email,
                        }
                    });

                    if (!user || user === null) {
                        // If user not found, return null
                        return null;
                    }

                    // If user found, check if passwords match
                    if (user.password === password) {
                        return user; // Return user object if password matches
                    } else {
                        // If passwords don't match, return null
                        return null;
                    }
                } catch (error) {
                    // Handle any errors that occur during database query
                    console.error("Error:", error);
                    return null;
                }
            }

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id?.toString()
                token.rollNumber = user.rollNumber
                token.Firstname = user.Firstname
                token.avatar = user.avatar

            }
            return token
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id
                session.user.rollNumber = token.rollNumber
                session.user.Firstname = token.Firstname
                session.user.avatar = token.avatar

            }
            return session
        }

    },
    async signIn({ account, profile }:any) {
        if (account.provider === "google") {
            return profile;
        }
        return true; // Do different verification for other providers that don't have `email_verified`
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/Login",
        signOut: '/Login'
    },
} as any;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
