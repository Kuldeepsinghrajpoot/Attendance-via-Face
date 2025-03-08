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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function SubjectForm({ data }: { data: any }) {
    const { data: session, status } = useSession();
    const [dialogOpen, setDialogOpen] = useState(false);

    if (status === "loading") return <div>Loading...</div>;

    // Initialize react-hook-form with zodResolver
    const form = useForm<EnrollSchema>({
        resolver: zodResolver(enrollSchema),
        defaultValues: {},
    });

    const onSubmit: SubmitHandler<EnrollSchema> = React.useCallback(
        async (values) => {
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
                    { values },
                    {
                        headers: { "Content-type": "application/json" },
                    }
                );

                Swal.close();
                if (res.data.status === 200) {
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
                    setDialogOpen(false);
                    form.reset();
                    Swal.fire({
                        icon: "error",
                        title: "Account creation Failed",
                        text: "You are not authorized",
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
        [session, form]
    );

    // Destructure API data for easier access
    const { batch, branch, subject } = data.data;

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
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 grid-cols-2 py-4">
                            {/* Example: Using a dropdown for subjects */}
                            <FormField
                                control={form.control}
                                name="subjectId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Select Subject</FormLabel>
                                        <FormControl>
                                            <Select {...field}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a fruit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Select Subject
                                                        </SelectLabel>
                                                        {subject.map(
                                                            (sub: any) => (
                                                                <SelectItem
                                                                    key={sub.id}
                                                                    value={
                                                                        sub.id
                                                                    }
                                                                >
                                                                    {
                                                                        sub.subjectName
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Similarly for Branch */}
                            <FormField
                                control={form.control}
                                name="branchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Branch</FormLabel>
                                        <FormControl>
                                            <Select {...field}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Branch" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Select Branch
                                                        </SelectLabel>
                                                        {branch.map(
                                                            (branch: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        branch.id
                                                                    }
                                                                    value={
                                                                        branch.id
                                                                    }
                                                                >
                                                                    {
                                                                        branch.branchName
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Continue with other fields as needed */}
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
                                                placeholder="Student Year"
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
                                            <Select {...field}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a fruit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Select Batch
                                                        </SelectLabel>
                                                        {batch.map(
                                                            (batch: any) => (
                                                                <SelectItem
                                                                    key={
                                                                        batch.id
                                                                    }
                                                                    value={
                                                                        batch.id
                                                                    }
                                                                >
                                                                    {
                                                                        batch.batch
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
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
