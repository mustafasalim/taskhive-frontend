import {
  Table,
  TableBody,
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
import { IProject } from "@/services/project-services/type"
import { useEffect, useState } from "react"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation } from "@tanstack/react-query"
import { projectServices } from "@/services/project-services"

const ProjectsTable = () => {
  const [projectData, setProjectData] = useState<IProject[]>([])
  const { activeWorkspace } = useWorkspaceStore()

  const getProjectByWorkspaceMutation = useMutation({
    mutationFn: projectServices.getProjectsByWorkspace,
    onSuccess: (data) => {
      setProjectData(data)
    },
  })

  useEffect(() => {
    if (activeWorkspace) {
      getProjectByWorkspaceMutation.mutate(activeWorkspace?._id as string)
    }
  }, [])

  const table = useReactTable({
    columns,
    data: projectData,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table className="text-xs text-black dark:text-zinc-200">
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
            {getProjectByWorkspaceMutation.isPending && (
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
