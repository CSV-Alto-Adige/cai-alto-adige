import { aggregate, readItems } from "@directus/sdk";

import directus from "../directus";
import { Activity } from "../../../types";

export async function getActivities(
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
  query?: string,
  page?: number
): Promise<{ activities: Activity[]; total: string | null } | undefined> {
  const now = new Date();
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  try {
    const filterConditions: any[] = [];

    // 1. Only apply "from today on" if user has NOT set start/end
    if (!filters?.start && !filters?.end) {
      filterConditions.push({
        status: { _eq: "published" },
        Data_inizio: {
          _gte: todayUTC.toISOString(),
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

    const [activities, total] = await Promise.all([
      directus.request(
        readItems("activities", {
          filter: { _and: filterConditions },
          fields: ["*"],
          sort: ["Data_inizio"],
          page,
          limit: 10,
        })
      ),
      directus.request(
        aggregate("activities", {
          aggregate: { count: "*" },
          query: { filter: { _and: filterConditions } },
        })
      ),
    ]);

    return {
      activities: activities as Activity[],
      total: total[0].count,
    };

    // console.log("Filters:", activities.length);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return undefined;
  }
}
