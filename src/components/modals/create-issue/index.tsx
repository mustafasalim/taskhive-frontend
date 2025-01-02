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
import { useState, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { issueServices } from "@/services/issue-services"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { useWorkspaceStore } from "@/stores/workspace-slice"
import { workspaceServices } from "@/services/workspace-services"
import { IWorkspaceMember } from "@/services/workspace-services/type"
import { Image as ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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
      images: File[]
    }) =>
      issueServices.addIssueToStatus({
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        priority: data.priority,
        statusId: status._id,
        project: status.projectId,
        images: data.images,
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

      toast({
        title: "Issue created successfully",
        description: "The issue has been created with the uploaded images.",
      })

      handleClose()
    },
    onError: () => {
      toast({
        title: "Error creating issue",
        description: "There was an error creating the issue. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleClose = () => {
    setSelectedImages([])
    destroyAllModal()
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files])
    }
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
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
      images: selectedImages,
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Images
              </Button>
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Selected ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
