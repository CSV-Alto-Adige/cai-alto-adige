import { aggregate, readItems } from "@directus/sdk";

import directus from "../directus";
import { Activity } from "../../../types";

export async function getTotalActivities(
  filters?: {
    start?: string;
    end?: string;
    sezione?: string[];
    gruppo?: string[];
    difficolta?: string[];
    elevMin?: number;
    elevMax?: number;
    categoria?: string;
  },
  query?: string
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const filterConditions: any[] = [
      {
        status: { _eq: "published" },
        Data_inizio: {
          _gte: today.toISOString(), // Filter events starting from today
        },
      },
    ];

    if (filters?.start && filters?.end) {
      filterConditions.push({
        Data_inizio: {
          _gte: filters.start,
          _lte: filters.end,
        },
      });
    }

    if (filters?.sezione && filters.sezione.length > 0) {
      filterConditions.push({
        Sezione: {
          _in: filters.sezione,
        },
      });
    }

    if (filters?.gruppo && filters.gruppo.length > 0) {
      filterConditions.push({
        Gruppo: {
          _in: filters.gruppo,
        },
      });
    }

    if (filters?.difficolta && filters.difficolta.length > 0) {
      filterConditions.push({
        Difficolta: {
          _in: filters.difficolta,
        },
      });
    }

    if (
      typeof filters?.elevMin === "number" &&
      typeof filters?.elevMax === "number"
    ) {
      filterConditions.push({
        Dislivello_in_salita: {
          _gte: filters.elevMin,
          _lte: filters.elevMax,
        },
      });
    }

    if (filters?.categoria) {
      filterConditions.push({
        Attivita: {
          _icontains: filters.categoria,
        },
      });
    }

    if (query) {
      filterConditions.push({
        Titolo: {
          _icontains: query,
        },
      });
    }

    const totalCount = await directus.request(
      aggregate("activities", {
        aggregate: { count: "*" },
        query: {
          filter: {
            _and: filterConditions,
          },
        },
      })
    );
    // console.log("Filters:", totalCount[0].count);
    return totalCount[0].count;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return undefined;
  }
}
