"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import Search from "./search";
import { PaginationWithLinks } from "./pagination-with-links";
import { DateFilter } from "./filters/dateFilter";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { startTransition, useState } from "react";
import { Button } from "../ui/button";
import {
  AlertCircle,
  AlignJustify,
  CalendarDays,
  ChevronDown,
  LayoutGrid,
  MapPin,
  SlidersHorizontal,
  Undo,
} from "lucide-react";
import FilterModal from "./filters/filter-modal";
import { Activity } from "../../../types";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import CategorySlider from "../category-slider";
import directus from "@/lib/directus";
import ClientSideRouter from "../ClientSideRouter";
import AddToCartButtonTable from "../AddToCartButtonTable";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalActivities: number;
  allData?: Activity[];
}

type DateRange = {
  from?: Date;
  to?: Date;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  totalActivities,
  allData,
}: DataTableProps<TData, TValue>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    Regione_Provincia: false,
    Zona: false,
    Data_fine: false,
    Numero_massimo_partecipanti: false,
    Iscrizioni_dal: false,
    Quota_di_partenza: false,
    Quota_massima_raggiunta: false,
    Quota_di_arrivo: false,
    Dislivello_in_discesa: false,
    Immagine: false,
    Locandina: false,
    Tracciato_GPX: false,
    Durata_in_ore: false,
    Contatto_riferimento: false,
    Mezzo_di_trasporto: false,
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      //...
    },
    onColumnVisibilityChange: setColumnVisibility,
  });
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const router = useRouter();

  const [switchIsSelected, setSwitchIsSelected] = useState(true);

  const hasFilters = [
    "start",
    "end",
    "sezione",
    "gruppo",
    "difficolta",
    "elevMin",
    "elevMax",
    "categoria",
  ].some((param) => searchParams.has(param));

  const handleResetFilters = () => {
    // 2. Remove filter-related params from URL
    startTransition(() => {
      const params = new URLSearchParams(searchParams);

      params.delete("start");
      params.delete("end");
      params.delete("sezione");
      params.delete("gruppo");
      params.delete("difficolta");
      params.delete("elevMin");
      params.delete("elevMax");
      params.delete("categoria");

      params.set("page", "1");

      router.push(`?${params.toString()}`, { scroll: false });
    });
  };
  return (
    <>
      <CategorySlider events={allData || []} />
      <div className="pb-6 justify-between items-center hidden lg:flex">
        <Search placeholder="Cerca attività..." />
        <div className="flex items-center gap-x-2">
          {hasFilters && (
            <Button variant="outline" onClick={handleResetFilters}>
              <Undo className="h-4 w-4 mr-2" />
              Cancella filtri
            </Button>
          )}
          <DateFilter />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="ml-auto bg-gray-100 hover:bg-gray-50 text-gray-900">
                Seleziona colonna
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            color="primary"
            onClick={onOpen}
            className="bg-[#0E4D71] text-sm h-9"
          >
            Filtri <SlidersHorizontal className="h-3 w-3 ml-2" />
          </Button>
          <FilterModal
            activities={data as Activity[]}
            allActivites={allData as Activity[]}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
          <Switch
            defaultSelected
            size="lg"
            aria-label="Modalità visualizzazione"
            onValueChange={setSwitchIsSelected}
            thumbIcon={({ isSelected }) =>
              isSelected ? (
                <AlignJustify className="h-4 w-4" />
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )
            }
            color="secondary"
            className="h-9 hidden lg:block"
          />
        </div>
      </div>
      <div className="pb-6 justify-between items-center flex lg:hidden px-4">
        <DateFilter />
        <Button
          color="primary"
          onClick={onOpen}
          className="bg-[#0E4D71] text-sm h-9"
        >
          Filtri <SlidersHorizontal className="h-3 w-3 ml-2" />
        </Button>
        <FilterModal
          activities={data as Activity[]}
          allActivites={allData as Activity[]}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
        <Switch
          defaultSelected
          size="lg"
          aria-label="Modalità visualizzazione"
          onValueChange={setSwitchIsSelected}
          thumbIcon={({ isSelected }) =>
            isSelected ? (
              <AlignJustify className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )
          }
          color="secondary"
          className="h-9 hidden lg:block"
        />
      </div>
      {switchIsSelected ? (
        <div className="rounded-md border p-4 shadow-lg overflow-x-auto grid grid-cols-1">
          <Table className="w-full relative">
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="px-2 whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => {
                      const slug = (row.original as { slug: string }).slug;
                      router.push(`/attivita/${slug}`);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="pr-12 whitespace-nowrap py-4"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nessuna attività.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(data as Activity[]).map((event) => (
            <Card key={event.id} className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                {event.Immagine ? (
                  <Image
                    alt="nextui logo"
                    height={100}
                    radius="sm"
                    src={`${directus.url}assets/${event.Immagine}`}
                    width={100}
                    className="w-12 h-12 object-cover"
                  />
                ) : (
                  ""
                )}
                <div className="flex flex-col">
                  <h3 className="text-md">{event.Titolo}</h3>
                  <p className="text-small text-default-500">
                    {event.Attivita}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-2 items-center">
                    {event.Data_inizio ? (
                      <>
                        <CalendarDays className="h-4 w-4" />
                        <p className="text-sm text-zinc-600">
                          Data Inizio:{" "}
                          <span className="text-zinc-900">
                            {format(event.Data_inizio, "dd LLL, y", {
                              locale: it,
                            })}
                          </span>
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex gap-x-2 items-center">
                    {event.Regione_provincia && event.Zona ? (
                      <>
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm text-zinc-600">
                          Località:{" "}
                          <span className="text-zinc-900">
                            {event.Regione_Provincia} | {event.Zona}
                          </span>
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex gap-x-2 items-center">
                    {event.Difficolta ? (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm text-zinc-600">
                          Difficoltà:{" "}
                          <span className="text-zinc-900">
                            {event.Difficolta}
                          </span>
                        </p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </CardBody>
              <Divider />
              <CardFooter className="flex flex-col">
                <ClientSideRouter
                  route={`/attivita/${event.slug}`}
                  ariaLabel={event.Titolo}
                >
                  <Button
                    color="primary"
                    size="sm"
                    className="w-full bg-[#0e4d71]"
                  >
                    Leggi
                  </Button>
                </ClientSideRouter>
                <AddToCartButtonTable event={event} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-10">
        <PaginationWithLinks
          page={currentPage}
          pageSize={10}
          totalCount={parseInt((totalActivities || "0").toString())}
        />
      </div>
    </>
  );
}
