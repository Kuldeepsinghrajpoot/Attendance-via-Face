'use client'

import React from 'react';
import Link from 'next/link';
import { RxDashboard } from "react-icons/rx";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GrStatusGood } from "react-icons/gr";
import { usePathname } from 'next/navigation';
// import Dashboard from '@/app/dashboard/page';
interface linkBar {
    title: string,
    url: string,
    icon: any,
    path: string,
}

const Navbar = () => {
    const router = usePathname();
    const linkBar: linkBar[] = [
        {
            'title': "Dashboard",
            'url': '/dashboard',
            'path': '/dashboard',
            'icon': <RxDashboard className='w-5 h-5' />
        }, {
            'title': "Quiz",
            'url': '../dashboard/quiz',
            path: '/dashboard/quiz',
            'icon': <IoMdAddCircleOutline className='w-5 h-5' />
        }, {
            'title': "Quiz Status",
            'url': '../dashboard/QuizStatus',
            path: '/dashboard/QuizStatus',
            'icon': <GrStatusGood className='w-5 h-5' />
        }
    ]
    return (
        <div className=' text-[#9C9AA6]  font-[public sans,  -apple-system,  blinkmacsystemfont,  segoe ui,  oxygen,  ubuntu,  cantarell,  fira sans,  droid sans,  helvetica neue,  sans-serif, tabler-icons, font awesome 6 free, open sans] sticky top-0 z-50 flex justify-between  overflow-hidden shadow-md'>
            <div className=' flex justify-between w-full '>
                <div className='  hidden xl:block w-80 h-screen text-foreground bg-background'>
                    <div>
                        <div className=' mix-blend-normal px-4 gap-5 my-5 w-full h-full flex justify-center items-center text-center'>
                            <div className='w-10 h-10 flex justify-center items-center text-center'>
                                <img className='  mix-blend-multiply' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN1NAnlhSMbhwPtdLoWbm4WkAQu5qpPH_Hzw&usqp=CAU" alt="" />
                            </div>
                            <div className=' font-semibold text-md '>Typing Speed</div>
                        </div>
                        <div>
                        </div>
                    </div>
                    <div className='px-2 py-0'>
                        {linkBar.map(({ title, url, icon, path }: linkBar, index: number) => (
                            <div key={index} className='py-1'>
                                <Link href={url} className={`flex px-3 py-3 text-sm hover:rounded-md hover:text-primary-foreground hover:bg-primary/60 gap-5 items-center ${router === path ? 'text-primary-foreground rounded-md bg-primary shadow-md ' : ''}`}>
                                    <div>{icon}</div>
                                    <div>{title}</div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
