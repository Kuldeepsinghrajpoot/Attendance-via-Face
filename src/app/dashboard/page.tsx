"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CardWithForm from "./dashboard/card";
import { Chart } from "./dashboard/chart";
import { Calendars } from "./dashboard/calendar";

import {
    BarChart,
    CheckCircle,
    User,
    UserCheck2Icon,
    ViewIcon,
} from "lucide-react";
import PieChartComponent from "./dashboard/pi-chart";
import axios from "axios";
import AttendanceTable from "./dashboard/subject-table";

const cartItem = [
    { title: "Students", Icon: UserCheck2Icon, data: 500 },
    { title: "Teachers", Icon: User, data: 50 },
    { title: "Attendance", Icon: CheckCircle, data: 50 },
    { title: "Visitor", Icon: ViewIcon, data: 1500 },
];

const Page = () => {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/dashboard?id=${userId}`
                );
                setDashboardData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [userId]); // Dependency array fixed

    if (status === "loading") return <div>Loading...</div>;
    console.log(dashboardData);
    return (
        <div className="p-4">
            {/* Cards Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cartItem?.map((dataItem, key) => (
                    <CardWithForm key={key} dataItem={dataItem} />
                ))}
            </div>

            {/* Charts & Calendar Section */}
            <div className="flex flex-wrap justify-center w-full gap-4 mt-6">
                <div className="flex-1 min-w-[300px] h-full">
                    <Chart />
                </div>
                <div className="h-full">
                    <Calendars />
                </div>
            </div>

            {/* Subject Table */}
            <div className="bg-background p-5 my-5 rounded">
                <AttendanceTable />
            </div>

            {/* Pie Chart Component */}
            {dashboardData && <PieChartComponent data={dashboardData} />}
        </div>
    );
};

export default Page;
