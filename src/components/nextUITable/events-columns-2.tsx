// import directus from "@/lib/directus";
// import { format, isValid } from "date-fns"
// import { it } from 'date-fns/locale';

// export type Event = {
//     [key: string]: any;
//     id: string,
//     status: string,
//     Titolo: string,
//     Attivita: string,
//     Gruppo: string,
//     Data_inizio: string,
//     Data_fine: string,
//     Note: string,
//     Numero_massimo_partecipanti: number,
//     Iscrizioni_dal: string,
//     Quota_di_partenza: number,
//     Quota_massima_raggiunta: number,
//     Quota_di_arrivo: number,
//     Dislivello_in_salita: number,
//     Dislivello_in_discesa: number,
//     slug: string,
//     Immagine: string,
//     Locandina: string,
//     Tracciato_GPX: string,
//     Sezione: string,
//     Regione_Provincia: string,
//     Zona: string,
//     Durata_in_ore: string,
//     Difficolta: string,
//     Contatto_riferimento: string
//   };

// export const columns = [
//     {
//       uid: "Titolo",
//       name: "Attività",
//     },
//     {
//       uid: "Attivita",
//       name: "Tipo di Attività",
//     },
//     {
//       uid: "Sezione",
//       name: "Sezione",
//     },
//     {
//       uid: "Gruppo",
//       name: "Gruppo",
//     },
//     {
//       uid: "Regione_Provincia",
//       name: "Regione / Provincia",
//     },
//     {
//       uid: "Zona",
//       name: "Zona",
//     },
//     {
//       uid: "Data_inizio",
//       name: "Data Inizio",
//     },
//     {
//       uid: "Data_fine",
//       name: "Data fine",
//     },
//     {
//       uid: "Numero_massimo_partecipanti",
//       name: "Partecipanti massimi",
//     },
//     {
//       uid: "Iscrizioni_dal",
//       name: "Iscrizioni dal",
//     },
//     {
//       uid: "Quota_di_partenza",
//       name: "Quota di partenza",
//     },
//     {
//       uid: "Quota_massima_raggiunta",
//       name: "Quota massima raggiunta",
//     },
//     {
//       uid: "Quota_di_arrivo",
//       name: "Quota di arrivo",
//       sortable: true
//     },
//     {
//       uid: "Dislivello_in_salita",
//       name: "Dislivello in salita",
//       sortable: true
//     },
//     {
//       uid: "Dislivello_in_discesa",
//       name: "Dislivello in discesa",
//     },
//     {
//       uid: "Durata_in_ore",
//       name: "Durata in ore",
//     },
//     {
//       uid: "Difficolta",
//       name: "Difficoltà",
//     },
//     {
//       uid: "Mezzo_di_trasporto",
//       name: "Mezzo di trasporto",
//     },
//     {
//       uid: "Contatto_riferimento",
//       name: "Contatto di riferimento",
//     },
//     {
//       uid: "Locandina",
//       name: "Locandina",
//     },
//     {
//       uid: "Tracciato_GPX",
//       name: "Tracciato GPX",
//     }
//   ];

//   const formatDateSafe = (dateStr: string | undefined | null) => {
//     if (!dateStr) return ""; // Handle empty or null values
//     const dateObj = new Date(dateStr);

//     // Validate the Date object
//     if (isValid(dateObj)) {
//       return format(dateObj, "dd/LL/y", { locale: it });
//     } else {
//       return ""; // Or a message like "Invalid Date"
//     }
//   };

// const formatLink = (urlStr: string | undefined | null) => {
//   // Check if the link is empty or null
//   if (!urlStr || urlStr.trim() === "") {
//       return ""; // Adjust the message based on your needs
//   }

//   // Otherwise, return the actual URL
//   return urlStr;
// };

// export const renderCell = (events: Event, columnKey: React.Key) => {
//   const cellValue = events[columnKey as keyof Event];

//   switch (columnKey) {
//       case 'Data_inizio':
//         return <span>{formatDateSafe(cellValue)}</span>;
//         case 'Sezione':
//         return <span className="capitalize">{cellValue}</span>;
//       case 'Data_fine':
//         return <span>{formatDateSafe(cellValue)}</span>;
//       case 'Iscrizioni_dal':
//         return <span>{formatDateSafe(cellValue)}</span>;
//           case 'Locandina': {
//             const locandinaUrl = formatLink(cellValue);
//             // If there's a valid link, provide a clickable link
//             if (locandinaUrl !== "") {
//                 return (
//                     <a href={`${directus.url}assets/${locandinaUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#0e4d71] underline underline-offset-2">
//                         Visualizza
//                     </a>
//                 );
//             }
//             // Otherwise, show the fallback message
//             return <span>{locandinaUrl}</span>;
//         }
//         case 'Tracciato_GPX': {
//             const gpxUrl = formatLink(cellValue);
//             // If there's a valid link, provide a clickable link
//             if (gpxUrl !== "") {
//                 return (
//                     <a href={`${directus.url}assets/${gpxUrl}`} target="_blank" rel="noopener noreferrer" className="text-[#0e4d71] underline underline-offset-2">
//                         Visualizza
//                     </a>
//                 );
//             }
//             // Otherwise, show the fallback message
//             return <span>{gpxUrl}</span>;
//         }
//       default:
//           return cellValue;
//   }
// };
