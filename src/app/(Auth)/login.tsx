'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginType, signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {User2 } from "lucide-react";
import Swal from 'sweetalert2'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React from "react";


export function Login() {
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Redirect to dashboard if user is logged in

  const Router = useRouter()
  if (status === 'authenticated') {
    Router.replace('/dashboard');
    // return null; // Return null to prevent rendering Login component
  }
  const form = useForm<LoginType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const onSubmit: SubmitHandler<LoginType> = React.useCallback(async (values: LoginType) => {
  
    Swal.fire({
      title: 'Please wait...',
      text: 'Logging in...',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading();
      }
  });  // e.preventDefault(); // Prevent default form submission behavior
    try {
      const { email, password } = values;
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      Swal.close();

      if (res?.ok) {
          Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'You have been logged in.',
              timer: 2000,
              showConfirmButton: false
          });

          setIsDialogOpen(false);
          Router.replace('/dashboard');
          setIsDialogOpen(false);
          form.resetField;
      } else {

          Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: 'Failed to login.',
          });
      }
  
    } catch (error) {
      console.error("Error during form submission:", error);
      alert('Something went wrong');
    }
  },[Router])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-1" variant={"ghost"}>
          <div className=" ">
            <User2 />
          </div>
          <span>
            Login
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">Welcome Back</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Sign in to your account to continue.
            </DialogDescription>
          </DialogHeader>
        </DialogHeader>
        <FormProvider {...form}>
          <div className="grid gap-4 py-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email / Phone</FormLabel>
                    <FormControl>
                      <div className="flex justify-start gap-2 items-center">
                        {/* <Mail /> */}
                        <Input placeholder="Email" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex justify-start gap-2 items-center">
                        {/* <Lock /> */}
                        <Input type="password" placeholder="Password" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="w-full py-4">
                
                <Button type="submit" className="w-full" variant={"default"}>Login</Button>
              </DialogFooter>
            </form>
            <Button type="button"  onClick={() => signIn('google')} variant="outline" className="w-full">
              Login with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register">
                Sign up
              </Link>
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
