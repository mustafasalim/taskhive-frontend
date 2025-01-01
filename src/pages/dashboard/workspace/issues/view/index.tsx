import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import {
  AlertCircle,
  Calendar,
  Clock,
  MessageSquare,
  Send,
  Users,
  Edit2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { commentServices } from "@/services/comment-services"
import { issueServices } from "@/services/issue-services"
import { Issue } from "@/services/issue-services/type"
import PageHeader from "@/components/page-header"

const priorityColors: Record<string, string> = {
  low: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  medium: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  high: "text-red-500 bg-red-50 dark:bg-red-900/20",
}

const ViewIssuePage = () => {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState("")
  const queryClient = useQueryClient()

  const { data: issue, isLoading } = useQuery<Issue>({
    queryKey: ["issue", issueId],
    queryFn: () => issueServices.getIssueById(issueId!),
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(issue?.title ?? "")
  const [editDescription, setEditDescription] = useState(
    issue?.description ?? ""
  )

  const { mutate: updateIssue, isPending } = useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      issueServices.updateIssue(issueId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["issues", issue?.status]],
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
    setEditTitle(issue?.title ?? "")
    setEditDescription(issue?.description ?? "")
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
    queryKey: ["comments", issueId],
    queryFn: () => commentServices.getCommentsByIssue(issueId!),
  })

  const { mutate: createComment } = useMutation({
    mutationFn: (content: string) =>
      commentServices.createComment(issueId!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", issueId] })
      setNewComment("")
    },
  })

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    createComment(newComment)
  }

  if (isLoading || !issue) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full flex flex-col h-full">
      <PageHeader
        title="View Issue"
        action={
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="flex-1 max-w-4xl mx-auto w-full py-8 px-4">
        <div className="space-y-6">
          <div className="space-y-4">
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
                        <h1 className="text-2xl font-semibold">
                          {issue.title}
                        </h1>
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
                    "flex items-center gap-1 text-sm px-3 py-1 rounded-full shrink-0 ml-4",
                    priorityColors[issue.priority]
                  )}
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="capitalize whitespace-nowrap font-medium">
                    {issue.priority} Priority
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
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-purple-500" />
              </span>
              Assigned To
            </h3>
            <div className="pl-2">
              {issue.assignedTo && issue.assignedTo.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {issue.assignedTo.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-sidebar rounded-md px-3 py-1.5"
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
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        if (newComment.trim()) {
                          handleSubmitComment(e)
                        }
                      }
                    }}
                    placeholder="Write a comment..."
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      type="submit"
                      disabled={!newComment.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewIssuePage
