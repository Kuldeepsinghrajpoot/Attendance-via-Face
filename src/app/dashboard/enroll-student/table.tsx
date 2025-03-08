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

// Function to fetch enrollment data using the teacherId only.
// Expecting response data in the format described above.
async function fetchUserEnrollments({ id }: { id: string }) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PORT}/api/enroll-student?id=${id}`,
      { timeout: 5000 }
    );
    return res.data; // Should be an array of enrollment groups.
  } catch (error) {
    console.error("Error fetching enrollment data:", error);
    return { data: [] };
  }
}

export default async function EnrollTable() {
  // Get the teacher's basic details (role id) from auth.
  const res = await auth();
  const id = res?.role.id;

  // Fetch enrollment groups
  const response = await fetchUserEnrollments({ id });
  // Assuming the API returns the grouped data directly as response.data
  const enrollmentList = response.data || [];
  console.log(enrollmentList);
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
            <TableRow key={index}>
              <TableCell className="py-2">{enroll.subject.subjectName}</TableCell>
              <TableCell className="py-2">{enroll.session}</TableCell>
              <TableCell className="py-2">{enroll.year}</TableCell>
              <TableCell className="py-2">{enroll.batch.batch}</TableCell>
              <TableCell className="py-2">{enroll.studentCount}</TableCell>
              <TableCell className="py-2">
                <Link
                  href={`/dashboard/enroll-student/${enroll.subject.id}/${enroll.session}/${enroll.year}/${enroll.batch.id}`}
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
