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
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { User2 } from "lucide-react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, { useEffect, useState } from "react";

const MySwal = withReactContent(Swal)

export function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const form = useForm<LoginType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginType> = async (values) => {

    Swal.fire({
      title: 'Logging in...',
      text:"Please wait...",
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => Swal.showLoading(),
    });

    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      Swal.close();

      if (res?.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'You have been logged in.',
          timer: 2000,
          showConfirmButton: false,
        });

        setDialogOpen(false);
        form.reset();
        router.replace('/dashboard');
      } else {
        form.reset()
        setDialogOpen(false);

        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password.",
          confirmButtonColor :"red"
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again!",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(isOpen) => {
      setDialogOpen(isOpen);
      if (!isOpen) form.reset();
    }}>
      <DialogTrigger asChild>
        <Button className="space-x-1" variant="ghost">
          <User2 />
          <span>Login</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Welcome Back</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Sign in to your account to continue.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="w-full py-4">
              <Button type="submit" className="w-full" variant="default">
                Login
              </Button>
            </DialogFooter>
          </form>
          <Button type="button" onClick={() => signIn('google')} variant="outline" className="w-full">
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account? <Link href="/register" className="text-blue-600">Sign up</Link>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
