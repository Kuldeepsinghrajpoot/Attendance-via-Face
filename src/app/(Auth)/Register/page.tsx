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
import Navbar from "@/app/Navbar"
import { signUpSchema } from "@/schema/signUpSchema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserSchema } from '@/schema/UserSchema'

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import { format } from "date-fns"

export default function Register() {
  const { toast } = useToast()

  const UserValidatation = {
    Firstname: '',
    lastname: '',
    password: '',
    email: '',
    avatar: File,
    rollNumber: ''
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: UserValidatation
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'avatar') {
        const files = data[key];
        for (let i = 0; i < files.length; i++) {
          formData.append('avatar', files[i]);
        }
      } else {
        formData.append(key, data[key]);
      }
    }
    try {
      const response = await fetch('http://localhost:3000/api/signup-user', {
        method: 'POST',
        body: formData
      });

      console.log('user validation data', data)
      // avatar of user
      // console.log('avatar of user',formData.avatar)
      if (response.ok) {
        toast({
          title: "Account ",
          description: format(new Date(),"MMM-DDD-YYY"),
          action: (
            <ToastAction altText="Goto schedule to undo">Account Created successfully!</ToastAction>
          ),
        })
        reset({
          Firstname: '',
          lastname: '',
          password: '',
          email: '',
          avatar: File,
          rollNumber: ''
        });
        console.log('Form submitted successfully!');
        
      } else {
        console.error('Form submission failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred while submitting form:', error);
    }
  };
  return (
    <>
      <Navbar />
      <Card className=" mx-5 mt-10 md:mx-auto max-w-sm ">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="First name" {...register('Firstname')} />
                  {errors.Firstname && <span>{errors.Firstname.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input id="lastname" placeholder="Last name" {...register('lastname')} />
                  {errors.lastname && <span>{errors.lastname.message}</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email name</Label>
                <Input type="email" placeholder="kuldeep@utkarsh.in" id="email" {...register('email')} />
                {errors.email && <span>{errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" placeholder="0901CS......" {...register('rollNumber')} />
                {errors.rollNumber && <span>{errors.rollNumber.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Avatar">Photo</Label>
                <Input type="file" id="Avatar" multiple  {...register('avatar')} />
                {errors.avatar && <span>{errors.avatar.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="Password">Password</Label>
                <Input type="password" placeholder="********" id="Password" {...register('password')} />
                {errors.password && <span>{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full">
                Sign up with GitHub
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/Login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </>
  );
}
