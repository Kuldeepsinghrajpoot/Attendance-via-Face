"use catch"
import { auth } from "@/app/api/auth";
import axios from "axios";
import { Student } from "./table";
import { cookies } from "next/headers";

async function getStudent({ id }: { id: string }) {
    try {
        const data = await axios.get(`${process.env.NEXTAUTH_URL}/api/student?id=${id}`);
        const response = data.data;
        if (!response) {
            throw Error('no data found');
        }
        return response;
    } catch (error) {

        if (!error) {
            throw Error('something went wrong')
        }
    }
}

export default async function page() {

    const data = await auth()
    const response = await getStudent({ id: data?.id });
    return (
        <div className="bg-background p-4  rounded-md border">
            <Student response={response.users} />
        </div>
    )

}