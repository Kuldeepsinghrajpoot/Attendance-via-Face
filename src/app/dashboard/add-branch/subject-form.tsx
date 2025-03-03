"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User2 } from "lucide-react";
import Swal from "sweetalert2";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { roleSchema, RoleSchema } from "@/schema/role-schema";
import axios from "axios";


export function SubjectForm() {
    const { data: session, status } = useSession();
    console.log(session?.user?.id)
    const [dialogOpen, setDialogOpen] = useState(false);

    // Redirect to dashboard if user is logged in

    const form = useForm<RoleSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            email: "", role: "", password: "", firstName: "", phone: "", lastName: ""
        },
    });

    const onSubmit: SubmitHandler<RoleSchema> = React.useCallback(
        async (values) => {
            console.log(values);
            Swal.fire({
                title: "Creating account",
                text: "Please wait...",
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => Swal.showLoading(),
            });

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_PORT}/api/role?id=${session?.user?.id}`,
                    {
                        values,
                    },
                    {
                        headers: {
                            "Content-type": "applicaton/json",
                        },
                    }
                );
                console.log(res)
                Swal.close();
                const response = res;
                if (response?.data?.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: "Account is created successfully",
                        timer: 2000,
                        showConfirmButton: false,
                    });

                    setDialogOpen(false);
                    form.reset();
                } else {
                    form.reset();
                    setDialogOpen(false);

                    Swal.fire({
                        icon: "error",
                        title: "Account creation Failed",
                        text: "You are not authorize",
                        confirmButtonColor: "red",
                    });
                }
            } catch (error) {
                console.error("account creation Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong. Please try again!",
                });
            }
        },
        [session]
    );

    return (
        <Dialog
            open={dialogOpen}
            onOpenChange={(isOpen) => {
                setDialogOpen(isOpen);
                if (!isOpen) form.reset();
            }}
        >
            <DialogTrigger asChild>
                <Button className="space-x-1" variant="secondary">
                    <User2 />
                    <span>Add Role</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Add new Role
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Signup in to new account to continue.
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div className="grid gap-4 grid-cols-2 py-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="w-full ">
                            <Button
                                type="submit"
                                className="w-full"
                                variant="default"
                            >
                                Login
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
