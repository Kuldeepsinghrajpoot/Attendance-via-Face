import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



export default function TableDemo({ Attendance }: any) {
    return (
        <Table className=" bg-background shadow-md rounded-md">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="">Roll Number</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Student's Name</TableHead>
                    <TableHead className="text-right">Attendance Mark</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {Attendance.map((Attendance: any) => {
                    return (<TableRow key={Attendance.id}>
                        <TableCell className="font-medium">{Attendance?.rollNumber}</TableCell>
                        {/* <TableCell></TableCell> */}
                        <TableCell></TableCell>

                        <TableCell className=" uppercase">{Attendance?.fullName}</TableCell>
                        {Attendance?.attendances.map((item: any, key: any) => {
                            return (
                                <TableCell className=" uppercase text-right" >{item?.attendancevalue}</TableCell>

                            )
                        })}

                    </TableRow>
                    )
                })}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Total : 2</TableCell>
                    <TableCell className="text-right">Present -  2 </TableCell>
                    <TableCell className="text-right">Absent - 0</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
