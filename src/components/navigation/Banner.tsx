"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import Autoplay from 'embla-carousel-autoplay'
import ClientSideRouter from "../ClientSideRouter"  

const Banner = ({ announcements }: any) => {
  return (
    <Carousel className="py-4 bg-[#0e4d71] relative z-50"
    plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      opts={{
        align: "start",
        loop: true,
      }}
    >
              <CarouselContent>
                {announcements.map((announcement: any) => (
                    <CarouselItem key={announcement.id}>
                    <ClientSideRouter route={`/news/${announcement.slug}`}>
                      <div className="">
                        <h3 className="text-white text-center md:text-xl px-4">{announcement.title}</h3>
                      </div>
                    </ClientSideRouter>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
  )
}

export default Banner