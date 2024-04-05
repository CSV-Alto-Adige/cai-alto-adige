import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { useReset } from '@/store/reset-context';
import { Dispatch, SetStateAction } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";

interface RangeSliderProps {
  max: number;
  step: number;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ max, step, setColumnFilters }) => {
  const { shouldReset, triggerReset } = useReset();
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, max]);

  // Listen for reset trigger
  useEffect(() => {
    if (shouldReset) {
      // Reset range to initial values
      const initialRange: [number, number] = [0, max];
      setRangeValue(initialRange);
    }
  }, [shouldReset, max]);

  const handleSliderChange = (value: number[]) => {
    if (value.length === 2) {
      setRangeValue(value as [number, number]);
      // Update column filters with the new range value
      setColumnFilters(prev => {
        const filtersWithoutElevation = prev.filter(f => f.id !== 'elevationGain');
        return [...filtersWithoutElevation, { id: 'elevationGain', value: value as [number, number] }];
      });
    } else {
      console.error("Expected two values from slider, received:", value);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-end">
        <p className="mb-2 text-sm">Salita</p>
        <p className="mb-2 text-sm">Da {rangeValue[0]} mt a {rangeValue[1]} mt</p>
      </div>
      <Slider
        value={rangeValue}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
      />
    </div>
  );
};

export default RangeSlider;
