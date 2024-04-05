import HeroTest from "@/components/hero-test";
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
