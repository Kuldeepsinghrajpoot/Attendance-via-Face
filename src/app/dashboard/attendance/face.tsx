'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import ImageCapture from "./realtime"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]
let arr:any[]=[]
const handleCapture = async (dataURL:string)=>{
  const response = await fetch('http://127.0.0.1:8000/verify-face', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: dataURL }),
});
const data = await response.json();
console.log(data.message);

// setname(data.message)
     const res=  fetch(`http://localhost:3000/api/student?id=${data.message}`).then((result) => {
        return result.json()
       }).then((result)=>{
        // console.log(result)
        arr.push(result)
       }).catch((err):void => {
        console.log(err)
       });
console.log(res)
}
export default function TableDemo() {
  return (
    <div className="md:flex md:justify-start gap-24   ">
      <div>
        
        <Card className="px-7 mx-7">
     
      <CardHeader></CardHeader>
          <ImageCapture onCapture={handleCapture}/>


      </Card></div>
      <div className="w-full mr-7  " ><Table >
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead >Roll Number</TableHead>
            <TableHead >Name</TableHead>
            <TableHead >Attandance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {arr.map((item) => (
            <TableRow key={item.Name}>
              <TableCell> {item.RollNumber}</TableCell>
              <TableCell> {item.email}</TableCell>
              <TableCell>{}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      
      </Table></div>
    </div>
  )
}
