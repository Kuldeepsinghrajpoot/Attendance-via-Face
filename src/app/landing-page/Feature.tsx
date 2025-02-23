"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Clock, CheckCheckIcon, ShieldCheckIcon, Zap } from "lucide-react"

const features = [
  {
    title: "Real-Time Face Recognition",
    description: "Instantly identify and log attendance with advanced facial recognition technology.",
    icon: Clock,
  },
  {
    title: "Automated Attendance Reports",
    description: "Generate comprehensive reports with just a click, saving time and reducing errors.",
    icon: CheckCheckIcon,
  },
  {
    title: "Secure and Reliable System",
    description: "Rest easy knowing your data is protected with state-of-the-art security measures.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Seamless Integration",
    description: "Effortlessly connect with your existing tools and workflows for maximum efficiency.",
    icon: Zap,
  },
]

export default function Features() {
  return (
    <section className="py-16 bg-[#F8F7FA]  dark:bg-inherit h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-primary sm:text-5xl">Why Choose Our System?</h2>
          <p className="mt-6 text-lg text-gray-600">
            Experience an efficient and hassle-free attendance system designed for accuracy and ease of use.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 py-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="w-[290px] h-[400px] border  shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out flex flex-col justify-between">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-5 bg-primary rounded-full text-white dark:text-black">
                    <feature.icon className="w-12 h-12" />
                  </div>
                  <CardTitle className="mt-6 text-2xl font-semibold text-gray-900 dark:text-primary text-center">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-8 pb-8">
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
