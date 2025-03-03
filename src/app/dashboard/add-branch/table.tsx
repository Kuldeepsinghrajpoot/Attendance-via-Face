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

async function fetchSubject({ id }: { id: string }) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PORT}/api/branch?id=${id}`,
      { timeout: 5000 }
    );
    return res.data; // Ensure this structure is correct in your API response
  } catch (error) {
    console.error("Error fetching subject data:", error);
    return { data: [] }; // Return an empty array to avoid errors
  }
}

export async function Subject() {
  const response = await auth();
  const id = response?.id; // Ensure this is the correct identifier
  const res = await fetchSubject({ id });
  return (
    <Table className="w-full ">
      <TableHeader>
        <TableRow>
          <TableHead className="text-left font-semibold">Branch ID</TableHead>
          <TableHead className="text-right font-semibold">Branch Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {res?.data.length > 0 ? (
          res.data.map((item: { id: string; branchName: string }) => (
            <TableRow key={item.id} className=" ">
              <TableCell className="py-2">{item.id}</TableCell>
              <TableCell className="py-2 text-right">{item?.branchName}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} className="text-center py-4">
              No subjects found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
