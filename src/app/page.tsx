import React from 'react';
import Navbar from './Navbar';
import HeroSection from './landing-page/HeroSection';
import Features from './landing-page/Feature';
import Footer from './landing-page/footer';

export default function LandingPage() {
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
