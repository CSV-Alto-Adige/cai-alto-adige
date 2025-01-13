"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "../../../types";
import { format } from "date-fns";
import directus from "@/lib/directus";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "Titolo",
    header: "Attività",
  },
  {
    accessorKey: "Attivita",
    header: "Tipo di Attività",
  },
  {
    accessorKey: "Sezione",
    header: "Sezione",
    cell: ({ row }) => {
      const formatted = row.getValue("Sezione");
      return <div className="capitalize">{formatted as string}</div>;
    },
  },
  {
    accessorKey: "Gruppo",
    header: "Gruppo",
  },
  {
    accessorKey: "Regione_Provincia",
    header: "Regione / Provincia",
  },
  {
    accessorKey: "Zona",
    header: "Zona",
  },
  {
    accessorKey: "Data_inizio",
    header: "Data Inizio",
    cell: ({ row }) => {
      const date = row.getValue("Data_inizio");

      if (date) {
        const formatted = format(
          new Date(date as string | number | Date),
          "dd/MM/yyyy"
        );
        return <div className="text-right font-medium">{formatted}</div>;
      }
      return null;
    },
  },
  {
    accessorKey: "Data_fine",
    header: "Data fine",
    cell: ({ row }) => {
      const date = row.getValue("Data_fine");

      if (date) {
        const formatted = format(
          new Date(date as string | number | Date),
          "dd/MM/yyyy"
        );
        return <div className="text-right font-medium">{formatted}</div>;
      }
      return null;
    },
  },
  {
    accessorKey: "Numero_massimo_partecipanti",
    header: "Partecipanti massimi",
  },
  {
    accessorKey: "Iscrizioni_dal",
    header: "Iscrizioni dal",
    cell: ({ row }) => {
      const date = row.getValue("Iscrizioni_dal");

      if (date) {
        const formatted = format(
          new Date(date as string | number | Date),
          "dd/MM/yyyy"
        );
        return <div className="text-right font-medium">{formatted}</div>;
      }
      return null;
    },
  },
  {
    accessorKey: "Quota_di_partenza",
    header: "Quota di partenza",
    cell: ({ row }) => {
      if (row.getValue("Quota_di_partenza")) {
        return (
          <div className="text-right font-medium">{`${row.getValue(
            "Quota_di_partenza"
          )} m`}</div>
        );
      }
    },
  },
  {
    accessorKey: "Quota_massima_raggiunta",
    header: "Quota massima raggiunta",
    cell: ({ row }) => {
      if (row.getValue("Quota_massima_raggiunta")) {
        return (
          <div className="text-right font-medium">{`${row.getValue(
            "Quota_massima_raggiunta"
          )} m`}</div>
        );
      }
    },
  },
  {
    accessorKey: "Quota_di_arrivo",
    header: "Quota di arrivo",
    cell: ({ row }) => {
      if (row.getValue("Quota_di_arrivo")) {
        return (
          <div className="text-right font-medium">{`${row.getValue(
            "Quota_di_arrivo"
          )} m`}</div>
        );
      }
    },
  },
  {
    accessorKey: "Dislivello_in_salita",
    header: "Dislivello in salita",
    cell: ({ row }) => {
      if (row.getValue("Dislivello_in_salita")) {
        return (
          <div className="text-right font-medium">{`${row.getValue(
            "Dislivello_in_salita"
          )} m`}</div>
        );
      }
    },
  },
  {
    accessorKey: "Dislivello_in_discesa",
    header: "Dislivello in discesa",
    cell: ({ row }) => {
      if (row.getValue("Dislivello_in_discesa")) {
        return (
          <div className="text-right font-medium">{`${row.getValue(
            "Dislivello_in_discesa"
          )} m`}</div>
        );
      }
    },
  },
  {
    accessorKey: "Durata_in_ore",
    header: "Durata in ore",
  },
  {
    accessorKey: "Difficolta",
    header: "Difficoltà",
  },
  {
    accessorKey: "Mezzo_di_trasporto",
    header: "Mezzo di trasporto",
  },
  {
    accessorKey: "Contatto_riferimento",
    header: "Contatto di riferimento",
    cell: ({ row }) => {
      if (row.getValue("Contatto_riferimento")) {
        return (
          <div
            className="text-right font-medium"
            dangerouslySetInnerHTML={{
              __html: row.getValue("Contatto_riferimento"),
            }}
          ></div>
        );
      }
    },
  },
  {
    accessorKey: "Locandina",
    header: "Locandina",
    cell: ({ row }) => {
      if (row.getValue("Locandina")) {
        return (
          <a
            href={`${directus.url}assets/${row.getValue("Locandina")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0e4d71] underline underline-offset-2"
          >
            Visualizza
          </a>
        );
      }
    },
  },
  {
    accessorKey: "Tracciato_GPX",
    header: "Tracciato GPX",
    cell: ({ row }) => {
      if (row.getValue("Tracciato_GPX")) {
        return (
          <a
            href={`${directus.url}assets/${row.getValue("Tracciato_GPX")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0e4d71] underline underline-offset-2"
          >
            Visualizza
          </a>
        );
      }
    },
  },
];
