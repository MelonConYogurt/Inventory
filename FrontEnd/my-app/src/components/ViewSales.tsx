import {columns} from "./Columns-sales";
import {DataTable} from "./Data-table-sales";

function ViewSales() {
  return (
    <>
      <DataTable columns={columns} data={[]}></DataTable>
    </>
  );
}

export default ViewSales;
