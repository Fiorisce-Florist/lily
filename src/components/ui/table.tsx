import * as React from "react"

import { cn } from "@/lib/utils"

// ---------- Table ----------

export type TableProps = React.ComponentPropsWithoutRef<"table">

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-b5 font-inter", className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = "Table"

// ---------- TableHeader ----------

export type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b [&_tr]:border-cornsilk-300", className)}
      {...props}
    />
  ),
)
TableHeader.displayName = "TableHeader"

// ---------- TableBody ----------

export type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  ),
)
TableBody.displayName = "TableBody"

// ---------- TableFooter ----------

export type TableFooterProps = React.ComponentPropsWithoutRef<"tfoot">

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-cornsilk-300 bg-cornsilk-200/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  ),
)
TableFooter.displayName = "TableFooter"

// ---------- TableRow ----------

export type TableRowProps = React.ComponentPropsWithoutRef<"tr">

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-cornsilk-300 transition-colors hover:bg-cornsilk-200/50 data-[state=selected]:bg-cornsilk-200",
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = "TableRow"

// ---------- TableHead ----------

export type TableHeadProps = React.ComponentPropsWithoutRef<"th">

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-inter font-medium text-neutral-600 [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
)
TableHead.displayName = "TableHead"

// ---------- TableCell ----------

export type TableCellProps = React.ComponentPropsWithoutRef<"td">

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
)
TableCell.displayName = "TableCell"

// ---------- TableCaption ----------

export type TableCaptionProps = React.ComponentPropsWithoutRef<"caption">

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-b5 font-inter text-neutral-500",
        className,
      )}
      {...props}
    />
  ),
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
