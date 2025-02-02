import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { columns } from "./columns"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useQuery } from "@tanstack/react-query"

import queries from "@/queries"
import { useEffect } from "react"

const ProjectsTable = () => {
  const { activeWorkspace } = useWorkspaceStore()

  const { data, isLoading, refetch } = useQuery({
    ...queries.projects.getProjects(activeWorkspace?._id as string),
    enabled: !!activeWorkspace?._id,
  })

  const table = useReactTable({
    columns,
    data: data || [],
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    refetch()
  }, [activeWorkspace, refetch])

  return (
    <Table className="text-xs text-black dark:text-zinc-200">
      {data?.length <= 0 && <TableCaption>No projects found.</TableCaption>}
      <TableHeader>
        <TableRow>
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <TableHead
                style={{
                  width: header.getSize(),
                }}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <>
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <div className="cursor-pointer">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </TableCell>
              ))}
            </TableRow>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </>
        ))}
      </TableBody>
    </Table>
  )
}

export default ProjectsTable
