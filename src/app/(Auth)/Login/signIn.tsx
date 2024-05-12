'use client'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/app/Navbar";
import {useRouter} from 'next/navigation'

interface FormData {
    email: string;
    password: string;
}


export default function Signup() {
const Router = useRouter()
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const onSubmit: SubmitHandler<FormData> = async (values) => {
        // e.preventDefault(); // Prevent default form submission behavior
        try {
            const { email, password } = values;
            const res = await signIn("credentials", {
                email,
                password,
                redirect: true,
            });
            if (res?.ok === false) {
                toast({
                    title: "Uh oh! Credentials.",
                    description: "Your credentials are invalid.",
                });
            } else {
                Router.replace('/dashboard');
                // Handle successful sign-in, such as redirecting to the dashboard
            }
        } catch (error) {
            console.error("Error during form submission:", error);
            alert('Something went wrong');
        }
    }

    return (
        <>
            <div className=" z-50 sticky top-0  pb-4">
                <Navbar />
            </div>
            <div className="w-full rounded-md h-full  lg:grid lg:min-h-[600px] lg:grid-cols-2 ">
                <div className=" py-20 rounded-l-md flex items-center h-full justify-center bg-background">
                    <div className="mx-auto grid  h-full ">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to login to your account
                            </p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        {...register("email", { required: "Email is required." })}
                                    />
                                    {errors.email && (
                                        <span className="text-red-500">{errors.email.message}</span>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="ml-auto inline-block text-sm underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        {...register("password", { required: "Password is required." })}
                                    />
                                    {errors.password && (
                                        <span className="text-red-500">{errors.password.message}</span>
                                    )}
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </div>
                        </form>
                        <Button type="button" onClick={() => signIn('google')} variant="outline" className="w-full">
                            Login with Google
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/Register">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden w-full justify-center rounded-r-md bg-muted lg:block h-screen">
                    <div className="flex h-full w-full justify-center items-center object-center ">
                        <Image
                            src="/graphic-2.png"
                            alt="Image"
                            width="520"
                            height="580"
                            className="flex justify-center "
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
