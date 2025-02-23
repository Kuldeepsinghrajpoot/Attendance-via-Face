import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="max-w-8xl mx-auto text-center py-16 px-6  gap-36">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center ">
        
        {/* Left Side - Text Content */}
        <div className=' px-10'>
          <h1 className=" text-5xl w-full font-bold leading-tight  text-gray-700">
            AI-Powered Face Recognition Attendance
          </h1>
          <p className="mt-4  text-lg text-gray-500">
            Revolutionizing attendance tracking with our advanced AI-driven face recognition system. 
            Say goodbye to manual registers and experience a secure, accurate, and hassle-free solution.
          </p>
          <ul className="mt-4 text-lg text-gray-500 text-left list-disc list-inside">
            <li>🚀 Instant & Accurate Attendance Marking</li>
            <li>🔒 Secure, Encrypted & Reliable</li>
            <li>📊 Automated Reports & Analytics</li>
            <li>📱 Mobile-Friendly & Easy to Use</li>
          </ul>
          <div className="mt-6">
            <Button className=" rounded shadow-none">
              Get Started
            </Button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center ">
          <Image 
            src="../../../hero.svg" 
            alt="Face Recognition Illustration"
            width={500} 
            height={400}
            className=""
          />
        </div>
      </div>
    </div>
  );
}
