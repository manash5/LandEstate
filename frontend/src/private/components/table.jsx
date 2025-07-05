import React from "react";
import DataTable from "react-data-table-component";
 
const data = [
  { id: 1, name: "Ram", age: 24 },
  { id: 2, name: "Sita", age: 28 },
  { id: 3, name: "Hari", age: 22 },
];
// npm install react-data-table-component
const columns = [
  {
    name: "Names",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row) => row.age,
    sortable: true,
  },
];
 
export default function table() {
  return (
    <DataTable title="My Table" columns={columns} data={data} pagination />
  );
}
 