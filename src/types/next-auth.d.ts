import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User {
        id?: string,
        Firstname: string,
        rollNumber: string,
        avatar:string
    }

    interface Session {
        user: {
            id?: string,
            Firstname: string,
            rollNumber: string,
            avatar:string
        } & DefaultSession['User']
    }

}

declare module 'next-auth/jwt' {
    interface jwt {
        id?: string,
        Firstname: string,
        rollNumber: string,
        avatar:string
    }
}