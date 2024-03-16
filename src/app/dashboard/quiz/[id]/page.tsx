import axios from 'axios';
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
import Link from 'next/link';

const returnViceSubject = async ({ subject }: { subject: string }) => {

  // console.log('subject name',subject)
  // return

  const response = await axios.get(`http://localhost:3000/api/subject/${subject}`)

  return response.data
}

interface fatchType {
  key: any
  value: any
}
const page = async ({ params }: { params: { id: string } }) => {
  const subject = true
  const data = await returnViceSubject({ subject: params.id })
  // return (
  //   <Card className="w-[350px]">
  //     <CardHeader>
  //     </CardHeader>
  //     <CardContent>
  //       <form>
  //         {
  //           data.subject.map((value: any, key: any) => {
  //             return (
  //               <div key={value.id} className="grid w-full items-center gap-4">
  //                 <div className="flex flex-col space-y-1.5">
  //                   <Label htmlFor="name">Subject name</Label>
  //                   <Select>
  //                     <SelectTrigger id="framework">
  //                       <SelectValue placeholder="Select" />
  //                     </SelectTrigger>
  //                     <SelectContent position="popper">
  //                       {/* {value.subjectName} */}
  //                       <SelectItem value="next">{value.subjectName}</SelectItem>
  //                     </SelectContent>
  //                   </Select>
  //                 </div>
  //                 <div className="flex flex-col space-y-1.5">
  //                   <Label htmlFor="framework">Vice subject Name</Label>
  //                   <Select >
  //                     <SelectTrigger id="framework">
  //                       <SelectValue placeholder="Select" />
  //                     </SelectTrigger>
  //                     <SelectContent position="popper">
  //                       {value.viceSubjects.map((vice: any) => {
  //                         return (

  //                           <SelectItem key={vice.id} value={vice.subjectName}>{vice.subjectName}</SelectItem>
  //                         )
  //                       })}
  //                     </SelectContent>
  //                   </Select>
  //                 </div>
  //               </div>
  //             )
  //           })}
  //       </form>
  //     </CardContent>
  //     <CardFooter className="flex justify-between">
  //       <Button variant="outline">Cancel</Button>
  //       <Button>Submit</Button>
  //     </CardFooter>
  //   </Card>
  // );


  return (
    <>
    {subject&&<Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className=''>
          <TableHead className="w-full">Subject Name</TableHead>
          <TableHead className="">Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.subject.map((subjectName: any) => {
          const subjectsName = subjectName.subjectName
          return (

            subjectName.viceSubjects.map((vice: any) => (
              <TableRow key={vice.subjectName}>
                <TableCell className="font-medium">{vice.subjectName}</TableCell>
                <TableCell><Link href={`/dashboard/quiz/${subjectsName}/${vice.id}`}>Open</Link></TableCell>
                {/* <TableCell>{invoice.paymentMethod}</TableCell> */}
              </TableRow>
            ))
          )
          })}
      </TableBody>
    
    </Table>
}
    </>

  )

}

export default page;
