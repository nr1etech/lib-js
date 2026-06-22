import {
  $,
  component$,
  QRL,
  Signal,
  useOnDocument,
  useSignal,
  useStore,
} from '@builder.io/qwik';
import {
  MdiChevronDown,
  MdiChevronUp,
  Spinners6DotsRotate,
} from '@nr1e/qwik-icons';

export interface TableGridColumn {
  /** Unique key that maps to a property on the row data object */
  key: string;
  /** Display label for the column header */
  header: string;
  /** Fixed column width in pixels */
  width?: number;
  /** Minimum column width in pixels (default 60) */
  minWidth?: number;
  /** Allow the user to edit this cell */
  editable?: boolean;
  /** Show sort controls on this column header */
  sortable?: boolean;
  /** Extra CSS class applied to each body cell in this column */
  class?: string;
  /** Extra CSS class applied to the header cell */
  headerClass?: string;
  /** Input type used when the cell enters edit mode */
  type?: 'text' | 'number' | 'date';
}

export interface TableGridSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface TableGridProps {
  columns: TableGridColumn[];
  rows: Record<string, unknown>[];
  /** Extra CSS class on the root container */
  class?: string;
  /** Message shown when rows is empty */
  emptyMessage?: string;
  /** When true (or a truthy signal), show a loading spinner */
  loading?: Signal<boolean>;
  /** Called when an editable cell value is committed */
  onCellChange$?: QRL<
    (originalRowIndex: number, key: string, value: unknown) => void
  >;
  /** Called when a row is clicked */
  onRowClick$?: QRL<
    (originalRowIndex: number, row: Record<string, unknown>) => void
  >;
  /** Controlled selected-row signal (original row index) */
  selectedRowIndex?: Signal<number | undefined>;
  /** Pin the header row while the body scrolls (default true) */
  stickyHeader?: boolean;
  /** Show a leading row-number column (default false) */
  rowNumbers?: boolean;
  /** Called whenever the internal sort state changes */
  onSort$?: QRL<(sort: TableGridSort | undefined) => void>;
}

export const TableGrid = component$((props: TableGridProps) => {
  // ── Active cell & edit state ─────────────────────────────────────────────
  const activeCellRow = useSignal(-1);
  const activeCellCol = useSignal(-1);
  const isEditing = useSignal(false);
  const editValue = useSignal('');

  // ── Sort state ────────────────────────────────────────────────────────────
  const sortKey = useSignal<string | undefined>(undefined);
  const sortDir = useSignal<'asc' | 'desc'>('asc');

  // ── Column widths (resize) ────────────────────────────────────────────────
  const colWidths = useStore<Record<string, number>>({});
  const resizing = useStore<{
    active: boolean;
    colKey: string;
    startX: number;
    startWidth: number;
  }>({active: false, colKey: '', startX: 0, startWidth: 0});

  // ── Document-level pointer tracking for column resize ─────────────────────
  useOnDocument(
    'mousemove',
    $((e: MouseEvent) => {
      if (!resizing.active) return;
      const delta = e.clientX - resizing.startX;
      const col = props.columns.find((c) => c.key === resizing.colKey);
      const min = col?.minWidth ?? 60;
      colWidths[resizing.colKey] = Math.max(resizing.startWidth + delta, min);
    }),
  );

  useOnDocument(
    'mouseup',
    $(() => {
      resizing.active = false;
    }),
  );

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Commit the current edit and call the prop callback */
  const commitEdit$ = $(
    async (rowIdx: number, colIdx: number, originalRowIndex: number) => {
      if (!isEditing.value) return;
      isEditing.value = false;
      const col = props.columns[colIdx];
      if (!col) return;
      let value: unknown = editValue.value;
      if (col.type === 'number') {
        value = editValue.value === '' ? null : Number(editValue.value);
      }
      if (props.onCellChange$) {
        await props.onCellChange$(originalRowIndex, col.key, value);
      }
    },
  );

  // ── Derive sorted rows (reactive to sortKey / sortDir / rows) ─────────────
  const withIdx = props.rows.map((row, idx) => ({row, originalIndex: idx}));
  const sortedWithIdx = sortKey.value
    ? [...withIdx].sort((a, b) => {
        const key = sortKey.value!;
        const av = a.row[key];
        const bv = b.row[key];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = av < bv ? -1 : 1;
        return sortDir.value === 'asc' ? cmp : -cmp;
      })
    : withIdx;

  const isLoading = props.loading?.value ?? false;
  const colCount = props.columns.length;
  const rowCount = props.rows.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      class={`border-base-300 relative overflow-auto rounded border focus:outline-none ${props.class ?? ''}`}
      tabIndex={0}
      onKeyDown$={async (e: KeyboardEvent) => {
        if (activeCellRow.value < 0) return;
        if (isEditing.value) return; // key events handled by the input

        const r = activeCellRow.value;
        const c = activeCellCol.value;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            if (r > 0) activeCellRow.value = r - 1;
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (r + 1 < rowCount) activeCellRow.value = r + 1;
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (c > 0) activeCellCol.value = c - 1;
            break;
          case 'ArrowRight':
            e.preventDefault();
            if (c + 1 < colCount) activeCellCol.value = c + 1;
            break;
          case 'Tab': {
            e.preventDefault();
            const nextC = e.shiftKey ? c - 1 : c + 1;
            if (nextC >= 0 && nextC < colCount) {
              activeCellCol.value = nextC;
            } else if (!e.shiftKey && r + 1 < rowCount) {
              activeCellRow.value = r + 1;
              activeCellCol.value = 0;
            } else if (e.shiftKey && r > 0) {
              activeCellRow.value = r - 1;
              activeCellCol.value = colCount - 1;
            }
            break;
          }
          case 'Enter':
          case 'F2': {
            e.preventDefault();
            const col = props.columns[c];
            if (col?.editable) {
              const cellVal = sortedWithIdx[r]?.row[col.key];
              editValue.value = cellVal != null ? String(cellVal) : '';
              isEditing.value = true;
            }
            break;
          }
          case 'Escape':
            isEditing.value = false;
            break;
          default: {
            // Typing a printable character starts editing with that character
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
              const col = props.columns[c];
              if (col?.editable) {
                editValue.value = e.key;
                isEditing.value = true;
              }
            }
          }
        }
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div class="bg-base-100/70 absolute inset-0 z-20 flex items-center justify-center">
          <Spinners6DotsRotate size={48} class="opacity-30" />
        </div>
      )}

      <table class="w-full border-collapse text-sm">
        {/* ── Header ── */}
        <thead>
          <tr>
            {props.rowNumbers && (
              <th
                class={`border-base-300 bg-base-200 text-base-content/50 border px-2 py-1 text-center text-xs font-semibold ${props.stickyHeader !== false ? 'sticky top-0 z-10' : ''}`}
                style={{width: '2.5rem', minWidth: '2.5rem'}}
              >
                #
              </th>
            )}
            {props.columns.map((col) => {
              const w = colWidths[col.key] ?? col.width;
              const isSorted = sortKey.value === col.key;
              return (
                <th
                  key={col.key}
                  class={`group border-base-300 bg-base-200 relative border px-2 py-1 text-left text-xs font-semibold select-none ${col.sortable ? 'hover:bg-base-300 cursor-pointer' : ''} ${props.stickyHeader !== false ? 'sticky top-0 z-10' : ''} ${col.headerClass ?? ''}`}
                  style={
                    w
                      ? {width: `${w}px`, minWidth: `${w}px`}
                      : col.minWidth
                        ? {minWidth: `${col.minWidth}px`}
                        : {}
                  }
                  onClick$={() => {
                    if (!col.sortable) return;
                    let newKey: string | undefined = col.key;
                    let newDir: 'asc' | 'desc' = 'asc';
                    if (sortKey.value === col.key) {
                      if (sortDir.value === 'asc') {
                        newDir = 'desc';
                      } else {
                        // Third click clears the sort
                        newKey = undefined;
                      }
                    }
                    sortKey.value = newKey;
                    sortDir.value = newDir;
                    if (props.onSort$) {
                      const s: TableGridSort | undefined = newKey
                        ? {key: newKey, direction: newDir}
                        : undefined;
                      props.onSort$(s);
                    }
                  }}
                >
                  <div class="flex items-center gap-1 overflow-hidden pr-1">
                    <span class="truncate">{col.header}</span>
                    {col.sortable && (
                      <span class="ml-auto shrink-0">
                        {isSorted && sortDir.value === 'asc' ? (
                          <MdiChevronUp size={14} />
                        ) : isSorted && sortDir.value === 'desc' ? (
                          <MdiChevronDown size={14} />
                        ) : (
                          <span class="opacity-0 group-hover:opacity-30">
                            <MdiChevronUp size={14} />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  {/* Resize handle */}
                  <div
                    class="hover:bg-primary/40 active:bg-primary/60 absolute top-0 right-0 h-full w-1.5 cursor-col-resize"
                    onMouseDown$={(e: MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const th = (e.currentTarget as HTMLElement)
                        .parentElement as HTMLTableCellElement;
                      resizing.active = true;
                      resizing.colKey = col.key;
                      resizing.startX = e.clientX;
                      resizing.startWidth = th.offsetWidth;
                    }}
                  />
                </th>
              );
            })}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {!isLoading && sortedWithIdx.length === 0 && (
            <tr>
              <td
                colSpan={colCount + (props.rowNumbers ? 1 : 0)}
                class="border-base-300 text-base-content/50 border px-4 py-8 text-center"
              >
                {props.emptyMessage ?? 'No data'}
              </td>
            </tr>
          )}

          {!isLoading &&
            sortedWithIdx.map(({row, originalIndex}, rowIdx) => {
              const isSelectedRow =
                props.selectedRowIndex?.value === originalIndex ||
                activeCellRow.value === rowIdx;
              return (
                <tr
                  key={originalIndex}
                  class={`${isSelectedRow ? 'bg-base-200' : 'hover:bg-base-200/50'}`}
                  onClick$={async () => {
                    if (props.onRowClick$) {
                      await props.onRowClick$(originalIndex, row);
                    }
                    if (props.selectedRowIndex) {
                      props.selectedRowIndex.value = originalIndex;
                    }
                    if (!isEditing.value) {
                      activeCellRow.value = rowIdx;
                      if (activeCellCol.value < 0) {
                        activeCellCol.value = 0;
                      }
                    }
                  }}
                >
                  {props.rowNumbers && (
                    <td class="border-base-300 text-base-content/40 border px-2 py-1 text-center text-xs select-none">
                      {rowIdx + 1}
                    </td>
                  )}
                  {props.columns.map((col, colIdx) => {
                    const isActiveCell =
                      activeCellRow.value === rowIdx &&
                      activeCellCol.value === colIdx;
                    const isCellEditing = isActiveCell && isEditing.value;
                    const rawVal = row[col.key];
                    const displayVal = rawVal != null ? String(rawVal) : '';

                    return (
                      <td
                        key={col.key}
                        class={`border-base-300 relative border p-0 ${isActiveCell && !isCellEditing ? 'ring-primary ring-2 ring-inset' : ''} ${col.class ?? ''}`}
                        onClick$={(e: MouseEvent) => {
                          const wasActive = isActiveCell;
                          activeCellRow.value = rowIdx;
                          activeCellCol.value = colIdx;
                          // Second click on the already-active editable cell enters edit mode
                          if (wasActive && col.editable && !isEditing.value) {
                            e.stopPropagation();
                            editValue.value = displayVal;
                            isEditing.value = true;
                          }
                        }}
                        onDblClick$={() => {
                          if (col.editable) {
                            activeCellRow.value = rowIdx;
                            activeCellCol.value = colIdx;
                            editValue.value = displayVal;
                            isEditing.value = true;
                          }
                        }}
                      >
                        {isCellEditing ? (
                          <input
                            autoFocus
                            class="bg-base-100 absolute inset-0 w-full border-0 px-2 py-1 text-sm focus:outline-none"
                            type={
                              col.type === 'number'
                                ? 'number'
                                : col.type === 'date'
                                  ? 'date'
                                  : 'text'
                            }
                            value={editValue.value}
                            onInput$={(e) => {
                              editValue.value = (
                                e.target as HTMLInputElement
                              ).value;
                            }}
                            onKeyDown$={async (e: KeyboardEvent) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                await commitEdit$(
                                  rowIdx,
                                  colIdx,
                                  originalIndex,
                                );
                                if (rowIdx + 1 < rowCount) {
                                  activeCellRow.value = rowIdx + 1;
                                }
                              } else if (e.key === 'Escape') {
                                isEditing.value = false;
                              } else if (e.key === 'Tab') {
                                e.preventDefault();
                                await commitEdit$(
                                  rowIdx,
                                  colIdx,
                                  originalIndex,
                                );
                                const nextC = e.shiftKey
                                  ? colIdx - 1
                                  : colIdx + 1;
                                if (nextC >= 0 && nextC < colCount) {
                                  activeCellCol.value = nextC;
                                } else if (
                                  !e.shiftKey &&
                                  rowIdx + 1 < rowCount
                                ) {
                                  activeCellRow.value = rowIdx + 1;
                                  activeCellCol.value = 0;
                                } else if (e.shiftKey && rowIdx > 0) {
                                  activeCellRow.value = rowIdx - 1;
                                  activeCellCol.value = colCount - 1;
                                }
                              }
                            }}
                            onBlur$={async () => {
                              // Guard prevents double-commit when blur follows
                              // an Enter/Tab keydown that already committed.
                              await commitEdit$(rowIdx, colIdx, originalIndex);
                            }}
                          />
                        ) : (
                          <span class="block truncate px-2 py-1">
                            {displayVal}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
});
