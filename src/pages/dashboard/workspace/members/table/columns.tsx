/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import { format, parseISO } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { workspaceServices } from "@/services/workspace-services"
import queries from "@/queries"
import { cn } from "@/lib/utils"

interface IMember {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

const roleStyles = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  operator:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  member: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

const RoleCell = ({ value, memberId }: { value: string; memberId: string }) => {
  const { activeWorkspace } = useWorkspaceStore()
  const queryClient = useQueryClient()
  const isAdmin = activeWorkspace?.currentUserRole === "admin"
  const isOperator = activeWorkspace?.currentUserRole === "operator"
  const canEditRoles = isAdmin || isOperator

  const updateRoleMutation = useMutation({
    mutationFn: (newRole: string) =>
      workspaceServices.updateMemberRole({
        workspaceId: activeWorkspace?._id as string,
        memberId,
        role: newRole,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.workspaces.getWorkspaceMembers(
          activeWorkspace?._id as string
        ).queryKey,
      })
    },
  })

  const availableRoles = ["admin", "operator", "member", "viewer"]

  if (!canEditRoles) {
    return (
      <div
        className={cn(
          "px-2 py-1 rounded-full text-xs w-fit capitalize",
          roleStyles[value as keyof typeof roleStyles]
        )}
      >
        {value}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs w-fit capitalize cursor-pointer",
            roleStyles[value as keyof typeof roleStyles]
          )}
        >
          {value}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => updateRoleMutation.mutate(role)}
            className="capitalize"
          >
            {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<IMember>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableResizing: false,
    size: 250,
    cell: ({ getValue }: any) => (
      <div className="flex items-center gap-x-2">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${getValue()}`}
          />
        </Avatar>
        <div>{getValue()}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 300,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 150,
    cell: ({ getValue, row }: any) => (
      <RoleCell
        value={getValue()}
        memberId={row.original.id}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    size: 150,
    cell: ({ getValue }: any) => {
      const dateValue = getValue()
      try {
        const date = parseISO(dateValue)
        return <div>{format(date, "dd MMM yyyy")}</div>
      } catch (_error) {
        return <div>Invalid date</div>
      }
    },
  },
]
