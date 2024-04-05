export const isWithinRange = (row:any, columnId:any, value:any) => {
    const [selectedStart, selectedEnd] = value;
      
    // Get the event's start and end dates from the row
    const eventStart = row.getValue('startDate');
    const eventEnd = row.getValue('endDate');
  
    // Check if either the event's start or end date falls within the selected date range
    if (selectedStart && selectedEnd && eventStart && eventEnd) {
      return (eventStart <= selectedEnd && eventStart >= selectedStart) || 
             (eventEnd <= selectedEnd && eventEnd >= selectedStart) ||
             (eventStart <= selectedStart && eventEnd >= selectedEnd);
    }
  
    return true; // Return true if there's no date range selected to include all rows
  };
  
  export const elevationGainFilterFn = (row:any, columnId:any, filterValue:any) => {
    const rowValue = row.getValue(columnId);
    const [minElevation, maxElevation] = filterValue;
    
    return rowValue >= minElevation && rowValue <= maxElevation;
  };
  