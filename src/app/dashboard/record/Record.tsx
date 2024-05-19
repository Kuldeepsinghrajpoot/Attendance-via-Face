'use client'
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


export default function TableDemo({ Attendance,count,totalStudent }: any) {

    return (
        <>
            <div className="flex justify-between  w-full gap-4 pt-2 pb-6">
              
            </div>
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
                            <TableCell></TableCell>
                            <TableCell className=" uppercase">{Attendance?.Firstname}</TableCell>
                            {Attendance?.attendances?.map((item: any, key: any) => {
                                return (
                                    <TableCell className=" uppercase text-right" key={item.id} >{item?.attendancevalue}</TableCell>
                                )
                            })}

                        </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2}>Total : {totalStudent}</TableCell>
                        <TableCell className="text-right">Present -  {count} </TableCell>
                        <TableCell className="text-right">Absent - 0</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </>
    )
}
