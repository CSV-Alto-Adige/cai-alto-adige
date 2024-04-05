import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'; // Adjust based on your setup
import { Dispatch, SetStateAction } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { useReset } from '@/store/reset-context';
import { Input } from '../ui/input'; // Adjust the path based on your project structure

interface InputWithIconProps {
  placeholder: string;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  filterId: string;
}

const InputWithIcon: React.FC<InputWithIconProps> = ({
  placeholder,
  columnFilters,
  setColumnFilters,
  filterId,
}) => {
  const [inputValue, setInputValue] = useState('');
  const { shouldReset } = useReset();

  // Reset the input value and filter when the reset context triggers a reset
  useEffect(() => {
    if (shouldReset) {
      setInputValue('');
    }
  }, [shouldReset]);

  // Update input value based on the filter's value from columnFilters
  useEffect(() => {
    const filter = columnFilters.find(f => f.id === filterId);
    const value = typeof filter?.value === 'string' ? filter.value : '';
    setInputValue(value);
  }, [filterId, columnFilters]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const newFilters = value
      ? [...columnFilters.filter(f => f.id !== filterId), { id: filterId, value }]
      : columnFilters.filter(f => f.id !== filterId);
    setColumnFilters(newFilters);
  };

  return (
    <div className="flex items-center relative">
      <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400" />
      <Input
       type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={e => handleInputChange(e.target.value)}
        className="pl-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
    </div>
  );
};

export default InputWithIcon;
