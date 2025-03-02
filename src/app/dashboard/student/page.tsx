"use catch"
import { Student } from "./table";
import fetchStudent from "./fetchStudent";

export default async function page() {
    const response = await fetchStudent();

    return (
        <div className="bg-background p-4  rounded-md border">
            <Student response={response.users} />
        </div>
    )

}