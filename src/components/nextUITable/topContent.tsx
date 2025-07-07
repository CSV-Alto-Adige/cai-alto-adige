// "use client"
// import { useState } from "react";
// import { Input } from "@nextui-org/react";
// import { SearchIcon } from "lucide-react";
// import { useMemo } from "react";

// const TopContent = ({events}: any) => {
//     const [filterValue, setFilterValue] = useState("");
//     const hasSearchFilter = Boolean(filterValue);

//     const filteredItems = useMemo(() => {
//       let filteredEvents = [...events];

//       if (hasSearchFilter) {
//         filteredEvents = filteredEvents.filter((event) =>
//           event.activity.toLowerCase().includes(filterValue.toLowerCase()),
//         );
//       }

//       return filteredEvents;
//     }, [events, filterValue, hasSearchFilter]);

//   return (
//     <>
//         <Input
//             isClearable
//             className="w-full sm:max-w-[44%] hidden lg:block"
//             placeholder="Cerca attività ..."
//             startContent={<SearchIcon />}
//             value={filterValue}
//         />
//     </>
//   )
// }

// export default TopContent
