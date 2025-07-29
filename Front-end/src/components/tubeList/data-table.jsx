import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  FolderSearch,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function DataTable({
  columns,
  data,
  onGlobalFilterChange,
  globalFilter,
  emptyState,
}) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);
 
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6 bg-transparent ">
      {/* Contrôles avec fond flouté */}
      <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-900/50 p-4 rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-700/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Gestion des Clients
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {table.getFilteredRowModel().rows.length} element trouvés
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Rechercher..."
              value={globalFilter ?? ""}
              onChange={(e) => onGlobalFilterChange(e.target.value)}
              className="max-w-sm bg-white/70 dark:bg-gray-800/70 w-screen border-gray-300/50"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Colonnes</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Afficher/Masquer</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        <div className="flex items-center gap-2">
                          {column.getIsVisible() ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                          {column.id}
                        </div>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Table avec effet verre */}
      <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-700/30 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow 
                key={headerGroup.id} 
                className="border-b border-gray-200/30 dark:border-gray-700/30 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {!header.isPlaceholder && flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-200/20 dark:border-gray-700/20 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-700/30"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-12">
                    <FolderSearch className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {emptyState || "Aucun resultat trouvé"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination améliorée */}
      <div className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 p-4 rounded-2xl shadow-sm border border-gray-200/30 dark:border-gray-700/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Affichage <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> à{' '}
            <span className="font-medium">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{' '}
            sur <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> résultats
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, table.getPageCount()) }).map((_, i) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageCount = table.getPageCount();
                let displayPage;
                
                if (pageCount <= 5) {
                  displayPage = i;
                } else if (pageIndex <= 2) {
                  displayPage = i;
                } else if (pageIndex >= pageCount - 3) {
                  displayPage = pageCount - 5 + i;
                } else {
                  displayPage = pageIndex - 2 + i;
                }
                
                return (
                  <Button
                    key={displayPage}
                    variant={pageIndex === displayPage ? "default" : "outline"}
                    className={`rounded-full w-10 h-10 p-0 ${pageIndex === displayPage ? 'bg-primary/90' : ''}`}
                    onClick={() => table.setPageIndex(displayPage)}
                  >
                    {displayPage + 1}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full w-10 h-10 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="h-10 w-[150px] bg-white/70 dark:bg-gray-800/70 border-gray-300/50">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize} par page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}