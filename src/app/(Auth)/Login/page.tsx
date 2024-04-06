"use client"
import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Navbar from "@/app/Navbar"
import { useState } from "react";
import { ToastAction } from "@/components/ui/toast";
const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(5, {
        message: "password should be min 5 characters"
    })
})


export default function ProfileForm() {
    // router
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })


    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true); // Start the form submission, show progress and disable button
            const { email, password } = values;
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (res?.ok === false) {
                toast({
                    title: "Uh oh! Credentials.",
                    description: "Your credentials is invailid ",
                  })
                
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Error during form submission:", error);
            alert('Something went wrong');
        } finally {
            setIsSubmitting(false); // Form submission completed, hide progress and enable button
        }
    }

    return (
        <>
            <Navbar />
            <div className=" flex justify-center container items-center h-full w-full py-20">

                <Tabs defaultValue="Login" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="Login">Login</TabsTrigger>
                        <TabsTrigger value="password">password</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Login">
                        <Card>

                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Make changes to your Login here. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="my-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <CardContent className=" py-3">
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </CardContent>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <CardContent className="py-2">
                                                    <FormLabel>password</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="password" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </CardContent>
                                            </FormItem>
                                        )}
                                    />
                                    <CardFooter>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Submitting...' : 'Submit'}
                                        </Button>
                                    </CardFooter>

                                </form>
                            </Form>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you'll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
