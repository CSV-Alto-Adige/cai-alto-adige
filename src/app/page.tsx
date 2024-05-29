import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Hero from "@/components/hero";
import EventsTable2 from "@/components/nextUITable/eventsTable";


async function getEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
	return directus.request(
		readItems('activities', {
      filter: {
        status: {
          _eq: 'published'
        },
        Data_inizio: {
          _gte: today.toISOString() // Filter events starting from today
        }
      },
      limit: 2000,
      sort: ['Data_inizio'],
		})
	);
}

export default async function Home() {

  const activities = await getEvents();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Hero/>
      <EventsTable2 activities={activities}/>
    </main>
  );
}
