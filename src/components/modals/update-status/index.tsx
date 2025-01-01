import BottomGradient from "@/components/bottom-gradient"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { statusServices } from "@/services/status-services"
import { Status } from "@/services/status-services/type"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

interface UpdateStatusModalProps {
  data: {
    status: Status
    open: boolean
  }
}

interface UpdateStatusParams {
  statusId: string
  data: {
    name: string
  }
}

const UpdateStatusModal = ({ data }: UpdateStatusModalProps) => {
  const updateStatusMutation = useMutation<Status, Error, UpdateStatusParams>({
    mutationFn: ({ statusId, data }) =>
      statusServices.updateStatus(statusId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["statuses"],
        exact: false,
      })
      destroyAllModal()
    },
  })

  const deleteStatusMutation = useMutation({
    mutationFn: (statusId: string) => statusServices.deleteStatus(statusId),
    onSuccess: () => {
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
      name: data.status.name,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateStatusMutation.mutate({
      statusId: data.status._id,
      data: values,
    })
  }

  function onDelete() {
    deleteStatusMutation.mutate(data.status._id)
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      destroyAllModal()
    }
  }

  return (
    <Dialog
      onOpenChange={onOpenChange}
      open={data.open}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Update Status
          </DialogTitle>
          <DialogDescription>
            Change the name of your status column. The order can be changed by
            dragging the status.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Status Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="e.g. To Do, In Progress, Done"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="flex gap-x-2 justify-between items-center pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  disabled={deleteStatusMutation.isPending}
                  className="hover:bg-red-600/90 w-1/2"
                >
                  {deleteStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Status
                    </>
                  )}
                </Button>

                <Button
                  disabled={updateStatusMutation.isPending}
                  variant="animated"
                  type="submit"
                  className="px-6 "
                >
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    "Update Status"
                  )}
                  <BottomGradient />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateStatusModal
