'use client'
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

interface question {
    question: any
}
interface Props {
    question: question[]
}
const Quiz: React.FC<Props> = ({ question }) => {
    const [currentPage, setCurrentPage] = useState(0);


    const questionsPerPage = 1; // Change this to adjust the number of questions per page

    const totalPages = Math.ceil(question.length / questionsPerPage);
    // console.log(question)
    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, question.length);

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };
    const handleSubmit = () => {
        // Logic to handle form submission
    };
    return (

        <div className=' '>

            <div className='flex justify-between px-7 py-5 gap-10 h-full w-full  text-foreground '>
                <div className='w-56'>
                    <Card className=' bg-background  shadow-gray-200 border-none rounded-sm  drop-shadow-md text-[#9C9AA6]  '>
                        <CardHeader>
                            <CardTitle className='text-xl font-extralight'>Card Title</CardTitle>
                            <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Card Content</p>
                        </CardContent>
                        <CardFooter>
                            <p>Card Footer</p>
                        </CardFooter>
                    </Card>
                </div>
                <div className=' w-full  h-full gap-5  px-5 py-5 flex flex-col justify-between '>

                    <>

                        <div className=' border-border bg-background flex px-5 py-4 mix-blend-color	shadow-inner	  justify-between bg-white  border-none   rounded-sm drop-shadow-md  text-[#9C9AA6]'>
                            <div>
                                <div>Subject - Digital Image Processing</div>
                                <div>Time : 20min</div>
                                <div>Date : {new Date().getFullYear()} - {new Date().getMonth() + 1} - {new Date().getDate()}</div>
                                <div>Number of Question :10</div>
                            </div>
                            <div>
                                <div>
                                    Name : Kuldeep Singh Rajpoot
                                </div>
                                <div>Roll Number : 0901CS213D06</div>
                                <div>Image : </div>
                            </div>

                        </div>
                        <div className=' px-20 py-5'>

                            <Card className=' shadow-inner border-none px-5 py-5 w-full h-full  rounded-sm drop-shadow-md  text-[#9C9AA6]  '>

                                {question.slice(startIndex, endIndex).map((item: any, key: number) => {
                                    const { Question, option1, option2, option3, option4 } = item
                                    // console.log(question)
                                    return (

                                        <div key={item.id}>

                                            <CardHeader>
                                                <CardTitle className='text-xl font-extralight  text-zinc-900'>{currentPage + 1} {Question}</CardTitle>
                                                {/* <CardDescription>Question : 01</CardDescription> */}
                                            </CardHeader>

                                            <CardContent>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms" className="" />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option1}
                                                    </label>
                                                </div>

                                            </CardContent>
                                            <CardContent>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms" className="" />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option2}
                                                    </label>
                                                </div>

                                            </CardContent>
                                            <CardContent>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms" className="" />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option3}
                                                    </label>
                                                </div>

                                            </CardContent>
                                            <CardContent>
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms" className="" />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        {option4}
                                                    </label>
                                                </div>

                                            </CardContent>
                                        </div>
                                    )
                                })}
                                <div className="  flex justify-between px-20 py-2">
                                    <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
                                        <GrPrevious />
                                    </Button>
                                    <span>{`Page ${currentPage + 1} of ${totalPages}`}</span>
                                    <Button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                                        <GrNext />
                                    </Button>
                                </div>
                                <div className="flex justify-end">

                                    <div>
                                        {currentPage === totalPages - 1 && ( // Render submit button only on the last page
                                            <Button onClick={handleSubmit}>Submit</Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </>

                </div>
            </div>


        </div>

    );
}

export default Quiz;
