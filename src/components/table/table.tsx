import { columns } from "./columns"
import { DataTable } from "./data-table"
import { events } from "@/lib/eventsData";

export default async function Table() {
  return (
    <div className="container px-0">
        <DataTable columns={columns} data={events}/>
    </div>
  )
}
