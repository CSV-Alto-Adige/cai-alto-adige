"use client";

import { ColumnDef,  FilterFn } from "@tanstack/react-table";
import { format } from "date-fns"; // for date formatting
import { LucideIcon, Mountain, Bike } from "lucide-react";

type ActivityType = 'hiking' | 'biking'; // Add more as needed

type ActivityIconsMap = {
  [key in ActivityType]: LucideIcon;
};

const activityIcons: ActivityIconsMap = {
  hiking: Mountain,
  biking: Bike,
};


declare module '@tanstack/table-core' {
  interface FilterFns {
    isWithinRange: FilterFn<Event>;
    elevationGainFilter: FilterFn<Event>;
  }
}

export type Event = {
  id: string;
  activity: string;
  organizerSection: string;
  targetGroup: string;
  activityType: string;
  startDate: Date;
  endDate: Date;
  durationDays: number;
  estimatedHours: number;
  difficulty: string;
  elevationGain: number;
  elevationLoss: number;
  location: string;
  flyerLink?: string;
  gpxTrackLink?: string;
  contactPhone: string;
  contactEmail: string;
};

export const columns: ColumnDef<Event>[] = [
  {
    id: 'icon',
    header: '',
    cell: ({ row }) => {
      const activityType = row.original.activityType as ActivityType; // Type assertion
      const ActivityIcon = activityIcons[activityType]; // Now TypeScript knows this is safe
      return ActivityIcon ? <div className="bg-[#0e4d71] shadow p-2 rounded-full text-white"> <ActivityIcon size={20} /> </div> : null;
    },
    size: 30, // Sets the default width of the column
    minSize: 30, // Sets the minimum width of the column
    maxSize: 30, // Optionally, you can set the maximum width of the column if needed
  },
  {
    accessorKey: 'activity',
    header: 'Attività',
  },
  {
    accessorKey: 'organizerSection',
    header: 'Sezione Organizzatrice',
  },
  {
    accessorKey: 'targetGroup',
    header: 'Gruppo Target',
  },
  {
    accessorKey: 'activityType',
    header: 'Tipo di Attività',
  },
  {
    accessorKey: 'startDate',
    header: 'Data Inizio',
    filterFn: 'isWithinRange',
    cell: ({ row }) => {
        const startDate = row.getValue("startDate");
        if (startDate instanceof Date) {
          return format(startDate, "yyyy/MM/dd");
        } else {
          return "Data non valida";
        }
      },
  },
  {
    accessorKey: 'endDate',
    header: 'Data Fine',
    filterFn: 'isWithinRange',
    cell: ({ row }) => {
        const startDate = row.getValue("endDate");
        if (startDate instanceof Date) {
          return format(startDate, "yyyy/MM/dd");
        } else {
          return "Data non valida";
        }
      },
  },
  {
    accessorKey: 'durationDays',
    header: 'Durata (Giorni)',
  },
  {
    accessorKey: 'estimatedHours',
    header: 'Ore Stimati',
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficoltà',
  },
  {
    accessorKey: 'elevationGain',
    header: 'Dislivello Positivo',
    filterFn: 'elevationGainFilter',
  },
  {
    accessorKey: 'elevationLoss',
    header: 'Dislivello Negativo',
  },
  {
    accessorKey: 'location',
    header: 'Località',
  },
  {
    id: 'flyerLink',
    header: 'Locandina',
    cell: ({ row }) => row.original.gpxTrackLink ? <a href={row.original.gpxTrackLink} target="_blank" rel="noopener noreferrer">Visualizza</a> : '',
  },
  {
    id: 'gpxTrackLink',
    header: 'Traccia GPX',
    cell: ({ row }) => row.original.gpxTrackLink ? <a href={row.original.gpxTrackLink} target="_blank" rel="noopener noreferrer">Download</a> : '',
  },
  {
    accessorKey: 'contactPhone',
    header: 'Telefono Contatto',
  },
  {
    accessorKey: 'contactEmail',
    header: 'Email Contatto',
  },
];