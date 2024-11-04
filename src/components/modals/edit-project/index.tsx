/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomGradient from "@/components/bottom-gradient"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/ui/multi-select"
import queries from "@/queries"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
})

const EditProjectModal = ({ data }: any) => {
  const { activeWorkspace } = useWorkspaceStore()

  const { data: membersData = [] } = useQuery({
    ...queries.workspaces.getWorkspaceMembers(activeWorkspace?._id as string),
    enabled: !!activeWorkspace?._id,
  })

  const defaultMembersValue = data.members.map((member: any) => member.id)
  const membersOptions =
    membersData?.map((member: any) => ({
      value: member.id,
      label: member.name,
    })) || []

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.name,
      description: data?.description,
      members: defaultMembersValue,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      destroyAllModal()
    }
  }

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={true}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details and assign members as needed.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={membersOptions}
                        defaultValue={field.value}
                        placeholder="Select members"
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="animated"
                  type="submit"
                >
                  Save Changes
                  <BottomGradient />
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProjectModal
