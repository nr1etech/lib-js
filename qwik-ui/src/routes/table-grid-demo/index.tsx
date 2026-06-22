import {component$, useSignal, useStore, $} from '@builder.io/qwik';
import {
  TableGrid,
  type TableGridColumn,
  type TableGridSort,
} from '../../components/table-grid';

interface Employee {
  id: number;
  name: string;
  department: string;
  salary: number;
  startDate: string;
  active: boolean;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    department: 'Engineering',
    salary: 95000,
    startDate: '2021-03-15',
    active: true,
  },
  {
    id: 2,
    name: 'Bob Smith',
    department: 'Marketing',
    salary: 72000,
    startDate: '2020-07-01',
    active: true,
  },
  {
    id: 3,
    name: 'Carol White',
    department: 'Engineering',
    salary: 105000,
    startDate: '2019-11-20',
    active: false,
  },
  {
    id: 4,
    name: 'David Brown',
    department: 'HR',
    salary: 68000,
    startDate: '2022-01-10',
    active: true,
  },
  {
    id: 5,
    name: 'Eve Davis',
    department: 'Engineering',
    salary: 112000,
    startDate: '2018-05-30',
    active: true,
  },
  {
    id: 6,
    name: 'Frank Miller',
    department: 'Marketing',
    salary: 78000,
    startDate: '2021-09-14',
    active: true,
  },
  {
    id: 7,
    name: 'Grace Wilson',
    department: 'Finance',
    salary: 88000,
    startDate: '2020-02-28',
    active: false,
  },
  {
    id: 8,
    name: 'Henry Taylor',
    department: 'Finance',
    salary: 91000,
    startDate: '2017-12-05',
    active: true,
  },
];

const COLUMNS: TableGridColumn[] = [
  {key: 'id', header: 'ID', width: 60, sortable: true},
  {
    key: 'name',
    header: 'Name',
    width: 180,
    sortable: true,
    editable: true,
    type: 'text',
  },
  {
    key: 'department',
    header: 'Department',
    width: 140,
    sortable: true,
    editable: true,
    type: 'text',
  },
  {
    key: 'salary',
    header: 'Salary',
    width: 110,
    sortable: true,
    editable: true,
    type: 'number',
  },
  {
    key: 'startDate',
    header: 'Start Date',
    width: 120,
    sortable: true,
    editable: true,
    type: 'date',
  },
  {key: 'active', header: 'Active', width: 80, sortable: true},
];

export default component$(() => {
  const employees = useStore<Record<string, unknown>[]>(
    INITIAL_EMPLOYEES.map((e) => ({...e})),
  );
  const loading = useSignal(false);
  const selectedRow = useSignal<number | undefined>(undefined);
  const lastSort = useSignal<TableGridSort | undefined>(undefined);
  const lastChange = useSignal('');

  return (
    <div class="bg-base-100 min-h-screen p-8">
      <h1 class="mb-2 text-2xl font-bold">TableGrid Demo</h1>
      <p class="text-base-content/60 mb-6 text-sm">
        A flexible spreadsheet-like data grid. Click a cell to select it,
        double-click (or press Enter / F2) to edit. Use arrow keys, Tab and
        Enter to navigate while editing.
      </p>

      <div class="mb-4 flex gap-3">
        <button
          class="btn btn-sm"
          onClick$={$(() => {
            loading.value = !loading.value;
          })}
        >
          Toggle loading
        </button>
        <button
          class="btn btn-sm"
          onClick$={$(() => {
            employees.push({
              id: employees.length + 1,
              name: 'New Employee',
              department: 'Engineering',
              salary: 80000,
              startDate: '2024-01-01',
              active: true,
            });
          })}
        >
          Add row
        </button>
        <button
          class="btn btn-sm btn-error"
          onClick$={$(() => {
            if (selectedRow.value !== undefined) {
              employees.splice(selectedRow.value, 1);
              selectedRow.value = undefined;
            }
          })}
        >
          Delete selected
        </button>
      </div>

      <div class="border-base-300 mb-6 max-h-96 overflow-auto rounded border">
        <TableGrid
          columns={COLUMNS}
          rows={employees}
          loading={loading}
          selectedRowIndex={selectedRow}
          rowNumbers
          stickyHeader
          emptyMessage="No employees found"
          onCellChange$={$((rowIdx: number, key: string, value: unknown) => {
            if (employees[rowIdx]) {
              employees[rowIdx][key] = value;
              lastChange.value = `Row ${rowIdx}, key "${key}" → ${JSON.stringify(value)}`;
            }
          })}
          onSort$={$((sort: TableGridSort | undefined) => {
            lastSort.value = sort;
          })}
        />
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="border-base-300 bg-base-200 rounded border p-4">
          <h2 class="mb-2 text-sm font-semibold">Selected row index</h2>
          <code class="text-xs">
            {selectedRow.value !== undefined
              ? String(selectedRow.value)
              : 'none'}
          </code>
        </div>
        <div class="border-base-300 bg-base-200 rounded border p-4">
          <h2 class="mb-2 text-sm font-semibold">Last sort</h2>
          <code class="text-xs">
            {lastSort.value
              ? `${lastSort.value.key} ${lastSort.value.direction}`
              : 'none'}
          </code>
        </div>
        <div class="border-base-300 bg-base-200 col-span-full rounded border p-4">
          <h2 class="mb-2 text-sm font-semibold">Last cell change</h2>
          <code class="text-xs">{lastChange.value || 'none'}</code>
        </div>
      </div>
    </div>
  );
});
