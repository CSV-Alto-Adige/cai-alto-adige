import { readItems } from "@directus/sdk";

import directus from "../directus";
import { Activity } from "../../../types";

export async function getAllActivities(): Promise<Activity[] | undefined> {
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

    const response = await directus.request(
      readItems("activities", {
        filter: {
          _and: filterConditions,
        },
        fields: ["*"],
        sort: ["Data_inizio"],
      })
    );

    const activities: Activity[] = response as Activity[];
    return activities;
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    return undefined;
  }
}
