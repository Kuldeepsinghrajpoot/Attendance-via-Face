import type { Metadata } from "next";

interface RootLayoutProps {
  children: React.ReactNode;
}
import { Inter, M_PLUS_1 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
// import Navbar from "./Navbar/page";
// import NavBarItem from "./Navbar/topNavbar";
// import Navbar from "@/dashboad/Navbar.tsx/page";
// import NavBarItem from "@/dashboad/Navbar.tsx/navBarItem";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./Provider";
import { Toaster } from "@/components/ui/toaster"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// context api
export default function RootLayout({
  children,
}:RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn("   h-full   antialiased   dark:bg-zinc-900 text-black dark:text-white  w-full ",
       
       )}
       data-new-gr-c-s-check-loaded="14.1209.0"
       data-gr-ext-installed=""
       >
        {/* <Navbar/> */}
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <AuthProvider>
          <NextTopLoader />

       
          {children}
        
        </AuthProvider>
        <Toaster />
        <ToastContainer/>
        </ThemeProvider>
      </body>
     
    </html>
  );
}
