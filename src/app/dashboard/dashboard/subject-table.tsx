"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";

interface BatchAttendance {
  batchId: string;
  count: number;
  createdAt: string;
}

const BatchAttendanceTable = () => {
  const [batchAttendance, setBatchAttendance] = useState<BatchAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
const {data:session} = useSession();
const id = session?.user?.id;
  useEffect(() => {
    const fetchBatchAttendance = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/dashboard?id=67c55404b4f9cc1a18903d7c");
        const data = response.data?.data?.dailyBatchAttendance;

        if (data && Array.isArray(data)) {
          const formattedData = data.map((batch) => ({
            batchId: batch.batchId,
            count: batch.count,
            createdAt: new Date(batch.createdAt).toLocaleString(),
          }));
          setBatchAttendance(formattedData);
        }
      } catch (error) {
        console.error("Error fetching batch attendance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchAttendance();
  }, []);

  console.log(batchAttendance);
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="border rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Batch-wise Attendance</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch ID</TableHead>
            <TableHead>Attendance Count</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {batchAttendance.length > 0 ? (
            batchAttendance.map((batch, index) => (
              <TableRow key={index}>
                <TableCell>{batch.batchId}</TableCell>
                <TableCell>{batch.count}</TableCell>
                <TableCell>{batch.createdAt}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No batch attendance data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BatchAttendanceTable;
