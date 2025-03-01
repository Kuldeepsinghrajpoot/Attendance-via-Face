
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios";
import { CalendarIcon } from "lucide-react";

async function fetchData() {
  const response = await axios(`${process.env.NEXTAUTH_URL}/api/attendance`);
  return response.data
}
export default async function TableDemo() {

  const Information = await fetchData()
  function getDates(dateString: any): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
    const getdate = day + '/' + month + '/' + year;
    // console.log(dateString,'------>', getdate)
    return getdate
  }

  return (
    <div className="md:flex md:justify-start gap-24   ">

      <div className="w-full  dark:bg-background rounded-md px-6 py-5  " >
       <div className=" items-center object-center flex justify-start"><CalendarIcon className="mr-2 h-4 w-4" />
      <div> {getDates(new Date())}</div>
       
       </div>
        <Table className="bg-inherit">

          <TableHeader>
            <TableRow>
              <TableHead >Roll Number</TableHead>
              <TableHead >Name</TableHead>
              <TableHead  className=" text-right">Attandance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Information?.response?.map((item: any, id: number) => {
              return (
                <TableRow key={id + 1}>
                  <TableCell> {item?.rollNumber}</TableCell>
                  <TableCell className=" uppercase"> {item?.Firstname}</TableCell>
                  {item?.attendances.map((item: any, key: any) => {
                    return (
                      <TableCell className=" uppercase text-right" key={item.id} >{item.attendancevalue}</TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}