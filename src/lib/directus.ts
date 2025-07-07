import { createDirectus, rest } from "@directus/sdk";

const directus = createDirectus("https://amm-caialtoadige.it/").with(rest());

export default directus;
