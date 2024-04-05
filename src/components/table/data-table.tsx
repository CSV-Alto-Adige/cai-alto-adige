"use client"

import * as React from "react"
import { useContext } from "react"
import { AlignJustify, LayoutGrid, SlidersHorizontal } from "lucide-react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CartContext } from "@/store/cart-context"
import { isWithinRange, elevationGainFilterFn } from "@/lib/filters"
import InputWithIcon from "./input-with-icon";
import { DatePickerWithRange } from "../date-range-picker"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

interface RowData {
  id: string;
  activity: string;
  organizerSection: string;
}

type ViewMode = 'list' | 'grid';


const VIEW_MODES = {
  LIST: 'list' as const,
  GRID: 'grid' as const,
};

export function DataTable<TData, TValue>({
    columns,
    data,
  }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [viewMode, setViewMode] = React.useState<ViewMode>(VIEW_MODES.LIST);
    const cart = useContext(CartContext)

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      defaultColumn: {
        size: 200, //starting column size
        minSize: 200, //enforced during column resizing
        maxSize: 500, //enforced during column resizing
      },
      state: {
        sorting,
        columnFilters,
      },
      filterFns: {
        isWithinRange: isWithinRange,
        elevationGainFilter: elevationGainFilterFn,
      },
    })
    
    // const rowDataElements = table.getRowModel().rows.map(row => {
    //   // Access the original data for the current row
    //   const rowData = row.original;
    //   console.log(rowData)
    // });
    
    
  return (

      <div className="mx-auto py-10 mt-12">
        <Tabs defaultValue="account" className="w-full">
          <div className="flex justify-between gap-x-4 mb-4">
            <InputWithIcon  
              placeholder="Cerca attività"
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
              filterId="activity"
            />
            <div className="flex items-center gap-x-4">
              <DatePickerWithRange columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>
              <TabsList>
                <TabsTrigger value="account"><AlignJustify className="h-4 w-4"/></TabsTrigger>
                <TabsTrigger value="password"><LayoutGrid className="h-4 w-4"/></TabsTrigger>
              </TabsList>
              <Button variant="outline"><SlidersHorizontal className="h-4 w-4"/></Button>
            </div>
          </div>
          <TabsContent value="account">
              <div className="">
                <Table className="px-1 w-full text-left border-separate border-spacing-y-[10px] border-spacing-x-3">
                <TableHeader>
                          {table.getHeaderGroups().map((headerGroup) => (
                              <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                  return (
                                  <TableHead className="text-xs rounded-xl border border-[#0e4d71] text-zinc-900 font-semibold font-public" style={{ minWidth: header.column.getSize(),}} key={header.id}>
                                      {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                          )}
                                  </TableHead>
                                  )
                              })}
                              </TableRow>
                          ))}
                          </TableHeader>
                    <TableBody className="border-1 border-zinc-500 ">
                      {table.getRowModel().rows.length > 0 ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="">
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="whitespace-nowrap text-[16px] text-zinc-900 font-public" style={{ minWidth: cell.column.getSize() }}>
                                  {/* <div className="mb-1 whitespace-nowrap text-xs text-slate-500 font-public">
                                    {typeof cell.column.columnDef.header === 'function'
                                      ? 'cell.column.columnDef.header'
                                      : cell.column.columnDef.header}
                                  </div> */}
                                  <div className="uppercase text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </div>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                              Nessuna attività.
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                  >
                      Indietro
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                  >
                      Avanti
                  </Button>
                </div>
              </div>
          </TabsContent>
          <TabsContent value="password">
            <div>
              <div className="grid grid-cols-4 gap-x-6 gap-y-6">
                {table.getRowModel().rows.map(row => (
                        <Card key={row.id}>
                        <CardHeader>
                          <CardTitle>{(row.original as RowData).activity}</CardTitle>
                          <CardDescription>Card Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Location: {(row.original as RowData).organizerSection}</p>
                        </CardContent>
                        <CardFooter>
                        <Button 
                          onClick={() => cart.addOneToCart((row.original as RowData).id)}
                          disabled={cart.items.some(item => item.id === (row.original as RowData).id)}
                          className={cart.items.some(item => item.id === (row.original as RowData).id) ? "bg-gray-200" : ""}>
                            Aggiungi ai favoriti
                          </Button>
                        </CardFooter>
                      </Card>
                ))}
              </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                  >
                      Indietro
                  </Button>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                  >
                      Avanti
                  </Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}
