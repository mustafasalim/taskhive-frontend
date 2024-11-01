/* eslint-disable @typescript-eslint/no-explicit-any */
import AvatarGroup from "@/components/ui/avatar-group"
import { ColumnDef } from "@tanstack/react-table"
import { EllipsisVertical, ShieldEllipsis, SquareUserRound } from "lucide-react"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "workspaceName",
    header: "Workspaces",
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2">
        <SquareUserRound className="w-5 h-5" />
        {getValue().toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2 text-green-500">
        <ShieldEllipsis className="w-5 h-5" />
        {getValue().toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ getValue }: any) => <AvatarGroup names={getValue()} />,
  },
  {
    accessorKey: "description",
    header: "Descriptions",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => <EllipsisVertical className="w-4 h-4 cursor-pointer " />,
  },
]
