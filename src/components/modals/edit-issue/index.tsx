import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { issueServices } from "@/services/issue-services"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import { Issue } from "@/services/issue-services/type"

interface EditIssueModalProps {
  data: {
    issue: Issue
    open: boolean
  }
}

const EditIssueModal = ({ data: { issue, open } }: EditIssueModalProps) => {
  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(issue.description || "")
  const queryClient = useQueryClient()

  const { mutate: updateIssue, isPending } = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      issueServices.updateIssue(issue._id, {
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["issues", issue.status]],
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

    updateIssue({
      title,
      description,
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Issue</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Enter issue title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="Enter issue description"
              className="h-32"
            />
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditIssueModal
