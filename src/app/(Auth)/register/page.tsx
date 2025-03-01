'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/schema/signUpSchema"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { format } from "date-fns"
import Image from "next/image"

export default function Register() {
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      Firstname: '',
      lastname: '',
      password: '',
      email: '',
      avatar: undefined,
      rollNumber: ''
    }
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'avatar' && data[key]) {
        for (const file of data[key]) {
          formData.append('avatar', file);
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/signup`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: format(new Date(), "MMM dd, yyyy"),
          action: <ToastAction altText="Success">Account Created!</ToastAction>,
        });
        reset();
      } else {
        toast({
          title: "Error",
          description: "Something went wrong!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen">
      {/* Left Side - Image */}
      <div className="hidden md:flex w-1/2 h-screen items-center justify-center ">
        <Image
          width={1000}
          height={1000}
          src="/auth-register-multisteps-illustration.png"
          alt="register"
          className="w-[40%] h-auto"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex justify-center px-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">Create an Account</CardTitle>
            <CardDescription className="text-center">Join us today!</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" {...register('Firstname')} />
                    {errors.Firstname && <p className="text-red-500 text-xs">{errors.Firstname.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input id="lastname" placeholder="Doe" {...register('lastname')} />
                    {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname.message}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" placeholder="john@example.com" id="email" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input id="rollNumber" placeholder="0901CS..." {...register('rollNumber')} />
                  {errors.rollNumber && <p className="text-red-500 text-xs">{errors.rollNumber.message}</p>}
                </div>

                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input type="file" id="avatar" {...register('avatar')} className="cursor-pointer" />
                  {errors.avatar && <p className="text-red-500 text-xs">{errors.avatar.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" placeholder="********" id="password" {...register('password')} />
                  {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full">Sign Up</Button>

                <Button variant="outline" className="w-full">Sign Up with GitHub</Button>

                <p className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/" className="underline text-blue-600">Sign in</Link>
                </p>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
