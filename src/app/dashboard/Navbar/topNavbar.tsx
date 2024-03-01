// import { Login } from '@/app/auth/page';
import React from 'react';
import  {SideBar}  from './sideBar';
import Login from '@/app/auth/page';
import { DropdownMenuDemo } from './profile';
// import Login from '../auth/page';
import { motion } from "framer-motion"
const NavBarItem = () => {
    return (
        <div className='w-full   sticky top-0 z-50  backdrop-blur-sm bg-white/30 overflow-hidden   text-black xl:flex  xl:flex-col xl:justify-start gap-5 py-2 px-7 my-0 dark:bg-white dark:text-black'>
            {/* <Button>click</Button> */}
            <div className='   h-fit bg-white  px-5  py-3 rounded-md   shadow-gray-200  overflow-hidden drop-shadow-md '>
                <div className='xl:flex xl:justify-between w-full gap-5 px-2 hidden '>
                    <div className='flex justify-between gap-5'>
                        <input type="text" />
                    </div>
                    <div><DropdownMenuDemo/> </div>
                </div>
                <div className='xl:hidden flex justify-between px-4'>
                    <div className=' text-xl'> <SideBar /></div>
                    <div><DropdownMenuDemo/> </div>
                </div>
            </div>

        </div>
    );
}

export default NavBarItem;
