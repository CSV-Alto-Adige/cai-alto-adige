import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import CategoryCard from './category-card'

interface CategorySliderProps {
  onCategorySelect: (category: string) => void;
  activitiesPerType: { [key: string]: number };
  selectedCategory: string | null;
}

const activityTypes = [
    {
      id: 1,
      name: "Alpinismo",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 2,
      name: "Arrampicata",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 3,
      name: "Ciaspolata",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 4,
      name: "Cicloturismo",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 5,
      name: "Escursionismo",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 6,
      name: "Ferrata",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 7,
      name: "Palestra",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 8,
      name: "Scialpinismo",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 9,
      name: "Speleologia",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 10,
      name: "Torrentismo",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
    {
      id: 11,
      name: "Evento sociale",
      image: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
    },
];

export default function CategorySlider({ onCategorySelect, activitiesPerType, selectedCategory }: CategorySliderProps) {

  return (
    <section className='mt-5 mb-8 lg:mb-20'>
        <Carousel className=''>
            <div className="flex flex-col gap-y-3 mx-2 md:h-10 md:flex-row md:items-center mb-6">
                <div className="text-base font-semibold text-zinc-800 uppercase lg:-mb-5">Categorie</div>
                <div className="hidden lg:flex space-x-0 md:ml-auto mr-12 relative">
                    <CarouselPrevious className='ml-2 h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed rounded-[0.5rem] text-slate-600 dark:text-slate-300'/>
                    <CarouselNext className='h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer  [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed rounded-[0.5rem] bg-[#0E4D71] text-white dark:text-slate-300'/>
                </div>
            </div>
            <CarouselContent>
              {activityTypes.map((activityType) => (
                <CarouselItem key={activityType.id} className='md:basis-1/2 lg:basis-1/5 '>
                  <CategoryCard activityType={activityType} onCategorySelect={onCategorySelect} selectedCategory={selectedCategory}  count={activitiesPerType[activityType.name] || 0} />  
                </CarouselItem>
              ))}
            </CarouselContent>
        </Carousel>
    </section>
  )
}
