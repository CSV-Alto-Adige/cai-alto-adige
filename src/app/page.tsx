import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Hero from "@/components/hero";
import { getActivities } from "@/lib/actions/getActivities";
import { DataTable } from "@/components/table/data-table";
import { columns } from "@/components/table/columns";
import { getTotalActivities } from "@/lib/actions/getTotalActivities";
import { getAllActivities } from "@/lib/actions/getAllActivities";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    start?: string;
    end?: string;
    sezione?: string;
    gruppo?: string;
    difficolta?: string;
    elevMin?: string;
    elevMax?: string;
    categoria?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const start = searchParams?.start || "";
  const end = searchParams?.end || "";

  const sezioneParam = searchParams?.sezione || "";
  const sezioneArray = sezioneParam ? sezioneParam.split(",") : [];

  const gruppoParam = searchParams?.gruppo || "";
  const gruppoArray = gruppoParam ? gruppoParam.split(",") : [];

  const difficoltaParam = searchParams?.difficolta || "";
  const difficoltaArray = difficoltaParam ? difficoltaParam.split(",") : [];

  const elevMinParam = searchParams?.elevMin || "";
  const elevMaxParam = searchParams?.elevMax || "";
  const elevMin = elevMinParam ? parseInt(elevMinParam, 10) : undefined;
  const elevMax = elevMaxParam ? parseInt(elevMaxParam, 10) : undefined;

  const categoria = searchParams?.categoria || "";

  const filters = {
    start,
    end,
    sezione: sezioneArray,
    gruppo: gruppoArray,
    difficolta: difficoltaArray,
    elevMin,
    elevMax,
    categoria,
  };

  const activities = (await getActivities(filters, query, currentPage)) || [];
  const allActivities = await getAllActivities();
  const totalActivities = (await getTotalActivities(filters, query)) || "0";

  return (
    <main className="flex min-h-screen flex-col items-center justify-between pb-24">
      <Hero />
      {/* <EventsTable2 activities={activities} /> */}
      <div className="max-w-[85rem] mx-auto">
        <DataTable
          columns={columns}
          data={activities}
          allData={allActivities}
          totalActivities={parseInt(totalActivities)}
        />
      </div>
    </main>
  );
}
