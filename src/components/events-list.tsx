import { getActivities } from "@/lib/actions/getActivities";
import { getActivityFilters } from "@/lib/actions/getActivitiesFilters";
import React from "react";
import { DataTable } from "./table/data-table";
import { columns } from "./table/columns";

export default async function EventsList(props: {
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

  const [activitiesResult, filterOptions] = await Promise.all([
    getActivities(filters, query, currentPage),
    getActivityFilters(),
  ]);

  const activities = activitiesResult?.activities ?? [];
  const totalActivities = activitiesResult?.total ?? 0;
  return (
    <DataTable
      columns={columns}
      data={activities || []}
      totalActivities={parseInt((totalActivities ?? "0").toString())}
      filters={filterOptions}
    />
  );
}
