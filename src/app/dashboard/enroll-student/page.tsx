import React from "react";
import EnrollTable from "./table";
import { SubjectForm } from "./enroll-student-form";
import { auth } from "@/app/api/auth";


const getBasicInfo = async ({ id }: { id: string }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_PORT}/api/get-subject-branch-batch?id=${id}`
        );
        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};
async function page() {
    const user = await auth();
    const id = user?.id;
    const data = await getBasicInfo({id});
    return (
        <section className=" p-4 rounded-md  ">
            <div className="flex justify-start gap-2 h-12 max-h-min">
                
                <SubjectForm data={data}/>
         
            </div>
            <div className="bg-background border rounded-md p-4 my-4">
                <EnrollTable />
            </div>
        </section>
    );
}

export default page;
