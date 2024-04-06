
import React from 'react'
import Navbar from './Navbar'
import Carousel from './LandingPage/Carousel/page'
import About from './LandingPage/About/page'
import Work from './LandingPage/Work/page'
import Footer from './LandingPage/Footer/page'

export default function LandingPage() {


  return (
    <>
      <Navbar />

      <div className=' '>
        <Carousel />
      </div>
      <div className='px-5 rounded-md '>
        <About />
        <Work />
      </div>
      <Footer />
    </>

  )
}