import HeroTest from "@/components/hero-test";
import TypographyH1 from "@/components/typography/TypographyH1";
import Image from "next/image";
import TypographyLead from "@/components/typography/TypographyLead";
import Table from "@/components/table/table";
import CategorySlider from "@/components/category-slider";
import EventsTable from "@/components/nextUITable/events-table";
import MainHeader from "@/components/navigation/main-header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <MainHeader/>
      <HeroTest/>
      <EventsTable/>
    </main>
  );
}
