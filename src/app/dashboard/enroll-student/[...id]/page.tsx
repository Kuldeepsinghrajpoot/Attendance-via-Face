import { SubjectForm } from "../subject-form";
import axios from "axios";
import { auth } from "@/app/api/auth";
import EnrollTable from "./table";


async function getEnroll(id: string, userId: string) {
  if (!id || !userId) {
    console.error("Invalid parameters passed to getEnroll:", { id, userId });
    return null;
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_PORT}/api/enroll-student/${(id)}?id=${(userId)}`;
    console.log("Fetching from URL:", url); // Debugging
    const res = await axios.get(url, { timeout: 5000 });
    
    return res.data;
  } catch (error) {
    console.error("Error fetching enroll data:", error);
    return null;
  }
}


export default async function Page({ params }:any) {
  const session = await auth();
  const userId = session?.role?.id;
const{id} = await params
  if (!userId) return <p className="text-red-500">Unauthorized</p>;

  const enrolls = await getEnroll(id.join("/"),userId);
  // console.log(enrolls?.data?.user);

  return (
    <section className="p-4 rounded-md">
      
      <div className="bg-background border rounded-md p-4 my-4">
        <EnrollTable id={enrolls?.data?.user?.Enroll} />
      </div>
    </section>
  );
}
