"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInMinutes } from "date-fns";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon, Timer, User2 } from "lucide-react";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formSchema, FormSchema } from "@/schema/schedule-time";
import axios from "axios";
import { useSession } from "next-auth/react";

export function DateTimePicker24hForm({
    initialValues,
}: {
    initialValues: any;
}) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startTime: new Date(),
            endTime: new Date(),
            ...initialValues,
        },
    });
    const { data: session } = useSession();
    const id = session?.user?.id;

    const onSubmit: SubmitHandler<FormSchema> = async (data) => {
        const duration = differenceInMinutes(data.endTime, data.startTime);
        if (duration < 0) {
            toast.error("End time must be after start time.");
            return 0;
        }
        const requestData = {
            ...initialValues, // Include initial values like subject, etc.
            ...data, // Include form values (startTime, endTime)
            duration,
        };
console.log(requestData);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_PORT}/api/schedule-attendance?id=${id}`,
                requestData,
                { timeout: 5000 }
            );

            if (res?.data?.status !== 200) {
                toast.error("Error while scheduling attendance.");
                return 0;
            }
            toast.success(
                `Start: ${format(data.startTime, "PPPP HH:mm")}, End: ${format(
                    data.endTime,
                    "PPPP HH:mm"
                )}, Duration: ${duration} minutes`
            );
        } catch (error) { }
    };

    function handleDateSelect(
        name: "startTime" | "endTime",
        date: Date | undefined
    ) {
        if (date) {
            form.setValue(name, date, { shouldValidate: true });
        }
    }

    function handleTimeChange(
        name: "startTime" | "endTime",
        type: "hour" | "minute",
        value: string
    ) {
        const currentDate = form.getValues(name) || new Date();
        let newDate = new Date(currentDate);

        if (type === "hour") {
            newDate.setHours(parseInt(value, 10));
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value, 10));
        }

        form.setValue(name, newDate, { shouldValidate: true });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="space-x-1" variant="ghost">
                    <Timer />
                </Button>
            </DialogTrigger>
            {/* ✅ Keep the dialog mounted to prevent button disabling */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-semibold">
                        Schedule Attendance Time
                    </DialogTitle>
                    <DialogDescription className="text-center ">
                        Select the start and end time for attendance.
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        {["startTime", "endTime"].map((name) => (
                            <FormField
                                key={name}
                                control={form.control}
                                name={name as "startTime" | "endTime"}
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            {name === "startTime"
                                                ? "Start Time"
                                                : "End Time"}
                                        </FormLabel>
                                        <Popover modal>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value &&
                                                            "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "MM/dd/yyyy HH:mm"
                                                            )
                                                        ) : (
                                                            <span>
                                                                MM/DD/YYYY HH:mm
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <div className="sm:flex">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) =>
                                                            handleDateSelect(
                                                                name as
                                                                | "startTime"
                                                                | "endTime",
                                                                date
                                                            )
                                                        }
                                                        initialFocus
                                                    />
                                                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                                        <ScrollArea className="w-64 sm:w-auto">
                                                            <div className="flex sm:flex-col p-2">
                                                                {Array.from(
                                                                    {
                                                                        length: 24,
                                                                    },
                                                                    (_, i) => i
                                                                )
                                                                    .reverse()
                                                                    .map(
                                                                        (
                                                                            hour
                                                                        ) => (
                                                                            <Button
                                                                                key={
                                                                                    hour
                                                                                }
                                                                                size="icon"
                                                                                variant={
                                                                                    field.value?.getHours() ===
                                                                                        hour
                                                                                        ? "default"
                                                                                        : "ghost"
                                                                                }
                                                                                className="sm:w-full shrink-0 aspect-square"
                                                                                onClick={() =>
                                                                                    handleTimeChange(
                                                                                        name as
                                                                                        | "startTime"
                                                                                        | "endTime",
                                                                                        "hour",
                                                                                        hour.toString()
                                                                                    )
                                                                                }
                                                                            >
                                                                                {
                                                                                    hour
                                                                                }
                                                                            </Button>
                                                                        )
                                                                    )}
                                                            </div>
                                                            <ScrollBar
                                                                orientation="horizontal"
                                                                className="sm:hidden"
                                                            />
                                                        </ScrollArea>
                                                        <ScrollArea className="w-64 sm:w-auto">
                                                            <div className="flex sm:flex-col p-2">
                                                                {Array.from(
                                                                    {
                                                                        length: 12,
                                                                    },
                                                                    (_, i) =>
                                                                        i * 5
                                                                ).map(
                                                                    (
                                                                        minute
                                                                    ) => (
                                                                        <Button
                                                                            key={
                                                                                minute
                                                                            }
                                                                            size="icon"
                                                                            variant={
                                                                                field.value?.getMinutes() ===
                                                                                    minute
                                                                                    ? "default"
                                                                                    : "ghost"
                                                                            }
                                                                            className="sm:w-full shrink-0 aspect-square"
                                                                            onClick={() =>
                                                                                handleTimeChange(
                                                                                    name as
                                                                                    | "startTime"
                                                                                    | "endTime",
                                                                                    "minute",
                                                                                    minute.toString()
                                                                                )
                                                                            }
                                                                        >
                                                                            {minute
                                                                                .toString()
                                                                                .padStart(
                                                                                    2,
                                                                                    "0"
                                                                                )}
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </div>
                                                            <ScrollBar
                                                                orientation="horizontal"
                                                                className="sm:hidden"
                                                            />
                                                        </ScrollArea>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Select{" "}
                                            {name === "startTime"
                                                ? "start"
                                                : "end"}{" "}
                                            date and time.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <div className="text-center text-sm font-medium">
                            Duration:{" "}
                            {(() => {
                                const { startTime, endTime } = form.getValues();
                                return startTime && endTime
                                    ? `${differenceInMinutes(
                                        endTime,
                                        startTime
                                    )} minutes`
                                    : "N/A";
                            })()}
                        </div>
                        <Button type="submit" className="rounded shadow-none">
                            Submit
                        </Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
