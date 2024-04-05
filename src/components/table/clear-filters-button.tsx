// ClearFiltersButton.js or ClearFiltersButton.tsx if using TypeScript
import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Undo2 } from 'lucide-react';
import { useReset } from '@/store/reset-context';

interface ClearFiltersButtonProps {
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
}

const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({ setColumnFilters }) => {
  const { triggerReset } = useReset();

  const handleClick = () => {
    setColumnFilters([]);
    setTimeout(() => {
      triggerReset();
    }, 1);
  };
  
  return (
    <div className="flex w-full justify-center items-center">
      <Undo2 className="w-4 h-4"/>
      <Button variant="link" className="pl-2" onClick={handleClick}>Cancella filtri</Button>
    </div>
  );
};

export default ClearFiltersButton;
