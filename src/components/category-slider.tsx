import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CategoryCard from './category-card';

interface CategorySliderProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
  events: Array<{ Attivita: string }>; // Adjust this type according to your event structure
}

// A mapping of activity names to their associated image URLs
const defaultImage = "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png";
const fallbackImages = {
  "Alpinismo": defaultImage,
  "Arrampicata": defaultImage,
  // Add other known activities here or use one fallback image
};

// Function to count the number of activities per type
function countActivitiesPerType(events: Array<{ Attivita: string }>) {
  return events.reduce((acc, event) => {
    const activityType = event.Attivita;
    acc[activityType] = (acc[activityType] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
}

export default function CategorySlider({ events, onCategorySelect, selectedCategory }: CategorySliderProps) {
  // Count activities per type dynamically
  const activitiesPerType = countActivitiesPerType(events);

  // Extract unique activity types dynamically
  const uniqueActivityTypes = Array.from(
    new Set(events.map(event => event.Attivita))
  ).map((name, index) => ({
    id: index + 1,
    name,
  }));

  return (
    <section className='mt-5 mb-8 lg:mb-20'>
      <Carousel className=''>
        <div className="flex flex-col gap-y-3 mx-2 md:h-10 md:flex-row md:items-center mb-6">
          <div className="text-base font-semibold text-zinc-800 uppercase lg:-mb-5">Categorie</div>
          <div className="hidden lg:flex space-x-0 md:ml-auto mr-12 relative">
            <CarouselPrevious className='ml-2 h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer'/>
            <CarouselNext className='h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer bg-[#0E4D71] text-white'/>
          </div>
        </div>
        <CarouselContent>
          {uniqueActivityTypes.map((activityType) => (
            <CarouselItem key={activityType.id} className='md:basis-1/2 lg:basis-1/5'>
              <CategoryCard activityType={activityType} onCategorySelect={onCategorySelect} selectedCategory={selectedCategory} count={activitiesPerType[activityType.name] || 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
