"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";

interface Stats {
    present: number;
    absent: number;
}

export default function AttendanceChart({
    data,
}: {
    data: { attendanceRecord: Record<string, Record<string, Stats>> };
}) {
    const attendance = data?.attendanceRecord;
    //   present: stats?.present || 0,
    // Convert API data to an array format for the chart
    const chartData = React.useMemo(() => {
        return Object.entries(attendance || {}).flatMap(([subject, batches]) =>
            Object.entries(batches).map(([batch, stats]) => ({
                subject: `${subject} (Batch ${batch})`,
                present: stats.present || 0,
                absent: stats.absent || 0,
            }))
        );
    }, [attendance]);



    // console.log("Chart Data:", chartData);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>
                    Showing attendance data for different subjects and batches
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="subject"
                            tick={{ fontSize: 12 }}
                            angle={-15}
                            textAnchor="end"
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="present"
                            fill="#22C55E"
                            name="Present Students"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="absent"
                            fill="#EF4444"
                            name="Absent Students"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <div>Total Attendance Data</div>
                <div>Updated: {new Date().toLocaleDateString()}</div>
            </CardFooter>
        </Card>
    );
}
