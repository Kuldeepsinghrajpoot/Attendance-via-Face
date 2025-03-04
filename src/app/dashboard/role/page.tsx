import React, { Suspense } from "react";
import { Role } from "./role-table";
import { RoleForm } from "./role";
import { auth } from "@/app/api/auth";
import axios from "axios";



async function getData({ id }: { id: string }) {
    try {
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_PORT}/api/role?id=${id}`,{ timeout: 5000 }
        );
        return res.data;
    } catch (error) {
        return "something went wrong";
    }
}

async function page() {
    const response = await auth();
    const id = response?.role?.id;
    const res = await getData({ id });
    console.log(id)

    return (
        <section className=" p-4 rounded-md  shadow-sm">
            <div className="flex justify-start gap-2 h-12 max-h-min">
                <RoleForm />
                {/* <SelectSubject/> */}
              
            </div>
            <div className="bg-background border rounded-md p-4 my-4">
                <Role data={res?.data} />
            </div>
        </section>
    );
}

export default page;
