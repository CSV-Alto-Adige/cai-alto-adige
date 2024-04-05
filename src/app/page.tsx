import Hero from "@/components/hero";
import EventsTable from "@/components/nextUITable/events-table";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Hero/>
      <EventsTable/>
    </main>
  );
}
