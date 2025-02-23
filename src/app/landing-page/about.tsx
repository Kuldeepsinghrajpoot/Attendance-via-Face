'use client'
import React from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function About() {
    return (
        <section className="relative w-full py-16  shadow-sm">
            <div className="max-w-6xl mx-auto text-center px-6">
                <motion.h2
                    className="text-4xl font-bold text-gray-900 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    About Our Platform
                </motion.h2>

                {/* Feature Cards */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[   
                        {
                            title: "Lightning Fast",
                            icon: "🚀",
                            description: "Instantly marks attendance with AI-powered face recognition.",
                            color: "bg-blue-500"
                        },
                        {
                            title: "Ultra Secure",
                            icon: "🔒",
                            description: "End-to-end encryption ensures safe & private data handling.",
                            color: "bg-green-500"
                        },
                        {
                            title: "Smart Reports",
                            icon: "📊",
                            description: "Generate real-time attendance reports & analytics in one click.",
                            color: "bg-purple-500"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="hover:scale-105 transition-transform transform relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.2 }}
                        >
                            <Card className="shadow-lg border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow">
                                <CardHeader className="flex flex-col items-center text-center">
                                    <div className={`${item.color} text-white text-5xl p-4 rounded-full shadow-md`}>
                                        {item.icon}
                                    </div>
                                    <CardTitle className="mt-4 text-xl font-semibold">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-gray-700 text-sm mt-2">
                                    {item.description}
                                </CardContent>
                                <CardFooter className="mt-4">
                                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition">
                                        Learn More
                                    </button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
