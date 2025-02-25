import { getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]/auth-options"

export const auth = async () => {
 
    const response = await getServerSession(authOptions);
    return response?.user;
}