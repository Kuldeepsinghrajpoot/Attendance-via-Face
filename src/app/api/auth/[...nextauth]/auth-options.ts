import { PrismaClient, Student } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// Prisma client for accessing the database
const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                try {
                    // Extract email from credentials
                    const { email, password } = credentials as {
                        email: string;
                        password: string;
                    };
                    // Query the database to find a user with the provided email
                    const user: any = await prisma.student.findUnique({
                        where: {
                            email: email,
                        },
                    });

                    if (!user || user === null) {
                        // If user not found, return null
                        return null;
                    }

                    // If user found, check if passwords match
                    if (user.password === password) {
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            role: user.role ?? "STUDENT",
                            Firstname: user.Firstname,
                            rollNumber: user.rollNumber,
                            avatar: user.avatar,
                        }; // Return user object if password matches
                    } else {
                        // If passwords don't match, return null
                        return null;
                    }
                } catch (error) {
                    // Handle any errors that occur during database query
                    console.error("Error:", error);
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],

    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id?.toString();
                token.rollNumber = user.rollNumber;
                token.name = user.Firstname;
                token.avatar = user.avatar;
                token.email = user.email;
                token.role = user;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/",
        signOut: "/",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
};
