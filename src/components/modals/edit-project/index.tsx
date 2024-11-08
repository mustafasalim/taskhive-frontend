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
import { queryClient } from "@/providers/react-query-provider"
import queries from "@/queries"

import { projectServices } from "@/services/project-services"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

const EditProjectModal = ({ data }: any) => {
  const { activeWorkspace } = useWorkspaceStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data?.name,
      description: data?.description,
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: projectServices.updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
      destroyAllModal()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateProjectMutation.mutate({
      id: data.id,
      title: values.title,
      description: values.description,
    })
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
