import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function EnrollTable({ id }: { id: any[] }) {
  // Group enrollments by subject and batch
  const groupedEnrollments = id.reduce((acc: any, enroll: any) => {
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
          {/* <TableHead className="text-left font-semibold">Details</TableHead> */}
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
                {/* <Link
                  href={`/dashboard/enroll-student/${enroll.subjectId}/${enroll.session}/${enroll.year}/${enroll.batchId}`}
                  className="text-blue-500 hover:underline"
                >
                  View Students
                </Link> */}
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
