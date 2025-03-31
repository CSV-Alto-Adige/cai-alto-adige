import { readItems } from "@directus/sdk";

import directus from "../directus";
import { Activity } from "../../../types";

export async function getActivitiesWithoutCategory(
  filters?: {
    start?: string;
    end?: string;
    sezione?: string[];
    gruppo?: string[];
    difficolta?: string[];
    elevMin?: number;
    elevMax?: number;
  },
  query?: string,
  page?: number
): Promise<Activity[] | undefined> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const filterConditions: any[] = [];

    // 1. Only apply "from today on" if user has NOT set start/end
    if (!filters?.start && !filters?.end) {
      filterConditions.push({
        status: { _eq: "published" },
        Data_inizio: {
          _gte: today.toISOString(),
        },
      });
    } else {
      // Otherwise, at least ensure status=published
      filterConditions.push({
        status: { _eq: "published" },
      });
    }

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

    if (query) {
      filterConditions.push({
        Titolo: {
          _icontains: query,
        },
      });
    }

    const response = await directus.request(
      readItems("activities", {
        filter: {
          _and: filterConditions,
        },
        fields: ["*"],
        sort: ["Data_inizio"],
        page: page || 1,
        limit: 10,
      })
    );

    const activities: Activity[] = response as Activity[];

    return activities;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return undefined;
  }
}
