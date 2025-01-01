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
import { statusServices } from "@/services/status-services"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  order: z.number().optional(),
})

const CreateStatusModal = ({ data }: any) => {
  const createStatusMutation = useMutation({
    mutationFn: statusServices.createStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.statuses.getStatuses(data).queryKey,
        exact: true,
        refetchType: "all",
      })

      queryClient.invalidateQueries({
        queryKey: ["statuses"],
        exact: false,
      })

      destroyAllModal()
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      order: 1,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createStatusMutation.mutate({
      ...values,
      projectId: data,
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
          <DialogTitle>Create Status</DialogTitle>
          <DialogDescription>
            Add a new status to organize your project tasks
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. To Do, In Progress, Done"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  disabled={createStatusMutation.isPending}
                  variant="animated"
                  type="submit"
                >
                  {createStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Create Status"
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

export default CreateStatusModal
