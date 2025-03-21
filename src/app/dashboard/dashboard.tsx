"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
    Bell,
    Home,
    Menu,
    User,
    Plus,
    UserCircle2,
    TimerIcon,
    PlusCircle,
    CheckCheck,
    UserCog,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SwitchDemo } from "../switch";
import React from "react";

export default function Dashboard({ children }: { children: any }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    // Define navigation items
    const navItems = React.useMemo(
        () => [
            { name: "Dashboard", icon: Home, href: "/dashboard" },
            {
                name: "Mark Attendance",
                icon: CheckCheck,
                href: "/dashboard/attendance",
            },
            {
                name: "Mark Attendance",
                icon: CheckCheck,
                href: "/dashboard/mark-attendace",
            },

            { name: "Student", icon: User, href: "/dashboard/student" },
            {
                name: "Add Subject",
                icon: PlusCircle,
                href: "/dashboard/add-subject",
            },
            {
                name: "Add branch",
                icon: PlusCircle,
                href: "/dashboard/add-branch",
            },
            {
                name: "Schedule Attendance",
                icon: TimerIcon,
                href: "/dashboard/schedule-attendance",
            },
            { name: "Role", icon: UserCog, href: "/dashboard/role" },
            {
                name: "Enroll Student",
                icon: UserCog,
                href: "/dashboard/enroll-student",
            },
        ],
        []
    );
    // Filter navigation items based on the user's role
    // Filter navigation items based on the user's role
    const filteredNavItems = React.useMemo(() => {
        if (user?.role?.role === "STUDENT") {
            return navItems.filter(
                (item, index) =>
                    ["Dashboard", "Settings", "Mark Attendance"].includes(item.name) &&
                    index !== 2 // Hide second "Mark Attendance" for students
            );
        } else if (user?.role?.role === "TEACHER") {
            return navItems.filter(
                (item, index) => !(item.name === "Mark Attendance" && index === 1) // Hide first "Mark Attendance" for teachers
            );
        }
        return navItems; // Default: Show all items for other roles
    }, [user?.role?.role]);


    return (
        <div className="grid min-h-screen relative  z-20 w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr] ">
            {/* Sidebar */}
            <div className="hidden border-r md:block">
                <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 bg-background">
                    {/* Sidebar Header */}
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-background">
                        <Link
                            href="/dashboard"
                            prefetch={false}
                            className="flex items-center gap-2 font-semibold"
                        >
                            <Image
                                src="/vercel.svg"
                                alt="logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <span>Attendance</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto h-8 w-8"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="sr-only">
                                Toggle notifications
                            </span>
                        </Button>
                    </div>

                    {/* Sidebar Navigation */}
                    <div className="flex-1  bg-background px-2 lg:px-4">
                        <nav className="grid  items-start text-sm font-medium gap-1">
                            <span className="capitalize text-sm font-medium my-1">
                                DASHBOARD
                            </span>
                            {filteredNavItems
                                .filter((_, index) => index === 0)
                                .map((item, index) => (
                                    <Link
                                        prefetch={false}
                                        key={index}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded px-3 py-2 transition-all hover:text-primary hover:bg-muted ${pathname === item.href
                                                ? "  bg-primary text-white "
                                                : " "
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}

                            <span className="capitalize text-sm font-medium my-1">
                                APPS & PAGES
                            </span>
                            {filteredNavItems
                                .filter((_, index) => index !== 0)
                                .map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded  px-3 py-2 transition-all hover:text-primary hover:bg-muted ${pathname.replace(/\?.*/, "").split("/")[2] === item.href.replace(/\?.*/, "").split("/")[2]
                                                ? "bg-primary text-white"
                                                : ""
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <div>
                                            {item.name}

                                        </div>
                                    </Link>
                                ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col z-20 ">
                {/* Top Navigation Bar */}
                <nav className="flex h-14   items-center bg-background z-20 gap-4 border-b px-4 lg:h-[60px] lg:px-6 sticky top-0">
                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <span className="capitalize text-sm font-medium my-1">
                                DASHBOARD
                            </span>
                            {filteredNavItems
                                .filter((_, index) => index === 0)
                                .map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            <span className="capitalize text-sm font-medium my-1">
                                APPS & PAGES
                            </span>
                            {filteredNavItems
                                .filter((_, index) => index !== 0)
                                .map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                        </SheetContent>
                    </Sheet>

                    {/* User Info & Dropdown */}
                    <div className="w-full">
                        Hi {session?.user?.Firstname || session?.user?.name} {session?.user?.role?.role}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="border-none">
                                <UserCircle2 className="w-9 h-9 border-none" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href="/dashboard/settings/profile">
                                    Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => signOut()}
                                className="cursor-pointer"
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SwitchDemo />
                </nav>

                {/* Main Page Content */}
                <main className="flex flex-1 flex-col gap-4 md:p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
