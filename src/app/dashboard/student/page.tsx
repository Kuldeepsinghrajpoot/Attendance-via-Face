"use catch"
import { Student } from "./table";
import fetchStudent from "./fetchStudent";
import { StudentForm } from "./student-form";

export default async function page() {
    const response = await fetchStudent();
    return (
        <>
            <div>
               <StudentForm/>
            </div>
            <div className="bg-background p-4  rounded-md border">
                <Student response={response.users} />
            </div>
        </>
    )

}