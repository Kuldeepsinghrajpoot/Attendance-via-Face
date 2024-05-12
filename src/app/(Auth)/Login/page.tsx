'use client'
import { useSession } from 'next-auth/react';
import Login from './signIn';
import { useRouter } from 'next/navigation';

function LoginWrapper() {
    const router = useRouter();
    const { data: session, status } = useSession();
    
    // Redirect to dashboard if user is logged in
    if (status === 'authenticated') {
        router.replace('/dashboard');
        return null; // Return null to prevent rendering Login component
    }

    return (
        <>
        
        <Login />
        </>
    );
}

export default LoginWrapper;
