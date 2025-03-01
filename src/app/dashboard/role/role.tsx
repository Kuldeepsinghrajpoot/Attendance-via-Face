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
import {signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { User2 } from "lucide-react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React, {useState } from "react";
import { RoleSchema } from "@/schema/role-schema";

const MySwal = withReactContent(Swal)

export function RoleForm() {

  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redirect to dashboard if user is logged in
  
  const form = useForm<RoleSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<RoleSchema> = async (values) => {

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
          text: 'Role is created.',
          timer: 2000,
          showConfirmButton: false,
        });

        setDialogOpen(false);
        form.reset();
        
      } else {
        form.reset()
        setDialogOpen(false);

        Swal.fire({
          icon: "error",
          title: "invalid details",
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
        <Button className=" p-4" variant="outline">
          <User2 />
          <span>Add Role</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">Add Role</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            Add role of the new User
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
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Role" {...field} />
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
               Register
              </Button>
            </DialogFooter>
          </form>
          
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
