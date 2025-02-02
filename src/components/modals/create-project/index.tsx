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
import { Loader2, Smile } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  name: z.string().max(16).min(3),
  description: z.string().max(20).min(4),
})

const CreateProjectModal = ({ data }: any) => {
  const { activeWorkspace } = useWorkspaceStore()

  const createProjectMutation = useMutation({
    mutationFn: projectServices.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.projects.getProjects(activeWorkspace?._id as string)
          .queryKey,
      })
      toast({
        title: "Project created",
        description: "The project has been created successfully.",
      })
      destroyAllModal()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createProjectMutation.mutate({
      ...values,
      workspaceId: data,
      members: activeWorkspace?.members,
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
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Project name</FormLabel>
                      <Smile className="h-4 w-4 text-zinc-600 dark:text-white/70 cursor-pointer" />
                    </div>
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
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={createProjectMutation.isPending}
                  variant="animated"
                  type="submit"
                >
                  {createProjectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Send"
                  )}
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

export default CreateProjectModal
