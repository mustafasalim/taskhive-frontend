import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Issue } from "@/services/issue-services/type"
import { format } from "date-fns"
import { destroyAllModal } from "@/stores/store-actions/modal-action"
import {
  Calendar,
  Clock,
  MessageSquare,
  Send,
  Users,
  Edit2,
  Check,
  X,
  Flag,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commentServices } from "@/services/comment-services"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { issueServices } from "@/services/issue-services"

interface ViewIssueModalProps {
  data: {
    issue: Issue
    open: boolean
  }
}

const priorityConfig = {
  low: {
    color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    icon: <Flag className="h-4 w-4" />,
    label: "Low Priority",
  },
  medium: {
    color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    icon: <Flag className="h-4 w-4 fill-current" />,
    label: "Medium Priority",
  },
  high: {
    color: "text-red-500 bg-red-50 dark:bg-red-900/20",
    icon: <Flag className="h-4 w-4 fill-current" />,
    label: "High Priority",
  },
}

const ViewIssueModal = ({ data: { issue, open } }: ViewIssueModalProps) => {
  const [newComment, setNewComment] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(issue.title)
  const [editDescription, setEditDescription] = useState(
    issue.description || ""
  )
  const queryClient = useQueryClient()

  const handleClose = () => {
    destroyAllModal()
  }

  const { mutate: updateIssue, isPending } = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      issueServices.updateIssue(issue._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["issues", issue.status]],
        exact: false,
      })

      queryClient.invalidateQueries({
        queryKey: ["issues"],
        exact: false,
      })

      setIsEditing(false)
    },
  })

  const handleStartEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditTitle(issue.title)
    setEditDescription(issue.description || "")
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return
    updateIssue({
      title: editTitle,
      description: editDescription,
    })
  }

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", issue._id],
    queryFn: () => commentServices.getCommentsByIssue(issue._id),
  })

  const { mutate: createComment } = useMutation({
    mutationFn: (content: string) =>
      commentServices.createComment(issue._id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issue._id] })
      setNewComment("")
    },
  })

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    createComment(newComment)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-start gap-2">
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Enter issue title"
                      className="text-xl font-semibold"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter issue description"
                      className="min-h-[100px] text-sm text-muted-foreground"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <DialogTitle className="text-xl">
                        {issue.title}
                      </DialogTitle>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap mt-1.5">
                        {issue.description || "No description provided"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleStartEdit}
                      className="h-8 w-8 shrink-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            {!isEditing && issue.priority && (
              <div
                className={cn(
                  "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full shrink-0 ml-4",
                  priorityConfig[issue.priority].color
                )}
              >
                {priorityConfig[issue.priority].icon}
                <span className="capitalize whitespace-nowrap font-medium">
                  {priorityConfig[issue.priority].label}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Created {format(new Date(issue.createdAt), "PPP")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Updated {format(new Date(issue.updatedAt), "PPP")}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-purple-500" />
              </span>
              Assigned To
            </h3>
            <div className="pl-7">
              {issue.assignedTo && issue.assignedTo.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {issue.assignedTo.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-full px-3 py-1.5"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                        />
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Not assigned to anyone
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Flag className="h-3 w-3 text-orange-500" />
              </span>
              Priority
            </h3>
            <div className="pl-7">
              {issue.priority ? (
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full",
                    priorityConfig[issue.priority].color
                  )}
                >
                  {priorityConfig[issue.priority].icon}
                  <span className="capitalize whitespace-nowrap font-medium">
                    {priorityConfig[issue.priority].label}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No priority set</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-3 w-3 text-blue-500" />
              </span>
              Due Date
            </h3>
            <p className="text-sm text-muted-foreground pl-7">
              {issue.dueDate
                ? format(new Date(issue.dueDate), "PPP")
                : "No due date set"}
            </p>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-green-500" />
              </span>
              Comments
            </h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.author.name}`}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), "PPP")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}

              <form
                onSubmit={handleSubmitComment}
                className="flex gap-2 items-start pt-2"
              >
                <div className="flex-1 relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <Button
                    size="sm"
                    type="submit"
                    className="absolute bottom-2 right-2"
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewIssueModal
