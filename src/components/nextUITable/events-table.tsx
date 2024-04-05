"use client"
import directus from '@/lib/directus';
import { readItems } from '@directus/sdk';
import { useState, useMemo, useCallback, useContext, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
import { format } from "date-fns"
import { it } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    Table,
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Pagination, 
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Card,
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    useDisclosure,
    Select, 
    SelectItem, 
    Avatar,
    Slider,
    Switch,
    CardHeader, 
    CardBody, 
    CardFooter, 
    Divider, 
    Link, 
    Image
} from "@nextui-org/react";
import { DatePickerWithRange } from "../date-range-picker"
import {SearchIcon} from "@/assets/SearchIcon";
import {ChevronDownIcon} from "@/assets/ChevronDownIcon";
import { SlidersHorizontal, Undo, AlignJustify, LayoutGrid, Heart, CalendarDays, MapPin, AlertCircle } from "lucide-react";
import { columns, renderCell } from "./events-columns";
import CategorySlider from "../category-slider";
import { useReset } from '@/store/reset-context';
import { CartContext } from '@/store/cart-context'; 
import ClientSideRouter from "../ClientSideRouter";

interface ActivityCount {
  [key: string]: number;
}

type SortDescriptor = {
    column: React.Key | undefined;
    direction: "ascending" | "descending";
  };

type DateRange = {
from?: Date;
to?: Date;
};

type Selection = "all" | Set<React.Key>;

type LoadingState = "loading" | "sorting" | "loadingMore" | "error" | "idle" | "filtering";
  

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
  };

  const organizerSection = [
    { id: 1, name: 'Alto Adige', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 2, name: 'Appiano', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 3, name: 'Bolzano', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 4, name: 'Brennero', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 5, name: 'Bressanone', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 6, name: 'Bronzolo', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 7, name: 'Brunico', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 8, name: 'Chiusa', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 9, name: 'Egna', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 10, name: 'Fortezza', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 11, name: 'Laives', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 12, name: 'Merano', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 13, name: 'Salorno', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 14, name: 'Val Badia', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 15, name: 'Val Gardena', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' },
    { id: 16, name: 'Vipiteno', avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75' }
  ];
  

  const targetGroup = [
    {
      id: 1,
      name: "Alpinismo Giovanile (8-17)",
    },
    {
      id: 2,
      name: "Gruppo Giovani (18-35)",
    },
    {
      id: 3,
      name: "Gruppo standard",
    },
    {
      id: 4,
      name: "Seniores",
    },
    {
      id: 5,
      name: "Gruppo Alta Montagna",
    },
    {
      id: 6,
      name: "Gruppo Donne",
    }
  ];

  const difficulty = [
    {id: 1, name: 'EEA'},
    {id: 2, name: 'EEA - F'},
    {id: 3, name: 'EEA - PD'},
    {id: 4, name: 'EEA - D'},
    {id: 5, name: 'EEA - TD'},
    {id: 6, name: 'EEA - ED'},
    {id: 7, name: 'EAI'},
    {id: 8, name: 'TC'},
    {id: 9, name: 'MC'},
    {id: 10, name: 'BC'},
    {id: 11, name: 'OC'},
    {id: 12, name: 'EC'},
    {id: 13, name: 'T'},
    {id: 14, name: 'E'},
    {id: 15, name: 'EE'},
    {id: 16, name: 'EEA'},
    {id: 17, name: 'EAI'},
    {id: 18, name: 'EEA - F'},
    {id: 19, name: 'EEA - PD'},
    {id: 20, name: 'EEA - D'},
    {id: 21, name: 'EEA - TD'},
    {id: 22, name: 'EEA - ED'},
    {id: 23, name: 'MS'},
    {id: 24, name: 'MSA'},
    {id: 25, name: 'BS'},
    {id: 26, name: 'BSA'},
    {id: 27, name: 'OS'},
    {id: 28, name: 'OSA'},
];

export const events = [
    {
        id: "1",
        activity: "Avventura in Mountain Bike",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Alto Adige",
        targetGroup: "Gruppo Giovani (18-35)",
        activityType: "Cicloturismo",
        startDate: "2024/02/15",
        durationDays: 2,
        endDate: "2024/02/17",
        estimatedDays: 2,
        estimatedHours: 6,
        difficulty: "EEA",
        elevationGain: 800,
        elevationLoss: 800,
        location: "Prato Piazza",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7890",
        contactEmail: "info@outdoorclub.org",
    },
    {
        id: "2",
        activity: "Escursione all'Alba",
        image: "http://localhost:3001/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Bolzano",
        targetGroup: "Gruppo standard",
        activityType: "Cicloturismo",
        startDate: "2024/03/05",
        durationDays: 1,
        endDate: "2024/03/05",
        estimatedDays: 1,
        estimatedHours: 3,
        difficulty: "T",
        elevationGain: 400,
        elevationLoss: 400,
        location: "Dolomiti",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7891",
        contactEmail: "sunrise@hikingenthusiasts.org",
    },
    {
        id: "3",
        activity: "Corsa su Sentiero Ecologico",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Merano",
        targetGroup: "Gruppo Giovani (18-35)",
        activityType: "Cicloturismo",
        startDate: "2024/04/10",
        durationDays: 1,
        endDate: "2024/04/10",
        estimatedDays: 1,
        estimatedHours: 4,
        difficulty: "E",
        elevationGain: 300,
        elevationLoss: 300,
        location: "Sentieri del Lago",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7892",
        contactEmail: "contact@ecorunners.org",
    },
    {
        id: "4",
        activity: "Workshop di Arrampicata su Roccia",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Val Gardena",
        targetGroup: "Principianti",
        activityType: "Arrampicata",
        startDate: "2024/05/16",
        durationDays: 3,
        endDate: "2024/05/19",
        estimatedDays: 3,
        estimatedHours: 8,
        difficulty: "D",
        elevationGain: 500,
        elevationLoss: 0,
        location: "Picchi Verticali",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7893",
        contactEmail: "workshop@climbon.org",
    },
    {
        id: "5",
        activity: "Corso di Fotografia Forestale",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Brunico",
        targetGroup: "Appassionati di Fotografia",
        activityType: "Fotografia",
        startDate: "2024/06/21",
        durationDays: 2,
        endDate: "2024/06/23",
        estimatedDays: 2,
        estimatedHours: 5,
        difficulty: "T",
        elevationGain: 100,
        elevationLoss: 100,
        location: "Foresta di Greenwood",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7894",
        contactEmail: "info@lenslovers.org",
    },
    {
        id: "6",
        activity: "Osservazione del Cielo Notturno",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Vipiteno",
        targetGroup: "Aficionados di Astronomia",
        activityType: "Astronomia",
        startDate: "2024/07/28",
        durationDays: 1,
        endDate: "2024/07/29",
        estimatedDays: 1,
        estimatedHours: 6,
        difficulty: "T",
        elevationGain: 0,
        elevationLoss: 0,
        location: "Parco del Cielo Scuro",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7895",
        contactEmail: "night@stargazers.org",
    },
    {
        id: "7",
        activity: "Campo di Sopravvivenza nella Selvaggia",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Bressanone",
        targetGroup: "Avventurieri",
        activityType: "Camping",
        startDate: "2024/08/05",
        durationDays: 4,
        endDate: "2024/08/09",
        estimatedDays: 4,
        estimatedHours: 7,
        difficulty: "EEA",
        elevationGain: 200,
        elevationLoss: 200,
        location: "Montagna dell'Orso",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7896",
        contactEmail: "camp@survivalskills.org",
    },
    {
        id: "8",
        activity: "Viaggio in Kayak sul Lago",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Merano",
        targetGroup: "Appassionati di Sport Acquatici",
        activityType: "Kayaking",
        startDate: "2024/09/12",
        durationDays: 2,
        endDate: "2024/09/14",
        estimatedDays: 2,
        estimatedHours: 4,
        difficulty: "E",
        elevationGain: 0,
        elevationLoss: 0,
        location: "Lago di Cristallo",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7897",
        contactEmail: "journey@paddlepros.org",
    },
    {
        id: "9",
        activity: "Sandboarding nel Deserto",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Bolzano",
        targetGroup: "Cercatori di Emozioni",
        activityType: "Sandboarding",
        startDate: "2024/10/20",
        durationDays: 1,
        endDate: "2024/10/21",
        estimatedDays: 1,
        estimatedHours: 5,
        difficulty: "E",
        elevationGain: 100,
        elevationLoss: 100,
        location: "Dune del Sahara",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7898",
        contactEmail: "info@duneriders.org",
    },
    {
        id: "10",
        activity: "Tour Graffiti Urbani",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Appiano",
        targetGroup: "Appassionati d'Arte",
        activityType: "Evento sociale",
        startDate: "2024/11/11",
        durationDays: 1,
        endDate: "2024/11/12",
        estimatedDays: 1,
        estimatedHours: 3,
        difficulty: "T",
        elevationGain: 0,
        elevationLoss: 0,
        location: "Centro Città",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7899",
        contactEmail: "tour@streetartcollective.org",
    },
    {
        id: "11",
        activity: "Maratona ad Alta Quota",
        image: "http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAG_Prato_Piazza.bd81c09b.jpeg&w=3840&q=75",
        organizerSection: "Val Badia",
        targetGroup: "Corridori Esperti",
        activityType: "Running",
        startDate: "2024/12/05",
        durationDays: 1,
        endDate: "2024/12/06",
        estimatedDays: 1,
        estimatedHours: 8,
        difficulty: "EEA - ED",
        elevationGain: 1200,
        elevationLoss: 1200,
        location: "Catena Montuosa",
        flyerLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        gpxTrackLink: "https://www.cai.it/gruppo_regionale/gp-alto-adige/",
        contactPhone: "123-456-7890",
        contactEmail: "info@marathonmasters.org",
    },
];

async function getPosts() {
	return directus.request(
		readItems('activities', {
		})
	);
}


const INITIAL_VISIBLE_COLUMNS = ["activity", "startDate", "endDate", "location", "difficulty"];

export default function EventsTable() {
    const router = useRouter()
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [switchIsSelected, setSwitchIsSelected] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [organizerFilter, setOrganizerFilter] = useState(new Set());
    const [targetGroupFilter, setTargetGroupFilter] = useState(new Set());
    const [difficultyFilter, setDifficultyFilter] = useState(new Set());
    const [elevationGainRange, setElevationGainRange] = useState([0, 3000]);
    const [durationRange, setDurationRange] = useState([0, 16]);
    const [activityTypeFilter, setActivityTypeFilter] = useState('');
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: 'name',
        direction: 'ascending'
      });
    const cart = useContext(CartContext);
    const { subscribeToDeletion, unsubscribeFromDeletion } = useContext(CartContext);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
      
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
      if (visibleColumns.has('all')) return columns;
  
      return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
  
    const filteredItems = useMemo(() => {
        let filteredEvents = [...events];
    
        if (hasSearchFilter) {
          filteredEvents = filteredEvents.filter((event) =>
            event.activity.toLowerCase().includes(filterValue.toLowerCase()),
          );
        }

        if (dateRange?.from && dateRange?.to) {
            filteredEvents = filteredEvents.filter((event) => {
              const startDate = new Date(event.startDate);
              return startDate >= (dateRange.from as Date) && startDate <= (dateRange.to as Date);
            });
          }

        if (activityTypeFilter) {
            filteredEvents = filteredEvents.filter((event) => 
                event.activityType === activityTypeFilter
            );
         }

        if (organizerFilter.size > 0) {
            filteredEvents = filteredEvents.filter(event =>
                organizerFilter.has(event.organizerSection) // Ensure this matches exactly how names are stored in the events
            );
        }

        if (targetGroupFilter.size > 0) {
            filteredEvents = filteredEvents.filter(event =>
                targetGroupFilter.has(event.targetGroup) // Ensure this matches exactly how names are stored in the events
            );
        }

        if (difficultyFilter.size > 0) {
            filteredEvents = filteredEvents.filter(event =>
                difficultyFilter.has(event.difficulty) // Ensure this matches exactly how names are stored in the events
            );
        }

        if (elevationGainRange) {
            filteredEvents = filteredEvents.filter(event => {
                const gain = event.elevationGain; // Ensure this property exists and is a number
                return gain >= elevationGainRange[0] && gain <= elevationGainRange[1];
            });
        }

        if (durationRange) {
            filteredEvents = filteredEvents.filter(event => {
                const duration = event.estimatedHours; // Ensure this property exists and is a number
                return duration >= durationRange[0] && duration <= durationRange[1];
            });
        }
    
        return filteredEvents;
      }, [events, filterValue, statusFilter, dateRange, activityTypeFilter, organizerFilter, targetGroupFilter, difficultyFilter, elevationGainRange, durationRange]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);
  
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
    
        return filteredItems.slice(start, end);
      }, [page, filteredItems, rowsPerPage]);
    

    const sortedItems = useMemo(() => {
        let itemsToSort = [...events];
        
        return [...items].sort((a: any, b: any) => {
          const first = a[sortDescriptor.column as keyof Event] as string
          const second = b[sortDescriptor.column as keyof Event] as string
          const cmp = first < second ? -1 : first > second ? 1 : 0
    
          return sortDescriptor.direction === 'descending' ? -cmp : cmp
        })
      }, [sortDescriptor, items])

      const onNextPage = useCallback(() => {
        if (page < pages) {
          setPage(page + 1);
        }
      }, [page, pages]);
    
      const onPreviousPage = useCallback(() => {
        if (page > 1) {
          setPage(page - 1);
        }
      }, [page]);
    
      const onRowsPerPageChange = useCallback((e: any) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
      }, []);
    
      const onSearchChange = useCallback((value: any) => {
        if (value) {
          setFilterValue(value);
          setPage(1);
        } else {
          setFilterValue("");
        }
      }, []);
    

      const onClear = useCallback(()=>{
        setFilterValue("")
        setPage(1)
      },[])

      const handleSelectionChange = (keys: Selection) => {
        if (keys === "all") {
          const allColumns = new Set(columns.map(column => column.uid));
          setVisibleColumns(allColumns);
        } else {
          setVisibleColumns(new Set(Array.from(keys).map(key => String(key))));
        }
      };

      const handleCategorySelect = useCallback((category: string) => {
            setActivityTypeFilter(category);
            setSelectedCategory(category);
      }, []);

      console.log(selectedCategory)

      const handleOrganizerSelectionChange = (selectedKeys: any) => {
        const selectedNames = new Set(selectedKeys); 
        setOrganizerFilter(selectedNames);
      };

      const handleTargetGroupSelectionChange = (selectedKeys: any) => {
        const selectedNames = new Set(selectedKeys); 
        setTargetGroupFilter(selectedNames);
      };

      const handleDifficultySelectionChange = (selectedKeys: any) => {
        const selectedNames = new Set(selectedKeys); 
        setDifficultyFilter(selectedNames);
      };
      

      const { triggerReset } = useReset();

      const handleResetFilters = () => {
        setDateRange(undefined);
        setActivityTypeFilter('');
        setFilterValue('');
        setSelectedKeys(new Set());
        setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
        setStatusFilter('all');
        setOrganizerFilter(new Set());
        setTargetGroupFilter(new Set());
        setDifficultyFilter(new Set());
        setElevationGainRange([0, 3000]); // Reset to default range
        setDurationRange([0, 16]);
        setPage(1);
        setSortDescriptor({
            column: 'name',
            direction: 'ascending'
        });
        triggerReset();
    };

    const isFiltered = filteredItems.length < events.length;

    const prevSelectedKeysRef = useRef(selectedKeys);

    useEffect(() => {

    // Update the ref with the current selection for the next render
    prevSelectedKeysRef.current = selectedKeys;
    }, [selectedKeys, cart.addOneToCart, cart.deleteFromCart]);

    useEffect(() => {
        const handleItemDeletion = (id: string) => {
            // Logic to deselect item in your table based on the deleted item's id
            setSelectedKeys((prevSelectedKeys) => {
                const newSelectedKeys = new Set(prevSelectedKeys);
                newSelectedKeys.delete(id);
                return newSelectedKeys;
            });
        };
    
        subscribeToDeletion(handleItemDeletion);
    
        return () => unsubscribeFromDeletion(handleItemDeletion);
    }, [subscribeToDeletion, unsubscribeFromDeletion]);

  
    const calculateActivitiesPerType = () => {
      return events.reduce<ActivityCount>((acc, event) => {
        const { activityType } = event;
        acc[activityType] = (acc[activityType] || 0) + 1;
        return acc;
      }, {});
    };
    
    const activitiesPerType = calculateActivitiesPerType();

    useEffect(() => {
      // Set the switch state based on the window width
      const handleResize = () => {
        if (window.innerWidth < 768) {
          // Assuming mobile device widths are below 768px
          setSwitchIsSelected(false);
        } else {
          setSwitchIsSelected(true);
        }
      };
    
      // Call the function initially and add the event listener on component mount
      handleResize();
      window.addEventListener('resize', handleResize);
    
      // Cleanup the event listener on component unmount
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    

      const topContent = useMemo(() => {

        const handleDateRangeChange = (selectedRange: DateRange | undefined) => {
            setDateRange(selectedRange);
          };
    
        return (
            <> 
                <CategorySlider onCategorySelect={handleCategorySelect} activitiesPerType={activitiesPerType} selectedCategory={selectedCategory}/>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%] hidden lg:block"
                        placeholder="Cerca attività ..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3 items-center">
                        {isFiltered && (
                            <Button color="secondary" startContent={<Undo className="h-4 w-4"/>} onPress={handleResetFilters} className="hidden lg:flex">
                                Cancella filtri
                            </Button>
                        )}
                        <DatePickerWithRange className="hidden lg:block" onDateRangeChange={handleDateRangeChange} />
                        <Dropdown>
                          <DropdownTrigger className="hidden lg:flex">
                              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                              Seleziona colonna
                              </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                              disallowEmptySelection
                              aria-label="Table Columns"
                              closeOnSelect={false}
                              selectedKeys={visibleColumns}
                              selectionMode="multiple"
                              onSelectionChange={handleSelectionChange}
                          >
                              {columns.map((column) => (
                              <DropdownItem key={column.uid} className="capitalize">
                                  {column.name}
                              </DropdownItem>
                              ))}
                          </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" onPress={onOpen} endContent={<SlidersHorizontal className="h-3 w-3"/>} className="bg-[#0E4D71] text-sm h-9 hidden lg:flex">Filtri</Button>
                        <Switch 
                          defaultSelected 
                          size="lg"
                          aria-label="Modalità visualizzazione"
                          onValueChange={setSwitchIsSelected}
                          thumbIcon={({ isSelected }) =>
                            isSelected ? (
                              <AlignJustify className="h-4 w-4" />
                            ) : (
                              <LayoutGrid className="h-4 w-4"/>
                            )
                          }
                          color="secondary"
                          className="h-9 hidden lg:block"
                        />
                    </div>
                    </div>
                    <div className="flex justify-between items-center px-6 lg:px-0">
                    <span className="text-default-400 text-small">{filteredItems.length} Risultati</span>
                    <Button color="primary" onPress={onOpen} endContent={<SlidersHorizontal className="h-3 w-3"/>} className="bg-[#0E4D71] text-sm h-9 lg:hidden">Filtri</Button>
                    <label className="hidden lg:flex items-center text-default-400 text-small">
                        Risultati per pagina:
                        <select
                        className="bg-transparent outline-none text-default-400 text-small"
                        onChange={onRowsPerPageChange}
                        >
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="25">25</option>
                        </select>
                    </label>
                    </div>
                </div>
            </>
        );
      }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        events.length,
        onSearchChange,
        hasSearchFilter,
        items.length
      ]);
    
      const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
              <span className="w-[30%] text-small text-default-400 hidden lg:block">
              {/* {selectedKeys === "all"
                ? "Tutte le attività selezionate"
                : `${selectedKeys.size} di ${filteredItems.length} selezionati`} */}
            {selectedKeys.size} di {filteredItems.length} selezionati
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
              className="mx-auto lg:mx-none"
            />
            <div className="hidden sm:flex w-[30%] justify-end gap-2">
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                    Indietro
                </Button>
                <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                    Avanti
                </Button>
            </div>
          </div>
        );
      }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="container mt-8 lg:mt-24">
      {topContent}

      {
      switchIsSelected ? (
        <div className="py-6">
          <Table 
                aria-label="Attività CAI Alto Adige"
                isHeaderSticky
                classNames={{
                wrapper: "",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                selectionBehavior="replace"
                sortDescriptor={sortDescriptor as any}
                onSelectionChange={setSelectedKeys as any}
                onSortChange={setSortDescriptor as any}

            >
            <TableHeader columns={headerColumns}>
                {(column) => (
                <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    allowsSorting={column.sortable}
                >
                    {column.name}
                </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"Nessuna attività"} items={sortedItems}>
                {(item) => (
                <TableRow key={item.id} onClick={() => router.push(`/attivita/${item.id}`)}>
                    {(columnKey) => <TableCell>{renderCell(item as any, columnKey)}</TableCell>}
                </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
          {sortedItems.map((event) => (
           <Card key={event.id} className="max-w-[400px]">
            <CardHeader className="flex gap-3">
              <Image
                alt="nextui logo"
                height={100}
                radius="sm"
                src={event.image}
                width={100}
                className="w-12 h-12 object-cover"
              />
              <div className="flex flex-col">
                <h3 className="text-md">{event.activity}</h3>
                <p className="text-small text-default-500">{event.activityType}</p>
              </div>
            </CardHeader>
            <Divider/>
            <CardBody>
              <div className="flex flex-col gap-y-2">
                <div className="flex gap-x-2 items-center">
                  <CalendarDays className="h-4 w-4"/>
                  <p className="text-sm text-zinc-600">Data Inizio: <span className="text-zinc-900">{format(event.startDate, "dd LLL, y", { locale: it })}</span></p>
                </div>
                <div className="flex gap-x-2 items-center">
                  <MapPin className="h-4 w-4"/>
                  <p className="text-sm text-zinc-600">Località: <span className="text-zinc-900">{event.location}</span></p>
                </div>
                <div className="flex gap-x-2 items-center">
                  <AlertCircle className="h-4 w-4"/>
                  <p className="text-sm text-zinc-600">Difficoltá: <span className="text-zinc-900">{event.difficulty}</span></p>
                </div>
              </div>
            </CardBody>
            <Divider/>
            <CardFooter className="flex flex-col">
              <ClientSideRouter route={`/attivita/${event.id}`} ariaLabel={event.activity}>
              <Button 
                  color="primary" 
                  size="sm" 
                  className="w-full bg-[#0e4d71]"
                >
                  Leggi
                </Button>
              </ClientSideRouter>
              <Button 
                color="primary" 
                variant="ghost"
                size="sm" 
                startContent={<Heart className="h-4 w-4"/>} 
                className="mx-4 my-2 w-full text-xs"
                onClick={() => {
                  cart.addOneToCart(event.id);
                  setSelectedKeys(prev => new Set(prev).add(event.id));
                }}
                isDisabled={cart.items.some(item => item.id === (event.id as any))}
              >
                Aggiungi
              </Button>
            </CardFooter>
          </Card>
          ))}
        </div>
        )
      }
      {bottomContent}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Filtri</ModalHeader>
              <ModalBody>
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%] lg:hidden"
                    placeholder="Cerca attività ..."
                    startContent={<SearchIcon />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
                <Select
                    items={organizerSection}
                    label="Sezione Organizzatrice"
                    variant="bordered"
                    isMultiline={true}
                    selectionMode="multiple"
                    placeholder="Seleziona una sezione"
                    selectedKeys={organizerFilter as any}
                    onSelectionChange={handleOrganizerSelectionChange}
                    multiple
                    labelPlacement="outside"
                    classNames={{
                        base: "",
                        trigger: "min-h-unit-12 py-2",
                    }}
                    renderValue={(items) => {
                        return (
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                            <Chip key={item.key}>{item.data?.name}</Chip>
                            ))}
                        </div>
                        );
                    }}
                    >
                    {(organizerSection) => (
                        <SelectItem key={organizerSection.name} value={organizerSection.name} textValue={organizerSection.name}>
                        <div className="flex gap-2 items-center">
                            <Avatar alt={organizerSection.name} className="flex-shrink-0" size="sm" src={organizerSection.avatar} />
                            <div className="flex flex-col">
                            <span className="text-small">{organizerSection.name}</span>
                            </div>
                        </div>
                        </SelectItem>
                    )}
                </Select>
                <Select
                    label="Gruppo target"
                    placeholder="Seleziona un gruppo"
                    selectionMode="multiple"
                    selectedKeys={targetGroupFilter as any}
                    onSelectionChange={handleTargetGroupSelectionChange}
                    className=""
                    >
                    {targetGroup.map((target) => (
                        <SelectItem key={target.name} value={target.name}>
                        {target.name}
                        </SelectItem>
                    ))}
                </Select>
                <Select
                    label="Difficoltà"
                    placeholder="Seleziona un grado di difficoltá"
                    selectionMode="multiple"
                    selectedKeys={difficultyFilter as any}
                    onSelectionChange={handleDifficultySelectionChange}
                    className=""
                    >
                    {difficulty.map((difficultyLevel) => (
                        <SelectItem key={difficultyLevel.name} value={difficultyLevel.name}>
                        {difficultyLevel.name}
                        </SelectItem>
                    ))}
                </Select>
                <Slider 
                    label="Salita"
                    step={50} 
                    minValue={0} 
                    maxValue={3000} 
                    defaultValue={[0, 3000]} 
                    formatOptions={{style: 'unit', unit: 'meter',}}
                    size="sm"
                    showOutline
                    value={elevationGainRange}
                    onChange={setElevationGainRange as any}
                    className="max-w-md"
                />
                <Slider 
                    label="Durata"
                    step={1} 
                    minValue={0} 
                    maxValue={16} 
                    defaultValue={[0, 16]} 
                    formatOptions={{style: 'unit', unit: 'hour',}}
                    size="sm"
                    showOutline
                    value={durationRange}
                    onChange={setDurationRange as any}
                    className="max-w-md"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" startContent={<Undo className="h-4 w-4"/>} onPress={handleResetFilters}>
                  Cancella filtri
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  </div>
  );
}
