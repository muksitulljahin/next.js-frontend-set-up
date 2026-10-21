"use client";

import type {
  LegacyColumnDef as ColumnDef,
  LegacyRow as Row,
} from "@tanstack/react-table/legacy";
import type {
  OnChangeFn,
  RowSelectionState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "../ui/DataTable";

interface ExtendedColumnDef {
  id?: string;
  accessorKey?: string;
  size?: number;
  meta?: {
    sticky?: "left" | "right";
    stickyOffset?: number;
    headerAlign?: "left" | "center" | "right";
    [key: string]: unknown;
  };
}

interface ScrollableDataTableProps<
  TData extends object = Record<string, unknown>,
  TValue = unknown,
> {
  columns: ColumnDef<TData, TValue>[];
  stickyColumns?: string[];

  data: TData[];

  className?: string;
  isBorderless?: boolean;
  freezeClassName?: string;

  loading?: boolean;
  loadingRows?: number;

  currentPage?: number;
  pageSize?: number;

  showSL?: boolean;
  stickySL?: boolean;

  size?: "sm" | "md";

  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData, index: number) => string;

  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (updater: unknown) => void;

  columnOrder?: string[];
  onColumnOrderChange?: (updater: unknown) => void;

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  affixHeader?: boolean | number;
  maxHeight?: string | number;
  lastRow?: (table: unknown) => React.ReactNode;
}

export function ScrollableDataTable<
  TData extends object = Record<string, unknown>,
  TValue = unknown,
>({
  columns,
  stickyColumns = [],
  showSL = true,
  stickySL = false,
  affixHeader,
  maxHeight,

  ...props
}: ScrollableDataTableProps<TData, TValue>) {
  const isSlSticky = Boolean(stickySL);

  const enhancedColumns = useMemo(() => {
    const stickySet = new Set(stickyColumns);

    const selectIdx = columns.findIndex((col) => {
      const c = col as unknown as ExtendedColumnDef;
      return c.id === "select" || c.accessorKey === "select";
    });

    // 1. First pass: compute left sticky offsets
    let leftOffset = 0;
    const leftStickyComputed: ColumnDef<TData, TValue>[] = [];
    for (let index = 0; index < columns.length; index++) {
      const column = columns[index];
      const colExt = column as unknown as ExtendedColumnDef;

      if (isSlSticky && showSL) {
        if (selectIdx === -1 && index === 0 && leftOffset === 0) {
          leftOffset = 48;
        } else if (
          selectIdx !== -1 &&
          index === selectIdx + 1 &&
          leftOffset === 0
        ) {
          leftOffset = 48;
        }
      }

      const colId = colExt.id ?? colExt.accessorKey ?? "";
      const isStickyLeft =
        stickySet.has(colId) || colExt.meta?.sticky === "left";

      if (isStickyLeft) {
        const currentOffset = leftOffset;
        const colSize = colExt.size ?? 100;
        leftOffset += colSize;

        // If this is the select column and SL is sticky & shown, add SL size for subsequent columns
        if (isSlSticky && showSL && selectIdx !== -1 && index === selectIdx) {
          leftOffset += 48;
        }

        leftStickyComputed.push({
          ...column,
          size: colSize,
          meta: {
            ...colExt.meta,
            sticky: "left" as const,
            stickyOffset: currentOffset,
          },
        } as ColumnDef<TData, TValue>);
      } else {
        leftStickyComputed.push(column);
      }
    }

    // 2. Second pass: compute right sticky offsets (from right to left)
    let rightOffset = 0;
    const finalColumns = [...leftStickyComputed];
    for (let i = finalColumns.length - 1; i >= 0; i--) {
      const column = finalColumns[i];
      const colExt = column as unknown as ExtendedColumnDef;

      if (colExt.meta?.sticky === "right") {
        const currentOffset = rightOffset;
        const colSize = colExt.size ?? 100;
        rightOffset += colSize;
        finalColumns[i] = {
          ...column,
          size: colSize,
          meta: {
            ...colExt.meta,
            sticky: "right" as const,
            stickyOffset: currentOffset,
          },
        } as ColumnDef<TData, TValue>;
      }
    }

    return finalColumns;
  }, [columns, stickyColumns, isSlSticky, showSL]);

  return (
    <DataTable
      {...props}
      showSL={showSL}
      stickySL={isSlSticky}
      columns={enhancedColumns}
      affixHeader={affixHeader}
      maxHeight={maxHeight}
    />
  );
}
