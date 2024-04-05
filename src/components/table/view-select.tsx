import React from 'react'
import { List } from 'lucide-react'
import { GalleryHorizontal } from 'lucide-react'

interface ViewSelectProps {
    currentView: 'list' | 'grid';
    setView: (view: 'list' | 'grid') => void;
  }
  

  const ViewSelect: React.FC<ViewSelectProps> = ({ currentView, setView }) => {
    return (
      <div className='flex gap-x-4 items-center mr-auto mb-4'>
          <List onClick={() => setView('list')} className='w-4 h-4 cursor-pointer'/>
          <GalleryHorizontal onClick={() => setView('grid')} className='w-4 h-4 cursor-pointer'/>
      </div>
    );
  };
  
  export default ViewSelect;