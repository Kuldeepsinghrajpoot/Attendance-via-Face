'use client'
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function CarouselPlugin() {

  const images = [{
    img:'https://border-now.com/wp-content/uploads/2022/11/scan_face.png'
  },{
    img:'https://miro.medium.com/v2/resize:fit:828/format:webp/1*TCKXw1W9-UAtpQcl13qIVw.jpeg'
  },
  {
    img:"https://thumbs.dreamstime.com/b/advanced-camera-system-collecting-crowd-insights-people-street-facial-recognition-running-surveillance-307429533.jpg?w=992"
  }

]

  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <div className="w-full h-full py-10">
    <div>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
     
      >
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={index}>
              <div className="h-[70vh] w-full">
                <div className="w-full h-full  rounded-md">
                  <CardContent className=" overflow-hidden object-fit w-full rounded-md h-full flex justify-center items-center">
                    <img className="object-fit w-full h-full rounded-md overflow-hidden" src={img.img} alt="" />
                  </CardContent>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </div>
  
  
  )
}
