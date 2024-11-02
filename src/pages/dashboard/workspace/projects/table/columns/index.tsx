/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import AvatarGroup from "@/components/ui/avatar-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IProject } from "@/services/project-services/type"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { EllipsisVertical, SquareUserRound } from "lucide-react"

export const columns: ColumnDef<IProject>[] = [
  {
    accessorKey: "name",
    header: "Title",
    enableResizing: false, //disable resizing for just this column
    size: 650,
  },
  {
    accessorKey: "description",
    header: "Descriptions",
    size: 200,
  },
  {
    accessorKey: "ownerName",
    header: "Owner",
    size: 100,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2 ">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${getValue()}`}
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem key={getValue()}>
              <div className="flex items-center gap-x-2 ">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${getValue()}`}
                  />
                </Avatar>
                {getValue()}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
  {
    accessorKey: "workspaceName",
    header: "Workspaces",
    size: 150,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2 ">
        <SquareUserRound className="w-5 h-5" />
        {getValue().toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 100,
    cell: ({ getValue }: any) => <div>{format(getValue(), "dd MMM")}</div>,
  },
  {
    accessorKey: "members",
    header: "Members",
    size: 50,
    cell: ({ getValue }: any) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <AvatarGroup names={getValue()} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Members</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {getValue().map((member: string) => (
            <DropdownMenuItem key={member}>
              <div className="flex items-center gap-x-2 ">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${member}`}
                  />
                </Avatar>
                {member}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: () => <EllipsisVertical className="w-4 h-4 cursor-pointer " />,
  },
]
