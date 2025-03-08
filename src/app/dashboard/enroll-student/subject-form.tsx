"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { User2 } from "lucide-react";
import Swal from "sweetalert2";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import axios from "axios";
import { EnrollSchema, enrollSchema } from "@/schema/enroll-student";

export function SubjectForm() {
    const { data: session, status } = useSession();
    console.log(session?.user?.id);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Redirect to dashboard if user is logged in

    const form = useForm<EnrollSchema>({
        resolver: zodResolver(enrollSchema),
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<EnrollSchema> = React.useCallback(
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
                console.log(res);
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
                    <span>Enroll Student</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Enroll Student
                    </DialogTitle>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                        <div className="grid gap-4 grid-cols-2 py-4">
                            <FormField
                                control={form.control}
                                name="subjectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Subject"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="branchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Branch"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="session"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Session"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Year</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=" Student Year"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="batchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Batch"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="submit"
                                className="w-full"
                                variant="default"
                            >
                                Enroll Student
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
