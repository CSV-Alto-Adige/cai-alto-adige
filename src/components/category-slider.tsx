import React, { startTransition, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CategoryCard from "./category-card";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity } from "../../types";

interface CategorySliderProps {
  events: Array<{ Attivita: string }>;
}

// A mapping of activity names to their associated image URLs
const defaultImage = "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png";
const fallbackImages = {
  Alpinismo: defaultImage,
  Arrampicata: defaultImage,
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

export default function CategorySlider({ events }: CategorySliderProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();
  // Count activities per type dynamically
  const activitiesPerType = countActivitiesPerType(events);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique activity types dynamically
  const uniqueActivityTypes = Array.from(
    new Set(events.map((event) => event.Attivita))
  ).map((name, index) => ({
    id: index + 1,
    name,
  }));

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if (category) {
        params.set("categoria", category);
      } else {
        params.delete("categoria");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <section className="mt-5 mb-8 lg:mb-20">
      <Carousel className="">
        <div className="flex flex-col gap-y-3 mx-2 md:h-10 md:flex-row md:items-center mb-6">
          <div className="text-base font-semibold text-zinc-800 uppercase lg:-mb-5">
            Categorie
          </div>
          <div className="hidden lg:flex space-x-0 md:ml-auto mr-12 relative">
            <CarouselPrevious className="ml-2 h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer" />
            <CarouselNext className="h-10 w-10 transition duration-200 border shadow-sm inline-flex items-center justify-center font-medium cursor-pointer bg-[#0E4D71] text-white" />
          </div>
        </div>
        <CarouselContent>
          {uniqueActivityTypes.map((activityType) => (
            <CarouselItem
              key={activityType.id}
              className="md:basis-1/2 lg:basis-1/5"
            >
              <CategoryCard
                activityType={activityType}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                count={activitiesPerType[activityType.name] || 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
