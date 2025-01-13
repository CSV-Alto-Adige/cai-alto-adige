// "use client"
// import directus from "@/lib/directus";
// import { useState, useMemo, useCallback, useContext, useEffect, useRef } from "react";
// import { useRouter } from 'next/navigation'
// import { format } from "date-fns"
// import { it } from 'date-fns/locale';
// import 'jspdf-autotable';
// import {
//     Table,
//     TableHeader,
//     TableColumn,
//     TableBody,
//     TableRow,
//     TableCell,
//     Pagination,
//     Input,
//     Button,
//     DropdownTrigger,
//     Dropdown,
//     DropdownMenu,
//     DropdownItem,
//     Chip,
//     Card,
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     useDisclosure,
//     Select,
//     SelectItem,
//     Avatar,
//     Slider,
//     Switch,
//     CardHeader,
//     CardBody,
//     CardFooter,
//     Divider,
//     Link,
//     Image
// } from "@nextui-org/react";
// import { DatePickerWithRange } from "../date-range-picker"
// import {SearchIcon} from "@/assets/SearchIcon";
// import {ChevronDownIcon} from "@/assets/ChevronDownIcon";
// import { SlidersHorizontal, Undo, AlignJustify, LayoutGrid, Heart, CalendarDays, MapPin, AlertCircle } from "lucide-react";
// import { columns, renderCell } from './events-columns-2';
// import CategorySlider from "../category-slider";
// import { useReset } from '@/store/reset-context';
// import { CartContext } from '@/store/cart-context';
// import ClientSideRouter from "../ClientSideRouter";
// import AddToCartButtonTable from "../AddToCartButtonTable";

// interface OrganizerSection {
//   id: number;
//   name: string;
//   avatar: string;
// }

// interface TargetGroup {
//   id: number;
//   name: string;
// }

// interface DifficultyLevel {
//   id: number;
//   name: string;
// }

// type SortDescriptor = {
//     column: React.Key | undefined;
//     direction: "ascending" | "descending";
//   };

// type DateRange = {
// from?: Date;
// to?: Date;
// };

// type Selection = "all" | Set<React.Key>;

// type LoadingState = "loading" | "sorting" | "loadingMore" | "error" | "idle" | "filtering";

// const statusColorMap = {
//     active: "success",
//     paused: "danger",
//     vacation: "warning",
//   };

// const INITIAL_VISIBLE_COLUMNS = ["Titolo", "Attivita", "Gruppo", "Data_inizio", "Sezione"];

// export default function EventsTable2 ({activities}: any) {
//     const events = activities;
//     const router = useRouter()
//     const {isOpen, onOpen, onOpenChange} = useDisclosure();
//     const [switchIsSelected, setSwitchIsSelected] = useState(true);
//     const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
//     const [organizerFilter, setOrganizerFilter] = useState(new Set());
//     const [targetGroupFilter, setTargetGroupFilter] = useState(new Set());
//     const [difficultyFilter, setDifficultyFilter] = useState(new Set());
//     const [elevationGainRange, setElevationGainRange] = useState([0, 3000]);
//     const [durationRange, setDurationRange] = useState([0, 16]);
//     const [activityTypeFilter, setActivityTypeFilter] = useState('');
//     const [filterValue, setFilterValue] = useState("");
//     const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
//     const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
//         column: 'Data_inizio',
//         direction: 'ascending'
//       });
//     const cart = useContext(CartContext);
//     const { subscribeToDeletion, unsubscribeFromDeletion } = useContext(CartContext);
//     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//     const [page, setPage] = useState(1);

//     const hasSearchFilter = Boolean(filterValue);

//     const headerColumns = useMemo(() => {
//       if (visibleColumns.has('all')) return columns;

//       return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
//     }, [visibleColumns]);

//     const filteredItems = useMemo(() => {
//         let filteredEvents = [...events];

//         if (hasSearchFilter) {
//           filteredEvents = filteredEvents.filter((event) =>
//             event.Titolo.toLowerCase().includes(filterValue.toLowerCase()),
//           );
//         }

//         if (dateRange?.from && dateRange?.to) {
//             filteredEvents = filteredEvents.filter((event) => {
//               const startDate = new Date(event.Data_inizio);
//               return startDate >= (dateRange.from as Date) && startDate <= (dateRange.to as Date);
//             });
//           }

//         if (activityTypeFilter) {
//             filteredEvents = filteredEvents.filter((event) =>
//                 event.Attivita === activityTypeFilter
//             );
//          }

//          if (organizerFilter.size > 0) {
//           filteredEvents = filteredEvents.filter((event) => {
//               const isMatch = organizerFilter.has(event.Sezione);
//               // Log each comparison for debugging
//               return isMatch;
//           });
//       }

//         if (targetGroupFilter.size > 0) {
//             filteredEvents = filteredEvents.filter(event =>
//                 targetGroupFilter.has(event.Gruppo) // Ensure this matches exactly how names are stored in the events
//             );
//         }

//         if (difficultyFilter.size > 0) {
//             filteredEvents = filteredEvents.filter(event =>
//                 difficultyFilter.has(event.Difficolta) // Ensure this matches exactly how names are stored in the events
//             );
//         }

//         if (elevationGainRange) {
//             filteredEvents = filteredEvents.filter(event => {
//                 const gain = event.Dislivello_in_salita; // Ensure this property exists and is a number
//                 return gain >= elevationGainRange[0] && gain <= elevationGainRange[1];
//             });
//         }
//         return filteredEvents;
//       }, [events, filterValue, dateRange, activityTypeFilter, organizerFilter, targetGroupFilter, difficultyFilter, elevationGainRange, hasSearchFilter]);

//     const pages = Math.ceil(filteredItems.length / rowsPerPage);

//     const items = useMemo(() => {
//         const start = (page - 1) * rowsPerPage;
//         const end = start + rowsPerPage;

//         return filteredItems.slice(start, end);
//       }, [page, filteredItems, rowsPerPage]);

//       const uniqueOrganizerSections: OrganizerSection[] = Array.from(new Set(activities.map((event: any) => event.Sezione)))
//       .map((name, index) => ({
//           id: index + 1,
//           name: String(name),
//           avatar: 'http://localhost:3000/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcai_logo.f811fe26.png&w=256&q=75'
//       }));

//       const targetGroup: TargetGroup[] = Array.from(new Set(events.map((event: any) => event.Gruppo)))
//       .map((name, index) => ({
//         id: index + 1,
//         name: String(name),
//       }));

//       const difficulty: DifficultyLevel[] = Array.from(new Set(events.map((event: any) => event.Difficolta)))
//       .map((name, index) => ({
//         id: index + 1,
//         name: String(name),
//       }));

//     const sortedItems = useMemo(() => {
//         let itemsToSort = [...events];

//         return [...items].sort((a: any, b: any) => {
//           const first = a[sortDescriptor.column as keyof Event] as string
//           const second = b[sortDescriptor.column as keyof Event] as string
//           const cmp = first < second ? -1 : first > second ? 1 : 0

//           return sortDescriptor.direction === 'descending' ? -cmp : cmp
//         })
//       }, [sortDescriptor, items, events])

//       const onNextPage = useCallback(() => {
//         if (page < pages) {
//           setPage(page + 1);
//         }
//       }, [page, pages]);

//       const onPreviousPage = useCallback(() => {
//         if (page > 1) {
//           setPage(page - 1);
//         }
//       }, [page]);

//       const onRowsPerPageChange = useCallback((e: any) => {
//         setRowsPerPage(Number(e.target.value));
//         setPage(1);
//       }, []);

//       const onSearchChange = useCallback((value: any) => {
//         if (value) {
//           setFilterValue(value);
//           setPage(1);
//         } else {
//           setFilterValue("");
//         }
//       }, []);

//       const onClear = useCallback(()=>{
//         setFilterValue("")
//         setPage(1)
//       },[])

//       const handleSelectionChange = (keys: Selection) => {
//         if (keys === "all") {
//           const allColumns = new Set(columns.map(column => column.uid));
//           setVisibleColumns(allColumns);
//         } else {
//           setVisibleColumns(new Set(Array.from(keys).map(key => String(key))));
//         }
//       };

//       const handleCategorySelect = useCallback((category: string) => {
//             setActivityTypeFilter(category);
//             setSelectedCategory(category);
//       }, []);

//       const handleOrganizerSelectionChange = (selectedKeys: any) => {
//         const selectedNames = new Set(selectedKeys);
//         setOrganizerFilter(selectedNames);
//       };

//       const handleTargetGroupSelectionChange = (selectedKeys: any) => {
//         const selectedNames = new Set(selectedKeys);
//         setTargetGroupFilter(selectedNames);
//       };

//       const handleDifficultySelectionChange = (selectedKeys: any) => {
//         const selectedNames = new Set(selectedKeys);
//         setDifficultyFilter(selectedNames);
//       };

//       const { triggerReset } = useReset();

//       const handleResetFilters = useCallback(() => {
//         setDateRange(undefined);
//         setActivityTypeFilter('');
//         setFilterValue('');
//         setSelectedKeys(new Set());
//         setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS));
//         setStatusFilter('all');
//         setOrganizerFilter(new Set());
//         setTargetGroupFilter(new Set());
//         setDifficultyFilter(new Set());
//         setElevationGainRange([0, 3000]);
//         setDurationRange([0, 16]);
//         setPage(1);
//         setSortDescriptor({ column: 'Titolo', direction: 'ascending' });
//         triggerReset();
//     }, [triggerReset]);

//     const isFiltered = filteredItems.length < events.length;

//     const prevSelectedKeysRef = useRef(selectedKeys);

//     useEffect(() => {

//     // Update the ref with the current selection for the next render
//     prevSelectedKeysRef.current = selectedKeys;
//     }, [selectedKeys, cart.addOneToCart, cart.deleteFromCart]);

//     useEffect(() => {
//         const handleItemDeletion = (id: string) => {
//             // Logic to deselect item in your table based on the deleted item's id
//             setSelectedKeys((prevSelectedKeys) => {
//                 const newSelectedKeys = new Set(prevSelectedKeys);
//                 newSelectedKeys.delete(id);
//                 return newSelectedKeys;
//             });
//         };

//         subscribeToDeletion(handleItemDeletion);

//         return () => unsubscribeFromDeletion(handleItemDeletion);
//     }, [subscribeToDeletion, unsubscribeFromDeletion]);

//     useEffect(() => {
//       // Set the switch state based on the window width
//       const handleResize = () => {
//         if (window.innerWidth < 768) {
//           // Assuming mobile device widths are below 768px
//           setSwitchIsSelected(false);
//         } else {
//           setSwitchIsSelected(true);
//         }
//       };

//       // Call the function initially and add the event listener on component mount
//       handleResize();
//       window.addEventListener('resize', handleResize);

//       // Cleanup the event listener on component unmount
//       return () => window.removeEventListener('resize', handleResize);
//     }, []);

//       const topContent = useMemo(() => {

//         const handleDateRangeChange = (selectedRange: DateRange | undefined) => {
//             setDateRange(selectedRange);
//           };

//         return (
//             <>
//                 <CategorySlider events={events} onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory}/>
//                 <div className="flex flex-col gap-4">
//                     <div className="flex justify-between gap-3 items-end">
//                     <Input
//                         isClearable
//                         className="w-full sm:max-w-[44%] hidden lg:block"
//                         placeholder="Cerca attività ..."
//                         startContent={<SearchIcon />}
//                         value={filterValue}
//                         onClear={() => onClear()}
//                         onValueChange={onSearchChange}
//                     />
//                     <div className="flex gap-3 items-center justify-between w-full lg:justify-end">
//                         {isFiltered && (
//                             <Button color="secondary" startContent={<Undo className="h-4 w-4"/>} onPress={handleResetFilters} className="hidden lg:flex">
//                                 Cancella filtri
//                             </Button>
//                         )}
//                         <DatePickerWithRange className="" onDateRangeChange={handleDateRangeChange} />
//                         <Dropdown>
//                           <DropdownTrigger className="hidden lg:flex">
//                               <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
//                               Seleziona colonna
//                               </Button>
//                           </DropdownTrigger>
//                           <DropdownMenu
//                               disallowEmptySelection
//                               aria-label="Table Columns"
//                               closeOnSelect={false}
//                               selectedKeys={visibleColumns}
//                               selectionMode="multiple"
//                               onSelectionChange={handleSelectionChange}
//                           >
//                               {columns.map((column) => (
//                               <DropdownItem key={column.uid} className="capitalize">
//                                   {column.name}
//                               </DropdownItem>
//                               ))}
//                           </DropdownMenu>
//                         </Dropdown>
//                         <Button color="primary" onPress={onOpen} endContent={<SlidersHorizontal className="h-3 w-3"/>} className="bg-[#0E4D71] text-sm h-9">Filtri</Button>
//                         <Switch
//                           defaultSelected
//                           size="lg"
//                           aria-label="Modalità visualizzazione"
//                           onValueChange={setSwitchIsSelected}
//                           thumbIcon={({ isSelected }) =>
//                             isSelected ? (
//                               <AlignJustify className="h-4 w-4" />
//                             ) : (
//                               <LayoutGrid className="h-4 w-4"/>
//                             )
//                           }
//                           color="secondary"
//                           className="h-9 hidden lg:block"
//                         />
//                     </div>
//                     </div>
//                     <div className="flex justify-between items-center px-6 lg:px-0">
//                     <span className="text-default-400 text-small hidden lg:block">{filteredItems.length} Risultati</span>
//                     <label className="hidden lg:flex items-center text-default-400 text-small">
//                         Risultati per pagina:
//                         <select
//                         className="bg-transparent outline-none text-default-400 text-small"
//                         onChange={onRowsPerPageChange}
//                         >
//                         <option value="10">10</option>
//                         <option value="15">15</option>
//                         <option value="25">25</option>
//                         </select>
//                     </label>
//                     </div>
//                 </div>
//             </>
//         );
//       }, [
//         filterValue,
//         visibleColumns,
//         onRowsPerPageChange,
//         onSearchChange,
//         events,
//         filteredItems.length,
//         handleCategorySelect,
//         handleResetFilters,
//         isFiltered,
//         onClear,
//         onOpen,
//         selectedCategory
//       ]);

//       const bottomContent = useMemo(() => {
//         return (
//             <div className="py-2 px-2 flex justify-between items-center">
//               <span className="w-[30%] text-small text-default-400 hidden lg:block">
//              {filteredItems.length} Risultati
//             </span>
//             <Pagination
//               isCompact
//               showControls
//               showShadow
//               color="primary"
//               page={page}
//               total={pages}
//               onChange={setPage}
//               className="mx-auto lg:mx-none"
//             />
//             <div className="hidden sm:flex w-[30%] justify-end gap-2">
//                 <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
//                     Indietro
//                 </Button>
//                 <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
//                     Avanti
//                 </Button>
//             </div>
//           </div>
//         );
//       }, [selectedKeys, filteredItems.length, page, pages, onNextPage, onPreviousPage]);

//   return (
//     <div className="container mt-8 lg:mt-24">
//       {topContent}

//       {
//       switchIsSelected ? (
//         <div className="py-6">
//           <Table
//                 aria-label="Attività CAI Alto Adige"
//                 isHeaderSticky
//                 classNames={{
//                 wrapper: "",
//                 }}
//                 selectedKeys={selectedKeys}
//                 selectionMode="multiple"
//                 selectionBehavior="replace"
//                 sortDescriptor={sortDescriptor as any}
//                 onSelectionChange={setSelectedKeys as any}
//                 onSortChange={setSortDescriptor as any}

//             >
//             <TableHeader columns={headerColumns}>
//                 {(column) => (
//                 <TableColumn
//                     key={column.uid}
//                     align={column.uid === "actions" ? "center" : "start"}
//                     allowsSorting={column.sortable}
//                 >
//                     {column.name}
//                 </TableColumn>
//                 )}
//             </TableHeader>
//             <TableBody emptyContent={"Nessuna attività"} items={sortedItems}>
//                 {(item) => (
//                 <TableRow key={item.id} onClick={() => router.push(`/attivita/${item.slug}`)}>
//                     {(columnKey) => <TableCell>{renderCell(item as any, columnKey)}</TableCell>}
//                 </TableRow>
//                 )}
//             </TableBody>
//           </Table>
//         </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
//           {sortedItems.map((event) => (
//            <Card key={event.id} className="max-w-[400px]">
//             <CardHeader className="flex gap-3">
//             { event.Immagine ? (
//               <Image
//                 alt="nextui logo"
//                 height={100}
//                 radius="sm"
//                 src={`${directus.url}assets/${event.Immagine}`}
//                 width={100}
//                 className="w-12 h-12 object-cover"
//               />
//             ):""}
//               <div className="flex flex-col">
//                 <h3 className="text-md">{event.Titolo}</h3>
//                 <p className="text-small text-default-500">{event.Attivita}</p>
//               </div>
//             </CardHeader>
//             <Divider/>
//             <CardBody>
//               <div className="flex flex-col gap-y-2">
//                 <div className="flex gap-x-2 items-center">
//                   { event.Data_inizio ? (
//                     <>
//                     <CalendarDays className="h-4 w-4"/>
//                     <p className="text-sm text-zinc-600">Data Inizio: <span className="text-zinc-900">{format(event.Data_inizio, "dd LLL, y", { locale: it })}</span></p>
//                     </>
//                   ): <></>}
//                 </div>
//                 <div className="flex gap-x-2 items-center">
//                   { event.Regione_provincia && event.Zona ? (
//                     <>
//                     <MapPin className="h-4 w-4"/>
//                     <p className="text-sm text-zinc-600">Località: <span className="text-zinc-900">{event.Regione_Provincia} | {event.Zona}</span></p>
//                     </>
//                   ): <></>}
//                 </div>
//                 <div className="flex gap-x-2 items-center">
//                   { event.Difficolta ? (
//                     <>
//                     <AlertCircle className="h-4 w-4"/>
//                     <p className="text-sm text-zinc-600">Difficoltà: <span className="text-zinc-900">{event.Difficolta}</span></p>
//                     </>
//                   ): <></>}
//                 </div>
//               </div>
//             </CardBody>
//             <Divider/>
//             <CardFooter className="flex flex-col">
//               <ClientSideRouter route={`/attivita/${event.slug}`} ariaLabel={event.Titolo}>
//               <Button
//                   color="primary"
//                   size="sm"
//                   className="w-full bg-[#0e4d71]"
//                 >
//                   Leggi
//                 </Button>
//               </ClientSideRouter>
//               <AddToCartButtonTable event={event}/>
//             </CardFooter>
//           </Card>
//           ))}
//         </div>
//         )
//       }
//       {bottomContent}
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="mx-12 lg:mx-0">
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex flex-col gap-1">Filtri</ModalHeader>
//               <ModalBody>
//                 <Input
//                     isClearable
//                     className="w-full lg:hidden"
//                     placeholder="Cerca attività ..."
//                     startContent={<SearchIcon />}
//                     value={filterValue}
//                     onClear={() => onClear()}
//                     onValueChange={onSearchChange}
//                 />
//                 <Select
//                     items={uniqueOrganizerSections}
//                     label="Sezione Organizzatrice"
//                     variant="bordered"
//                     isMultiline={true}
//                     selectionMode="multiple"
//                     placeholder="Seleziona una sezione"
//                     selectedKeys={organizerFilter as any}
//                     onSelectionChange={handleOrganizerSelectionChange}
//                     multiple
//                     labelPlacement="outside"
//                     classNames={{
//                         base: "",
//                         trigger: "min-h-unit-12 py-2",
//                     }}
//                     renderValue={(items) => {
//                         return (
//                         <div className="flex flex-wrap gap-2">
//                             {items.map((item) => (
//                             <Chip key={item.key}>{item.data?.name}</Chip>
//                             ))}
//                         </div>
//                         );
//                     }}
//                     >
//                     {(organizerSection) => (
//                         <SelectItem key={organizerSection.name} value={organizerSection.name} textValue={organizerSection.name}>
//                         <div className="flex gap-2 items-center">
//                             <Avatar alt={organizerSection.name} className="flex-shrink-0" size="sm" src={organizerSection.avatar} />
//                             <div className="flex flex-col">
//                             <span className="text-small capitalize">{organizerSection.name}</span>
//                             </div>
//                         </div>
//                         </SelectItem>
//                     )}
//                 </Select>
//                 <Select
//                     label="Gruppo target"
//                     placeholder="Seleziona un gruppo"
//                     selectionMode="multiple"
//                     selectedKeys={targetGroupFilter as any}
//                     onSelectionChange={handleTargetGroupSelectionChange}
//                     className=""
//                     >
//                     {targetGroup.map((target) => (
//                         <SelectItem key={target.name} value={target.name}>
//                         {target.name}
//                         </SelectItem>
//                     ))}
//                 </Select>
//                 <Select
//                     label="Difficoltà"
//                     placeholder="Seleziona un grado di difficoltá"
//                     selectionMode="multiple"
//                     selectedKeys={difficultyFilter as any}
//                     onSelectionChange={handleDifficultySelectionChange}
//                     className=""
//                     >
//                     {difficulty.map((difficultyLevel) => (
//                         <SelectItem key={difficultyLevel.name} value={difficultyLevel.name}>
//                         {difficultyLevel.name}
//                         </SelectItem>
//                     ))}
//                 </Select>
//                 <Slider
//                     label="Dislivello in salita"
//                     step={50}
//                     minValue={0}
//                     maxValue={3000}
//                     defaultValue={[0, 3000]}
//                     formatOptions={{style: 'unit', unit: 'meter',}}
//                     size="sm"
//                     showOutline
//                     value={elevationGainRange}
//                     onChange={setElevationGainRange as any}
//                     className="max-w-md"
//                 />
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="secondary" startContent={<Undo className="h-4 w-4"/>} onPress={handleResetFilters}>
//                   Cancella filtri
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//   </div>
//   );
// }
