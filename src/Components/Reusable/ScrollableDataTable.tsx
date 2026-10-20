"use client";

import type {
  ColumnDef,
  OnChangeFn,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "./DataTable";

interface ScrollableDataTableProps<TData, TValue> {
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
  onColumnVisibilityChange?: (updater: any) => void;

  columnOrder?: string[];
  onColumnOrderChange?: (updater: any) => void;

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  affixHeader?: boolean | number;
  maxHeight?: string | number;
  lastRow?: (table: any) => React.ReactNode;
}

export function ScrollableDataTable<TData, TValue>({
  columns,
  stickyColumns = [],
  showSL = true,
  stickySL = false,
  affixHeader,
  maxHeight,

  ...props
}: ScrollableDataTableProps<TData, TValue>) {
  const isSlSticky = Boolean(stickySL || stickyColumns.includes("sl"));

  const enhancedColumns = useMemo(() => {
    const stickySet = new Set(stickyColumns);

    const selectIdx = columns.findIndex(
      (col) => col.id === "select" || (col as any).accessorKey === "select",
    );

    // 1. First pass: compute left sticky offsets
    let leftOffset = 0;
    const leftStickyComputed = columns.map((column, index) => {
      // Account for SL column width (48px) if SL is sticky & shown
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

      const colId = column.id ?? (column as any).accessorKey ?? "";
      const isStickyLeft =
        stickySet.has(colId) || column.meta?.sticky === "left";

      if (isStickyLeft) {
        const currentOffset = leftOffset;
        const colSize = column.size ?? 100;
        leftOffset += colSize;

        // If this is the select column and SL is sticky & shown, add SL size for subsequent columns
        if (isSlSticky && showSL && selectIdx !== -1 && index === selectIdx) {
          leftOffset += 48;
        }

        return {
          ...column,
          size: colSize,
          meta: {
            ...column.meta,
            sticky: "left" as const,
            stickyOffset: currentOffset,
          },
        };
      }
      return column;
    });

    // 2. Second pass: compute right sticky offsets (from right to left)
    let rightOffset = 0;
    const finalColumns = [...leftStickyComputed];
    for (let i = finalColumns.length - 1; i >= 0; i--) {
      const column = finalColumns[i];
      if (column.meta?.sticky === "right") {
        const currentOffset = rightOffset;
        const colSize = column.size ?? 100;
        rightOffset += colSize;
        finalColumns[i] = {
          ...column,
          size: colSize,
          meta: {
            ...column.meta,
            sticky: "right" as const,
            stickyOffset: currentOffset,
          },
        };
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
