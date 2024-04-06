
'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RiMenu2Fill } from "react-icons/ri";
import { FaHome } from "react-icons/fa";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link';
import { RxDashboard } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrStatusGood } from "react-icons/gr";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
// import Dashboard from '@/app/dashboard/page';
interface linkBar {
    title: string,
    url: string,
    icon: any,
    path:string,
}
export  function SideBar() {

   const{data:session}:any= useSession()
    const router = usePathname();
    const linkBar: linkBar[] = [
        {
            'title': "Dashboard",
            url: '../dashboard/',
            path:'/dashboard',
            'icon': <RxDashboard className='w-5 h-5' />
        }, {
            'title': "Quiz",
            'url': '../dashboard/quiz',
            path:'/quiz',
            'icon': <IoMdAddCircleOutline className='w-5 h-5' />
        }, {
            'title': "QuizStatus",
            'url': '../QuizStatus',
            path:'/QuizStatus',
            'icon': <GrStatusGood className='w-5 h-5' />
        },{
            'title':'Attendace',
            'url':'/AttendanceRecordTeacher',
            path:'AttendanceRecordTeacher',
            icon:<GrStatusGood className='w-5 h-5' />
        }
    ]
    return (
        <Sheet >
            <SheetTrigger asChild>
                {/* <Button >☰</Button> */}
                <button className="flex justify-center items-center text-center  h-full w-full"><RiMenu2Fill /></button>
            </SheetTrigger>
            <SheetContent side={'left'} className="px-0 py-0" >
                <SheetHeader>
                <div className="text-secondary-foreground py-2">
                        <div className=' text-secondary-foreground gap-5  w-full h-full flex justify-center items-center text-center'>
                            <div className='w-10 h-10 flex justify-center items-center text-center'>
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN1NAnlhSMbhwPtdLoWbm4WkAQu5qpPH_Hzw&usqp=CAU" alt="" />
                            </div>
                            <div className='text-secondary-foreground'>{session?.user}</div>
                        </div>
                        <div>
                        </div>
                    </div>

                </SheetHeader>
                <div className="gap-4 py-2 px-2 text-secondary-foreground ">
                {linkBar.map(({ title, url, icon,path }: linkBar, index: number) => (
                            <div key={index} className='py-1  w-full'>
                                  <SheetClose asChild>
   
          
                                <Link href={url} className={`flex px-2 py-2 hover:bg-gray-100 justify-start gap-5 items-center ${router === path ? '  rounded-md bg-gradient-to-r bg-primary text-white' : ''}`}>
                                        <div>{icon}</div>
                                        <div>{title}</div>  
                                </Link>
                                </SheetClose>
                            </div>
                        ))}
                </div>

            </SheetContent>
        </Sheet>
    )
}



// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet"

// export function SideBar() {
//   return (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline">Open</Button>
//       </SheetTrigger>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Edit profile</SheetTitle>
//           <SheetDescription>
//             Make changes to your profile here. Click save when you're done.
//           </SheetDescription>
//         </SheetHeader>
//         <SheetClose asChild>
//             <Button type="submit">Save changes</Button>
//           </SheetClose>
//         <SheetFooter>
        
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   )
// }
