'use client'

// Filename: NavBarItem.tsx

import React from 'react';
import { SideBar } from './sideBar';
import Login from '@/app/page';
import { DropdownMenuDemo } from './profile';
import { motion } from "framer-motion"
import { ModeToggle } from '@/darkMode/darkMode';
import { useSession } from 'next-auth/react';

const NavBarItem = () => {

    const { status ,data:session} = useSession();
    console.log(`session-${session?.user}`);
    
    return (
        status && (
            <div className='w-full   sticky top-0 z-50  backdrop-blur-sm bg-white/30 dark:bg-zinc-900 overflow-hidden   text-black dark:text-white xl:flex  xl:flex-col xl:justify-start gap-5 py-5 md:px-7 px-2 my-0'>
                <div className='h-fit bg-background px-5  py-3 rounded-md   shadow-gray-200  overflow-hidden drop-shadow-md'>
                    <div className='xl:flex xl:justify-between w-full gap-5 px-2 hidden '>
                        <div className='flex justify-between gap-5'>
                            <input type="text" />
                        </div>
                        <div className='flex justify-start items-center gap-2'>
                            <div className='flex justify-center items-center'><DropdownMenuDemo /></div>
                            <div><ModeToggle /></div>
                        </div>
                    </div>
                    <div className='xl:hidden flex justify-between px-4'>
                        <div className=' text-xl'> <SideBar /></div>
                        <div className='flex justify-start items-center gap-2'>
                            <div className='flex justify-center items-center'><DropdownMenuDemo /></div>
                            <div><ModeToggle /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default NavBarItem;
