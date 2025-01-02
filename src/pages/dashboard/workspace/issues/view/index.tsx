import { useState, useRef } from "react"
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
  Video,
  Image as ImageIcon,
  Trash2,
} from "lucide-react"
import MediaRoom from "@/components/media-room"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { commentServices } from "@/services/comment-services"
import { issueServices } from "@/services/issue-services"
import { Issue, UpdateIssueDto } from "@/services/issue-services/type"
import PageHeader from "@/components/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const priorityColors: Record<string, string> = {
  low: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  medium: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  high: "text-red-500 bg-red-50 dark:bg-red-900/20",
}

const ViewIssuePage = () => {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState("")
  const [isVideoChat, setIsVideoChat] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    issue?.priority ?? "low"
  )

  const { mutate: updateIssue, isPending } = useMutation({
    mutationFn: (data: UpdateIssueDto) =>
      issueServices.updateIssue(issueId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue", issueId],
      })
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
    setEditTitle(issue?.title ?? "")
    setEditDescription(issue?.description ?? "")
    setEditPriority(issue?.priority ?? "low")
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditTitle(issue?.title ?? "")
    setEditDescription(issue?.description ?? "")
    setEditPriority(issue?.priority ?? "low")
    setIsEditing(false)
  }

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return
    const updateData: UpdateIssueDto = {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
    }
    updateIssue(updateData)
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

  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) =>
      issueServices.updateIssueImages(issueId!, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      toast({
        title: "Images uploaded successfully",
        description: "The images have been added to the issue.",
      })
    },
    onError: () => {
      toast({
        title: "Error uploading images",
        description:
          "There was an error uploading the images. Please try again.",
        variant: "destructive",
      })
    },
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageUrl: string) =>
      issueServices.deleteIssueImage(issueId!, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", issueId] })
      queryClient.invalidateQueries({ queryKey: ["issues"] })
      toast({
        title: "Image deleted successfully",
        description: "The image has been removed from the issue.",
      })
    },
    onError: () => {
      toast({
        title: "Error deleting image",
        description: "There was an error deleting the image. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleDeleteImage = (imageUrl: string) => {
    deleteImageMutation.mutate(imageUrl)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      uploadImagesMutation.mutate(files)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const { mutate: deleteIssueMutation } = useMutation({
    mutationFn: () => issueServices.deleteIssue(issueId!),
    onSuccess: () => {
      toast({
        title: "Issue deleted",
        description: "The issue has been deleted successfully.",
      })
      navigate("/dashboard/workspace/issues")
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the issue. Please try again.",
        variant: "destructive",
      })
    },
  })

  const handleDeleteIssue = () => {
    deleteIssueMutation()
    window.location.reload()
  }

  if (isVideoChat && issue) {
    return (
      <div className="flex h-full flex-col ">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            onClick={() => setIsVideoChat(false)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Issue
          </Button>
        </div>
        <div className=" flex justify-center items-center h-full w-full">
          <MediaRoom
            chatId={issueId!}
            video={false}
            audio={false}
          />
        </div>
      </div>
    )
  }

  if (isLoading || !issue) return <div>Loading...</div>

  return (
    <div>
      <PageHeader
        title="Issue Details"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsVideoChat(true)}
            >
              <Video className="mr-2 h-4 w-4" />
              Join Video Chat
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteIssue}
            >
              <Trash2 className=" h-4 w-4" />
            </Button>
          </div>
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
                      <Select
                        value={editPriority}
                        onValueChange={(value: "low" | "medium" | "high") =>
                          setEditPriority(value)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">
                            Medium Priority
                          </SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <h1 className="text-2xl font-bold">{issue.title}</h1>
                        <div className="text-md font-semibold  whitespace-pre-wrap mt-5">
                          {issue.description || "No description provided"}
                        </div>
                        <div className="mt-2 flex w-full items-center justify-end">
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleImageClick}
                            disabled={uploadImagesMutation.isPending}
                            className="h-8 w-8"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Add image gallery in description */}
                        {issue?.images && issue.images.length > 0 && (
                          <div className="mt-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {issue.images.map((imageUrl, index) => (
                                <div
                                  key={index}
                                  className="relative group"
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Issue image ${index + 1}`}
                                    className="rounded-lg object-cover w-full aspect-video"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2">
                                    <a
                                      href={imageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-50 rounded-full p-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className="sr-only">View</span>
                                      <ImageIcon className="h-4 w-4" />
                                    </a>
                                    <button
                                      onClick={() =>
                                        handleDeleteImage(imageUrl)
                                      }
                                      className="text-white opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-2"
                                      disabled={deleteImageMutation.isPending}
                                    >
                                      <span className="sr-only">Delete</span>
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                  {!isEditing && (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm px-3 py-1 rounded-full shrink-0 w-fit",
                        priorityColors[issue.priority || "low"]
                      )}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="capitalize whitespace-nowrap font-medium">
                        {issue.priority
                          ? `${issue.priority} Priority`
                          : "Low Priority"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
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

      {/* Remove image gallery from bottom */}
      {/* {issue?.images && issue.images.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {issue.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Issue image ${index + 1}`}
                className="rounded-lg object-cover w-full aspect-video"
              />
            ))}
          </div>
        </div>
      )} */}
    </div>
  )
}

export default ViewIssuePage
