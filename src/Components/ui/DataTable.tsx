"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnOrderState,
  type OnChangeFn,
  type Table as ReactTable,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function hasAccessorKey<TData, TValue>(
  col: ColumnDef<TData, TValue>,
): col is ColumnDef<TData, TValue> & { accessorKey: string } {
  return "accessorKey" in col;
}

const toCamelCase = (text: string) => {
  if (!text.trim()) return text;

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getStickyStyles = (
  sticky?: "left" | "right",
  offset = 0,
): React.CSSProperties => {
  if (!sticky) return {};

  return {
    position: "sticky",
    [sticky]: offset,
  };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  className?: string;
  isBorderless?: boolean;
  freezeClassName?: string;

  lastRow?: (table: ReactTable<TData>) => React.ReactNode;

  loading?: boolean;
  loadingRows?: number;

  currentPage?: number;
  pageSize?: number;
  showSL?: boolean;
  stickySL?: boolean;

  size?: "sm" | "md";

  onRowClick?: (row: TData) => void;

  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>;

  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>;

  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string;
  getRowClassName?: (row: TData, index: number) => string;
  emptyState?: {
    title?: React.ReactNode;
    description?: React.ReactNode;
  };
  affixHeader?: boolean | number;
  maxHeight?: string | number;
}

export function DataTable<TData, TValue>({
  columns,
  data,

  className,
  isBorderless = false,
  freezeClassName,

  lastRow,

  loading = false,
  loadingRows = 5,

  currentPage = 1,
  pageSize = 10,
  showSL = true,
  stickySL = false,

  size = "md",

  onRowClick,

  columnVisibility,
  onColumnVisibilityChange,

  columnOrder,
  onColumnOrderChange,

  sorting,
  onSortingChange,

  rowSelection,
  onRowSelectionChange,
  enableRowSelection,
  getRowId,
  getRowClassName,
  emptyState,

  affixHeader,
  maxHeight,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("Common");

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const affixedHeaderRef = useRef<HTMLDivElement>(null);

  const [affixState, setAffixState] = useState<{
    isAffixed: boolean;
    translateY: number;
    topOffset: number;
    rect: { left: number; width: number };
  }>({
    isAffixed: false,
    translateY: 0,
    topOffset: 64,
    rect: { left: 0, width: 0 },
  });

  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sortingState = sorting ?? internalSorting;
  const handleSortingChange = onSortingChange ?? setInternalSorting;

  const isSlSticky = Boolean(stickySL);

  const tableColumns = useMemo(() => {
    if (!showSL) return columns;

    const filteredColumns = columns.filter(
      (col) =>
        col.id !== "sl" && (!hasAccessorKey(col) || col.accessorKey !== "sl"),
    );

    const selectIdx = filteredColumns.findIndex(
      (col) =>
        col.id === "select" ||
        (hasAccessorKey(col) && col.accessorKey === "select"),
    );

    let slOffset = 0;
    if (selectIdx !== -1 && isSlSticky) {
      const selectCol = filteredColumns[selectIdx];
      const isSelectSticky = selectCol?.meta?.sticky === "left";
      if (isSelectSticky) {
        slOffset =
          (selectCol?.meta?.stickyOffset ?? 0) + (selectCol?.size ?? 48);
      }
    }

    const slColumn: ColumnDef<TData, TValue> = {
      id: "sl",
      header: () => t("sl") || "SL",
      size: 48,
      cell: ({ row }) => (
        <span className="block text-center text-gray-500 tabular-nums dark:text-slate-400">
          {(currentPage - 1) * pageSize + row.index + 1}
        </span>
      ),
      meta: {
        headerAlign: "center",
        ...(isSlSticky
          ? {
              sticky: "left",
              stickyOffset: slOffset,
            }
          : {}),
      },
    };

    if (selectIdx !== -1) {
      return [
        ...filteredColumns.slice(0, selectIdx + 1),
        slColumn,
        ...filteredColumns.slice(selectIdx + 1),
      ];
    }

    return [slColumn, ...filteredColumns];
  }, [columns, currentPage, isSlSticky, pageSize, showSL, t]);

  const table = useReactTable({
    data,
    columns: tableColumns,

    state: {
      sorting: sortingState,
      ...(columnVisibility && { columnVisibility }),
      ...(columnOrder && { columnOrder }),
      ...(rowSelection && { rowSelection }),
    },

    onSortingChange: handleSortingChange,
    onColumnVisibilityChange,
    onColumnOrderChange,
    onRowSelectionChange,
    enableRowSelection,
    getRowId,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const wrapperClass = cn(
    "@container w-full bg-white dark:bg-slate-900 datatable-scrollbar",
    maxHeight ? "overflow-auto" : "overflow-x-auto overflow-y-visible",
    freezeClassName,
    !isBorderless &&
      "rounded-lg border border-gray-100 dark:border-slate-800/40 shadow-sm",
    className,
  );

  useEffect(() => {
    if (!affixHeader) return;

    const topOffset = typeof affixHeader === "number" ? affixHeader : 56;

    const handleScrollOrResize = () => {
      const container = tableContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const headerHeight = headerRef.current?.offsetHeight ?? 40;
      const currentScrollLeft = container.scrollLeft;

      if (rect.top <= topOffset && rect.bottom > topOffset) {
        const translateY =
          rect.bottom < topOffset + headerHeight
            ? rect.bottom - (topOffset + headerHeight)
            : 0;

        setAffixState({
          isAffixed: true,
          translateY,
          topOffset,
          rect: { left: rect.left, width: rect.width },
        });

        if (
          affixedHeaderRef.current &&
          affixedHeaderRef.current.scrollLeft !== currentScrollLeft
        ) {
          affixedHeaderRef.current.scrollLeft = currentScrollLeft;
        }
      } else {
        setAffixState((prev) =>
          prev.isAffixed ? { ...prev, isAffixed: false } : prev,
        );
      }
    };

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScrollOrResize);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (tableContainerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        onScroll();
      });
      resizeObserver.observe(tableContainerRef.current);
    }

    handleScrollOrResize();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver?.disconnect();
    };
  }, [affixHeader]);

  // Synchronize scrollLeft as soon as affixed header mounts or activates
  useEffect(() => {
    if (
      affixState.isAffixed &&
      affixedHeaderRef.current &&
      tableContainerRef.current
    ) {
      affixedHeaderRef.current.scrollLeft =
        tableContainerRef.current.scrollLeft;
    }
  }, [affixState.isAffixed]);

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollLeft = e.currentTarget.scrollLeft;
    if (
      affixedHeaderRef.current &&
      affixedHeaderRef.current.scrollLeft !== currentScrollLeft
    ) {
      affixedHeaderRef.current.scrollLeft = currentScrollLeft;
    }
  };

  const handleAffixedHeaderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollLeft = e.currentTarget.scrollLeft;
    if (
      tableContainerRef.current &&
      tableContainerRef.current.scrollLeft !== currentScrollLeft
    ) {
      tableContainerRef.current.scrollLeft = currentScrollLeft;
    }
  };

  const renderHeaderCells = (isAffixedClone = false) =>
    table.getHeaderGroups().map((group) => (
      <TableRow key={isAffixedClone ? `affixed-${group.id}` : group.id}>
        {group.headers.map((header) => {
          const meta = header.column.columnDef.meta;

          const align = meta?.headerAlign ?? "left";
          const sticky = meta?.sticky;
          const stickyOffset = meta?.stickyOffset;

          return (
            <TableHead
              key={isAffixedClone ? `affixed-${header.id}` : header.id}
              style={{
                width: header.getSize(),
                minWidth: header.getSize(),
                maxWidth: header.getSize(),
                ...getStickyStyles(sticky, stickyOffset),
              }}
              className={cn(
                "bg-gray-50 font-bold text-gray-700 uppercase dark:bg-slate-800 dark:text-slate-400",
                "border-b border-gray-100 dark:border-slate-800/40",
                !isBorderless && "border-r dark:border-slate-800/40",
                sticky ? "z-40" : "z-30",
                sticky &&
                  isBorderless &&
                  "shadow-[1px_0_0_0_var(--color-gray-100)] dark:shadow-[1px_0_0_0_var(--color-slate-800)]",
                !isAffixedClone && "sticky top-0",
                align === "center"
                  ? "text-center"
                  : align === "right"
                    ? "text-right"
                    : "text-left",
              )}
            >
              {header.isPlaceholder
                ? null
                : (() => {
                    const content = flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    );
                    return typeof content === "string"
                      ? toCamelCase(content)
                      : content;
                  })()}
            </TableHead>
          );
        })}
      </TableRow>
    ));

  if (loading) {
    return (
      <div
        ref={tableContainerRef}
        style={maxHeight ? { maxHeight } : undefined}
        className={wrapperClass}
      >
        <Table
          size={size}
          style={{ minWidth: table.getTotalSize() }}
          className={cn(
            "border-separate border-spacing-0",
            !isBorderless &&
              "[&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0 [&_tr:last-child_td]:border-b-0",
          )}
        >
          <TableHeader ref={headerRef}>{renderHeaderCells(false)}</TableHeader>

          <TableBody>
            {Array.from({ length: loadingRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {table.getVisibleLeafColumns().map((column) => {
                  const meta = column.columnDef.meta;

                  return (
                    <TableCell
                      key={`${rowIndex}-${column.id}`}
                      style={{
                        width: column.getSize(),
                        minWidth: column.getSize(),
                        maxWidth: column.getSize(),
                        ...getStickyStyles(meta?.sticky, meta?.stickyOffset),
                      }}
                      className={cn(
                        "border-b border-gray-100 dark:border-slate-800/40",
                        !isBorderless && "border-r dark:border-slate-800/40",
                        meta?.sticky &&
                          isBorderless &&
                          "shadow-[1px_0_0_0_var(--color-gray-100)] dark:shadow-[1px_0_0_0_var(--color-slate-800)]",
                        meta?.sticky && "z-20 bg-inherit",
                      )}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      {affixHeader && affixState.isAffixed && (
        <div
          ref={affixedHeaderRef}
          onScroll={handleAffixedHeaderScroll}
          style={{
            position: "fixed",
            top: affixState.topOffset,
            left: affixState.rect.left,
            width: affixState.rect.width,
            transform: affixState.translateY
              ? `translateY(${affixState.translateY}px)`
              : undefined,
            zIndex: 45,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
          }}
          className={cn(
            "pointer-events-auto shadow-md transition-shadow [&::-webkit-scrollbar]:hidden",
            freezeClassName,
            !isBorderless &&
              "border-x border-t border-gray-100 dark:border-slate-800/40",
          )}
        >
          <Table
            size={size}
            style={{ minWidth: table.getTotalSize() }}
            className={cn(
              "border-separate border-spacing-0",
              !isBorderless &&
                "[&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0",
            )}
          >
            <TableHeader>{renderHeaderCells(true)}</TableHeader>
          </Table>
        </div>
      )}

      {/* Main Table Container */}
      <div
        ref={tableContainerRef}
        onScroll={handleContainerScroll}
        style={maxHeight ? { maxHeight } : undefined}
        className={wrapperClass}
      >
        <Table
          size={size}
          style={{ minWidth: table.getTotalSize() }}
          className={cn(
            "border-separate border-spacing-0",
            !isBorderless &&
              "[&_td:last-child]:border-r-0 [&_th:last-child]:border-r-0 [&_tr:last-child_td]:border-b-0",
          )}
        >
          <TableHeader ref={headerRef}>{renderHeaderCells(false)}</TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    "bg-white hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800",
                    getRowClassName?.(row.original, index),
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;

                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.getSize(),
                          maxWidth: cell.column.getSize(),
                          ...getStickyStyles(meta?.sticky, meta?.stickyOffset),
                        }}
                        className={cn(
                          "relative !text-wrap",
                          "border-b border-gray-100 dark:border-slate-800/40",
                          !isBorderless && "border-r dark:border-slate-800/40",
                          meta?.sticky &&
                            isBorderless &&
                            "shadow-[1px_0_0_0_var(--color-gray-100)] dark:shadow-[1px_0_0_0_var(--color-slate-800)]",
                          meta?.sticky && "z-20 bg-inherit",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="p-0 text-center"
                >
                  <div className="sticky left-0 flex min-h-75 w-[100cqw] max-w-full flex-col items-center justify-center space-y-1 py-10 !text-wrap text-gray-400 dark:text-slate-500">
                    <p className="font-semibold">
                      {emptyState?.title ?? "No data found"}
                    </p>
                    <p className="text-xs">
                      {emptyState?.description ??
                        "Try adjusting filters or adding new data"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {lastRow?.(table)}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
