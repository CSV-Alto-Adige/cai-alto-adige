"use client"

import Image from 'next/image'
import React from 'react'
import CardImage from '@/assets/alpinismo.jpg'

interface ActivityTypeProps {
  id: number;
  image: string;
  name: string;
}

interface CategoryCardProps {
  onCategorySelect: (category: string) => void;
  activityType: {
    id: number;
    name: string;
    image: string;
  };
  count: number;
  selectedCategory: string | null;
}
export default function CategoryCard({ onCategorySelect, activityType, count, selectedCategory }: CategoryCardProps) {

  const isDisabled = selectedCategory == activityType.name;
  const cardClass = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <div className={`relative group ${cardClass}`} onClick={() => onCategorySelect(activityType.name)}>
        <Image src={CardImage} alt='Alpinismo' className='group-hover:bg-opacity-10 rounded-xl h-full dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]'/>
        <div className="p-3 h-auto bg-white flex items-center color-inherit subpixel-antialiased bg-background/10 backdrop-blur backdrop-saturate-150 justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute bottom-3 left-1/2 -translate-x-1/2 before:rounded-xl rounded-large shadow-small ml-1 z-10">
            <p className="text-black mr-2 p-2">{activityType.name}</p>
            <p className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-unit-3 min-w-unit-16 h-unit-8 gap-unit-2 rounded-large [&amp;>svg]:max-w-[theme(spacing.unit-8)] data-[pressed=true]:scale-[0.97] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover text-tiny text-white bg-[#0E4D71]">{count} Attività</p>
        </div>
    </div>
  )
}
