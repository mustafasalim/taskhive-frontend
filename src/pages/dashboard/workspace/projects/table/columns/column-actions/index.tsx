/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Form, FormField } from "@/components/ui/form"
import { queryClient } from "@/providers/react-query-provider"
import queries from "@/queries"
import { projectServices } from "@/services/project-services"
import { IProject } from "@/services/project-services/type"
import { createModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Edit2, EllipsisVertical, Trash2, UserCog } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface ColumnActionsProps {
  row: IProject
}

const formSchema = z.object({
  members: z.array(z.string()).optional(),
})

const ColumnActions = (props: ColumnActionsProps) => {
  const { row } = props
  const { activeWorkspace } = useWorkspaceStore()

  const { data: membersData = [] } = useQuery({
    ...queries.workspaces.getWorkspaceMembers(activeWorkspace?._id as string),
    enabled: !!activeWorkspace?._id,
  })

  const defaultMembersValue = row.members.map((member: any) => member.id)
  const membersOptions =
    membersData?.map((member: any) => ({
      value: member.id,
      label: member.email,
    })) || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: defaultMembersValue,
    },
  })

  console.log(membersOptions)
  console.log(activeWorkspace)

  const addMembersToProjectMutation = useMutation({
    mutationFn: projectServices.addMembersToProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
    },
  })

  const deleteProjectMutation = useMutation({
    mutationFn: projectServices.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
    },
  })

  function handleDeleteProject() {
    deleteProjectMutation.mutate(row.id)
  }

  function handleMembersChange(newValue: any) {
    addMembersToProjectMutation.mutate({
      members: newValue as [],
      projectId: row.id,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            createModal({
              name: "edit-project",
              data: row,
            })
          }
        >
          <div className="flex items-center gap-x-2 ">
            <Edit2 className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
            Edit
          </div>
        </DropdownMenuItem>

        {(activeWorkspace?.currentUserRole === "admin" ||
          activeWorkspace?.currentUserRole === "operator") && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className="flex items-center gap-x-2 ">
                <UserCog className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
                Assign Members
              </div>
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuLabel>Members</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Form {...form}>
                  <form className="grid ">
                    <FormField
                      control={form.control}
                      name="members"
                      render={({ field }: any) => (
                        <>
                          <div className="flex flex-col space-y-2 px-4 py-2">
                            {membersOptions.map((member: any) => (
                              <div
                                key={member.value}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  disabled={
                                    activeWorkspace.owner?._id === member.value
                                  }
                                  checked={field.value.includes(member.value)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, member.value]
                                      : field.value.filter(
                                          (val: any) => val !== member.value
                                        )
                                    field.onChange(newValue)
                                    handleMembersChange(newValue)
                                  }}
                                />
                                <div className="flex items-center gap-x-2 ">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage
                                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${member.label}`}
                                    />
                                  </Avatar>
                                  {member.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    />
                  </form>
                </Form>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}

        {activeWorkspace?.currentUserRole === "admin" ||
        activeWorkspace?.currentUserRole === "operator" ? (
          <DropdownMenuItem onClick={handleDeleteProject}>
            <div className="flex items-center gap-x-2 ">
              <Trash2 className="w-3 h-3 text-zinc-700 dark:text-zinc-300" />
              Delete
            </div>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ColumnActions
