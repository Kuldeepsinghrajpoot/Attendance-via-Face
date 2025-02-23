'use client'

import { useSession } from 'next-auth/react';
import React from 'react';
import CardWithForm from './dashboard/card';
import { Chart } from './dashboard/chart';
import { Calendars } from './dashboard/calendar';
import { Subject } from './dashboard/subject-table';
import { BarChart, User } from 'lucide-react';


const cartItem = [{
  title: "Students",
  Icon: BarChart,
  data: 50,
}, {
  title: "Teacher",
  Icon: User,
  data: 50,
}, {
  title: "Attendance",
  Icon: User,
  data: 50,
}]
const Page = () => {


  return (
    <div className="p-4">
      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  justify-center">
        {cartItem.map((dataItem, key) => (
          <div className="flex justify-center" key={key}>
            <CardWithForm dataItem={dataItem} />

          </div>
        ))}
      </div>

      {/* Charts & Calendar Section */}
      <div className="flex flex-wrap justify-center  w-full gap-4 mt-6  ">
        <div className="flex-1 min-w-[300px] h-full">
          <Chart />
        </div>
        <div className=" h-full">
          <Calendars />
        </div>
      </div>
      <div className='bg-background  p-5 my-5 rounded'>
        <Subject />
      </div>
    </div>
  );
};

export default Page;
