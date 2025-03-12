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
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import axios from "axios";
import { addSubject, AddSubject } from "@/schema/add-subject";


export function SubjectForm() {
    const { data: session, status } = useSession();
    console.log(session?.user?.id)
    const [dialogOpen, setDialogOpen] = useState(false);

    // Redirect to dashboard if user is logged in

    const form = useForm<AddSubject>({
        resolver: zodResolver(addSubject),
        defaultValues: {
            subjectname: ""
        },
    });

    const onSubmit: SubmitHandler<AddSubject> = React.useCallback(
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
                // /api/subject?id=664111d3940c92fd7c40c587
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_PORT}/api/subject?id=${session?.user?.id}`,
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
                        text: " Subject is added successfully",
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
                        title: "Subject is added Failed",
                        text: "You are not authorize",
                        confirmButtonColor: "red",
                    });
                }
            } catch (error) {
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
                    <span>Add new Subject</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Add new Subject
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500">
                        Fill the form to add new subject
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="">
                       
                            <FormField
                                control={form.control}
                                name="subjectname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="subjectname" {...field} />
                                        </FormControl>
                                        <FormDescription>This is your public display name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                      

                        <DialogFooter className=" ">
                            <Button
                                type="submit"
                                className=""
                                variant="default"
                            >
                                Add new Subject
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
