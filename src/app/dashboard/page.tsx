
import React from "react";
import { Calendars } from "./dashboard/calendar";
import CardWithFormList from "./dashboard/card";
import AttendanceChart from "./dashboard/chart";
import { auth } from "../api/auth";

async function getAttendanceSummary({id,date}:any) {
    // Fetch attendance summary for a given month and year
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/dashboard?id=${id}&&date=${date}`
    );
    const data = await response.json();
    return data.data;
}
async function getDetails({id,date}:any) {
    // Fetch attendance summary for a given month and year
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_PORT}/api/get-subject-branch-batch?id=${id}`
    );
    const data = await response.json();
    return data.data;
}

async function page({searchParams}:any) {
    const res = await auth();
    const id = res?.id;
    const {date} = await searchParams;

   
    const dashboardData = await getAttendanceSummary({id,date});
    const getDetail = await getDetails({id,date});
    return (
        <div className="p-4">
            {/* Cards Section */}
            <div>
                <CardWithFormList data={getDetail} />
            </div>

            {/* Charts & Calendar Section */}
            <div className="flex flex-wrap justify-center w-full gap-4 mt-6">
                <div className="flex-1 min-w-[300px] h-full">
                    <AttendanceChart data={dashboardData} />
                </div>
                <div className="h-full">
                    <Calendars id={id} />
                </div>
            </div>
            {/* <div className="bg-background p-5 my-5 rounded"></div> */}
        </div>
    );
}

export default page;
