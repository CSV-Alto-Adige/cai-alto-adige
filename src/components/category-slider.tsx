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

interface CategorySliderProps {
  events: Array<{ name: string; count: number }>;
}

const defaultImage = "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png";
const fallbackImages = {
  Alpinismo: defaultImage,
  Arrampicata: defaultImage,
  // Add other known activities here or use one fallback image
};

export default function CategorySlider({ events }: CategorySliderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      <Carousel>
        <div className="flex flex-col gap-y-3 mx-2 md:h-10 md:flex-row md:items-center mb-6">
          <div className="text-base font-semibold text-zinc-800 uppercase lg:-mb-5">
            Categorie
          </div>
          <div className="hidden lg:flex space-x-0 md:ml-auto mr-12 relative">
            <CarouselPrevious className="ml-2 h-10 w-10" />
            <CarouselNext className="h-10 w-10 bg-[#0E4D71] text-white" />
          </div>
        </div>
        <CarouselContent>
          {events.map((activityType, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
              <CategoryCard
                activityType={{ id: index + 1, name: activityType.name }}
                onCategorySelect={handleCategorySelect}
                selectedCategory={selectedCategory}
                count={activityType.count}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
