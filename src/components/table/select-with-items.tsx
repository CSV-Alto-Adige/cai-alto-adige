import React, { useState, useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReset } from '@/store/reset-context';

interface SelectFilterProps {
  options: { label: string; value: string }[];
  placeholder: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  filterId: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  options,
  placeholder,
  columnFilters,
  setColumnFilters,
  filterId,
}) => {
  const { shouldReset } = useReset();

  // Local state to manage the selected value
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    // Reset the selected value when shouldReset changes to true
    if (shouldReset) {
      setSelectedValue('');
    }
  }, [shouldReset]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    const newFilters = value
      ? [...columnFilters.filter(f => f.id !== filterId), { id: filterId, value }]
      : columnFilters.filter(f => f.id !== filterId);
    setColumnFilters(newFilters);
  };

  return (
    <div className='mt-2'>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectFilter;
