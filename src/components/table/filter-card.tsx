import { Dispatch, SetStateAction } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import InputWithIcon from "./input-with-icon";
import SelectFilter from "./select-with-items";
import { DatePickerWithRange } from "../date-range-picker";
import MultipleSelector from '@/components/ui/multiple-selector';
import RangeSlider from "./range-slider";
import ClearFiltersButton from "./clear-filters-button";
import { SEZIONI, OPTIONS } from "@/lib/data";

  
interface FilterCardProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

export default function FilterCard({ columnFilters, setColumnFilters }: FilterCardProps) {

  return (
    <Card className=" sticky top-20">
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
        <InputWithIcon
          placeholder="Cerca attività"
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          filterId="activity"
        />
        <SelectFilter
          options={SEZIONI.map(sezione => ({ label: sezione, value: sezione }))}
          placeholder="Sezione organizzatrice"
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          filterId="organizerSection" // Assuming 'organizerSection' is the ID you use for this filter
        />
        <DatePickerWithRange columnFilters={columnFilters} setColumnFilters={setColumnFilters}/>
        <MultipleSelector
          defaultOptions={OPTIONS}
          placeholder="Difficoltà"
          className="w-full mt-2"
        />
        <RangeSlider
          max={2000}
          step={1}
          setColumnFilters={setColumnFilters}
        />
        </CardContent>
        <CardFooter>
          <ClearFiltersButton setColumnFilters={setColumnFilters} />
        </CardFooter>
    </Card>  
  )
}
