import Link from "next/link";
import { auth } from "@/app/api/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

// Function to fetch the user data that includes enrollment details
async function fetchUserEnrollments({ id }: { id: string }) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PORT}/api/teacher?id=${id}`,
      { timeout: 5000 }
    );
    return res.data; // Expecting JSON structure as provided
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return { data: { getUser: [] } };
  }
}

export default async function EnrollTable() {
  // Get the user data (adjust the endpoint as needed)
  const res = await auth();
  const id = res?.role.id;
  const response = await fetchUserEnrollments({ id });

  // Assuming you want to display enrollments of the first user in getUser array
  const user = response?.data?.getUser?.[0];
  const enrollments = user?.Enroll || [];

  const groupedEnrollments = enrollments.reduce((acc: any, enroll: any) => {
    const key = `${enroll.subject.id}-${enroll.batch.id}`;
    if (!acc[key]) {
      acc[key] = { 
        subject: enroll.subject.subjectName, 
        session: enroll.session, 
        year: enroll.year, 
        batch: enroll.batch.batch, 
        batchId: enroll.batch.id, 
        subjectId: enroll.subject.id,
        count: 0 
      };
    }
    acc[key].count += 1; // Count students in each subject-batch
    return acc;
  }, {});

  const enrollmentList = Object.values(groupedEnrollments);

  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left font-semibold">Subject</TableHead>
          <TableHead className="text-left font-semibold">Session</TableHead>
          <TableHead className="text-left font-semibold">Year</TableHead>
          <TableHead className="text-left font-semibold">Batch</TableHead>
          <TableHead className="text-left font-semibold">Total Students</TableHead>
          <TableHead className="text-left font-semibold">Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollmentList.length > 0 ? (
          enrollmentList.map((enroll: any, index: number) => (
            <TableRow key={index} className="w-screen">
              <TableCell className="py-2">{enroll.subject}</TableCell>
              <TableCell className="py-2">{enroll.session}</TableCell>
              <TableCell className="py-2">{enroll.year}</TableCell>
              <TableCell className="py-2">{enroll.batch}</TableCell>
              <TableCell className="py-2">{enroll.count}</TableCell>
              <TableCell className="py-2">
                <Link
                  href={`/dashboard/enroll-student/${enroll.subjectId}/${enroll.session}/${enroll.year}/${enroll.batchId}`}
                  className="text-blue-500 hover:underline"
                >
                  View Students
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No enrollments found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}