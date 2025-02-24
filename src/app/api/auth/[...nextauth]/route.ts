import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

const handler = await NextAuth(authOptions);

export { handler as GET, handler as POST };
