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

import { SquareUserRound } from "lucide-react"
import ColumnActions from "./column-actions"

export const columns: ColumnDef<IProject>[] = [
  {
    accessorKey: "name",
    header: "Title",
    enableResizing: false,
    size: 650,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2">
        <img
          className="rounded-md"
          width={30}
          height={30}
          src={`https://api.dicebear.com/9.x/identicon/svg?seed=${getValue()}`}
          alt=""
        />
        <div>{getValue()}</div>
      </div>
    ),
  },
  {
    accessorKey: "workspaceName",
    header: "Workspaces",
    size: 150,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2 ">
        <SquareUserRound className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
        {getValue().slice(0, 3).toUpperCase()}
      </div>
    ),
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
          <AvatarGroup names={getValue().map((member: any) => member.name)} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Members</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {getValue().map((member: any) => {
            return (
              <DropdownMenuItem key={member.id}>
                <div className="flex items-center gap-x-2 ">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${member.name}`}
                    />
                  </Avatar>
                  {member.name}
                </div>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    size: 50,
    cell: ({ row }) => {
      console.log(row)

      return <ColumnActions row={row.original} />
    },
  },
]
