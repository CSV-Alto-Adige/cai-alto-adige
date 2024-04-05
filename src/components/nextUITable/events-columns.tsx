import {User, Tooltip} from "@nextui-org/react";
import { EyeIcon, EditIcon } from "lucide-react";
import { format } from "date-fns"

export type Event = {
    [key: string]: any;
    id: string;
    image: string;
    activity: string;
    organizerSection: string;
    targetGroup: string;
    activityType: string;
    startDate: string;
    endDate: string;
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

export const statusOptions = [
    {name: "Active", uid: "active"},
    {name: "Paused", uid: "paused"},
    {name: "Vacation", uid: "vacation"},
  ];

export const columns = [
    {
      uid: "activity",
      name: "Attività",
    },
    {
      uid: "organizerSection",
      name: "Sezione",
    },
    {
      uid: "targetGroup",
      name: "Gruppo",
    },
    {
      uid: "activityType",
      name: "Tipo di attività",
    },
    {
      uid: "startDate",
      name: "Data Inizio",
      sortable: true
    },
    {
      uid: "endDate",
      name: "Data Fine",
    },
    {
      uid: "estimatedDays",
      name: "Durata (giorni)",
      sortable: true
    },
    {
      uid: "estimatedHours",
      name: "Ore stimate",
      sortable: true
    },
    {
      uid: "difficulty",
      name: "Difficoltà",
      sortable: true
    },
    {
      uid: "elevationGain",
      name: "Dislivello Positivo",
      sortable: true
    },
    {
      uid: "elevationLoss",
      name: "Dislivello Negativo",
      sortable: true
    },
    {
      uid: "location",
      name: "Località",
    },
    {
      uid: "flyerLink",
      name: "Locandina",
    },
    {
      uid: "gpxTrackLink",
      name: "Traccia GPX",
    },
    {
      uid: "contactPhone",
      name: "Telefono Contatto",
    },
    {
      uid: "contactEmail",
      name: "Email Contatto",
    },
  ];

  export const renderCell = (events: Event, columnKey: React.Key) => {
    const cellValue = events[columnKey as keyof Event]
  
    switch (columnKey) {
      case 'activity':
        return (
          <User
            avatarProps={{ radius: 'lg', src: events.image }}
            description={events.activityType}
            name={cellValue}
          >
          </User>
        )
      case 'startDate':
        return <span>{ format(cellValue, "yyyy/MM/dd")}</span>;
      case 'endDate':
        return <span>{ format(cellValue, "yyyy/MM/dd")}</span>;
      case 'flyerLink':
        return <a href={cellValue as string} target="_blank" rel="noopener noreferrer" className="text-[#0e4d71] underline underline-offset-2">Visualizza</a> 
      case 'gpxTrackLink':
        return <a href={cellValue as string} target="_blank" rel="noopener noreferrer" className="text-[#0e4d71] underline underline-offset-2">Visualizza</a> 
      default:
        return cellValue
    }
  }