'use client'
import { LogOut, Settings, User, User2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"


export function DropdownMenuDemo() {
  const { data: session, status } = useSession()


  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>

        <div className="mx-5 h-full w-full cursor-pointer">
        <img
    className="gap-5 object-cover h-10 w-10 rounded-full"
    src={`${ session?.user?.image ||'/temp/'+session?.user?.avatar ||"https://hospital-bay-rho.vercel.app/_next/image?url=%2Fimg%2Favatars%2F1.png&w=128&q=75" }`}
    alt=""
/>


        </div>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56    ">
        <DropdownMenuLabel className=" text-gray-700 dark:text-white">

        <div className="flex justify-start h-full w-full items-center text-center">
    <div className="w-14 h-10 gap-5 flex justify-center items-center rounded-full object-center">
        <img className="rounded-full" src={`${session?.user?.image || '/temp/' + session?.user?.avatar || "https://hospital-bay-rho.vercel.app/_next/image?url=%2Fimg%2Favatars%2F1.png&w=128&q=75"}`} alt="user image" />
    </div>
    <div className="items-center capitalize w-full h-full">
        <div className="w-full h-full">
            <h6>{session?.user?.Firstname || session?.user?.name}</h6>
        </div>
    </div>
</div>

        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-[#545454] dark:text-foreground">
            <User className="mr-2   w-4" />
            <span className=" cursor-pointer">Profile</span>

          </DropdownMenuItem>

          <DropdownMenuItem className="text-[#545454] dark:text-foreground">
            <Settings className="mr-2 h-4 w-4" />
            <span className=" cursor-pointer">Settings</span>

          </DropdownMenuItem>

        </DropdownMenuGroup>


        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-[#545454] dark:text-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          <span className="cursor-pointer" onClick={() => { signOut() }}>Log out</span>
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}
