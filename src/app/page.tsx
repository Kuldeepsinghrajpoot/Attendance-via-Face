'use client'
import React from 'react';
import Navbar from './Navbar';
import HeroSection from './landing-page/HeroSection';
import Features from './landing-page/Feature';
import Footer from './landing-page/footer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function LandingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
  
    // Redirect to dashboard if user is logged in
    React.useEffect(() => {
      if (status === 'authenticated') {
       router.replace("/dashboard")
      }
    }, [status, router]);
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className=" py-20 text-center ">
        <HeroSection />
      </section>

      {/* About Section */}
      <section className="px-6 py-10">
        {/* <About /> */}
      </section>

      {/* Features Section */}
      <section className=" py-12">
        <Features />
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
