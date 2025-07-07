import { aggregate, readItems } from "@directus/sdk";
import directus from "../directus";

export async function getActivityFilters() {
  try {
    const now = new Date();
    const todayUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const [sezioni, gruppi, difficolta, categorieAgg] = await Promise.all([
      directus.request(
        readItems("activities", {
          fields: ["Sezione"],
          filter: { Sezione: { _nnull: true } },
          limit: -1,
        })
      ),
      directus.request(
        readItems("activities", {
          fields: ["Gruppo"],
          filter: { Gruppo: { _nnull: true } },
          limit: -1,
        })
      ),
      directus.request(
        readItems("activities", {
          fields: ["Difficolta"],
          filter: { Difficolta: { _nnull: true } },
          limit: -1,
        })
      ),
      directus.request(
        aggregate("activities", {
          aggregate: { count: "*" },
          groupBy: ["Attivita"],
          query: {
            filter: {
              _and: [
                { Attivita: { _nnull: true } },
                { Data_inizio: { _gte: todayUTC.toISOString() } },
                { status: { _eq: "published" } },
              ],
            },
          },
        })
      ),
    ]);

    return {
      sezioni: Array.from(new Set(sezioni.map((a) => a.Sezione))),
      gruppi: Array.from(new Set(gruppi.map((a) => a.Gruppo))),
      difficolta: Array.from(new Set(difficolta.map((a) => a.Difficolta))),
      categorie: categorieAgg.map((item) => ({
        name: String(item.Attivita ?? ""), // ensure it's a string
        count: Number(item.count ?? 0), // ensure it's a number
      })),
    };
  } catch (error) {
    console.error("Error fetching filter data:", error);
    return {
      sezioni: [],
      gruppi: [],
      difficolta: [],
      categorie: [],
    };
  }
}
