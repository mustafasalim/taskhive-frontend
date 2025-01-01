import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Status } from "@/services/status-services/type"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { issueServices } from "@/services/issue-services"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { workspaceServices } from "@/services/workspace-services"
import { IWorkspaceMember } from "@/services/workspace-services/type"

interface CreateIssueModalProps {
  data: {
    status: Status
    open: boolean
  }
}

const CreateIssueModal = ({
  data: { status, open },
}: CreateIssueModalProps) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignedTo, setAssignedTo] = useState<string>("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low")
  const queryClient = useQueryClient()
  const { activeWorkspace } = useWorkspaceStore()

  const { data: members = [] } = useQuery<IWorkspaceMember[]>({
    queryKey: ["workspace-members", activeWorkspace?._id],
    queryFn: () =>
      workspaceServices.getWorkspaceMembers(activeWorkspace?._id || ""),
    enabled: !!activeWorkspace?._id,
  })

  const { mutate: createIssue, isPending } = useMutation({
    mutationFn: (data: {
      title: string
      description: string
      assignedTo: string[]
      priority: "low" | "medium" | "high"
    }) =>
      issueServices.addIssueToStatus({
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        priority: data.priority,
        statusId: status._id,
        project: status.projectId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["issues", status._id]],
        exact: true,
        refetchType: "all",
      })

      queryClient.invalidateQueries({
        queryKey: ["issues"],
        exact: false,
      })

      handleClose()
    },
  })

  const handleClose = () => {
    destroyAllModal()
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) {
      return
    }

    createIssue({
      title,
      description,
      assignedTo: assignedTo ? [assignedTo] : [],
      priority,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Issue in {status.name}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter issue title"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter issue description"
              rows={4}
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium"
            >
              Priority
            </label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setPriority(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="assignedTo"
              className="text-sm font-medium"
            >
              Assign To
            </label>
            <Select
              value={assignedTo}
              onValueChange={setAssignedTo}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateIssueModal
