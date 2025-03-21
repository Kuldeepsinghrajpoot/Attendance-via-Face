"use client";

import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface AttendanceData {
    subject: {
        id: string;
        subjectName: string;
    };
    batch: {
        id: string;
        batch: string;
    };
    studentCount: number;
}

const PieChartComponent = ({ data }: { data: AttendanceData[] }) => {
    const chartData = data?.map((item) => ({
        name: `${item.batch.batch} - ${item.subject.subjectName}`,
        value: item.studentCount,
    }));

    const totalStudents = chartData?.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Batch-wise Student Count</CardTitle>
                <CardDescription>Pie chart representation</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <>
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalStudents}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Students
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Total students distribution
                </div>
            </CardFooter>
        </Card>
    );
};

export default PieChartComponent;
