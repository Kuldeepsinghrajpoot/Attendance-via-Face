'use client'

import React, { useState, useEffect } from 'react';
import Camera from '@/app/Camera/page'
const Register = () => {
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [photoData, setPhotoData] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // const formData = new FormData();
        // formData.append('fullName', fullName);
        // formData.append('email', email);
        // formData.append('password', password);
        // // formData.append('photo', photoData);

        try {
            const response = await fetch('http://localhost:3000/api', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    photoData,
                }),
            });

            if (response.ok) {
                console.log('Registration successful');
                setFullName('');
                setEmail('');
                setPassword('');
                setPhotoData('');
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };
    const handleCapture = (dataURL: string) => {
        setPhotoData(dataURL);
        // console.log(dataURL);

        
    };

    useEffect(() => {
        // Assuming you have a way to trigger photo capture
        handleCapture('');
    }, []);
    // bg-cover bg-[url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReTPsA0pVPdsprTcxIdesy10IYQWq1Y6daBk_TxUnYUR0jymrrQZ3o_qAGK2PuXMUg-Ro&usqp=CAU")]
    return (
        <div className=' h-screen w-full flex justify-center items-center'>
            <div className=' rounded-md   overflow-hidden'>

                <div className='  rounded-md overflow-hidden  '>
                    <form onSubmit={handleSubmit} className='backdrop-blur-md bg-white/30   gap-3  overflow-hidden  rounded-md py-10 px-10 '>
                        {/* <div className='flex justify-center font-extrabold gap-3 text-2xl'> Registration Form</div> */}

                        {/* {name:} */}
                        <div className='grid grid-cols-2 gap-5 px-10 py-10  w-full'>
                            <div className='grid grid-flow-row'>
                                <label htmlFor="name">Roll Number</label>
                                <input onChange={(e) => setFullName(e.target.value)} value={fullName} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md  px-5 hover: border-r-gray-100' type="text" placeholder='Roll Number' />
                            </div>
                            {/* <div className='grid grid-flow-row'>
                                <label htmlFor="name">First Name</label>
                                <input onChange={()=>} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md  px-5 hover: border-r-gray-100' type="text" placeholder='Firstname' />
                            </div> */}
                            {/* <div className='grid grid-flow-row'>
                                <label htmlFor="name">Last Name</label>
                                <input onChange={()=>} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md r px-5 hover: border-r-gray-100' type="text" placeholder='Last name' />
                            </div> */}
                            <div className='grid grid-flow-row'>
                                <label htmlFor="name">Email</label>
                                <input onChange={(e) => setEmail(e.target.value)} value={email} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md  px-5 hover: border-r-gray-100' type="text" placeholder='Email' />
                            </div>
                            <div className='grid grid-flow-row'>
                                <label htmlFor="name">Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md  px-5 hover: border-r-gray-100' type="text" placeholder='Passwod' />
                            </div>
                            {/* <div className='grid grid-flow-row'>
                                <label htmlFor="name">Password</label>
                                <input onChange={()=>} className=' bg-white/30 text-black outline-none  placeholder:text-gray-100 text-sm h-10  md:w-full rounded-md  px-5 hover: border-r-gray-100' type="text" placeholder='Passwod' />
                            </div> */}

                        </div>
                        <div className='  px-10'>
                            {/* <Camera onCapture={handleCapture} />
                             */}
                             <input type="file" />


                        </div>
                        <div className='flex justify-center h-[2.5rem]'>
                            <button type='submit' className=' w-[10rem]   items-center py-2 px-2 bg-blue-500 drop-shadow-md text-white rounded-md'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
