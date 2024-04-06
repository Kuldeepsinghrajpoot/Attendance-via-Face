

import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import axios from "axios";



let arr: any[] = []

async function fetchData(){
 const response =  await axios('http://localhost:3000/api/attendance');
 return response.data
}
export default async function TableDemo() {
  
  const Information = await fetchData()

  return (
    <div className="md:flex md:justify-start gap-24   ">
   
      <div className="w-full  dark:bg-background rounded-md px-6 py-5  " >
        <Table >
         
          <TableHeader>
            <TableRow>
              <TableHead >Roll Number</TableHead>
              <TableHead >Name</TableHead>
              <TableHead >Attandance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Information?.response?.map((item: any,id:number) => {
              return (
                <TableRow key={id+1}>
                  <TableCell> {item?.rollNumber}</TableCell>
                  <TableCell className=" uppercase"> {item?.fullName}</TableCell>
                  {item.attendances.map((attendance: any) => (
                    <TableCell key={id+1} className="uppercase">{attendance.attendancevalue} </TableCell>
                  ))}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
