import React, { useRef } from "react"
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
import { Image as ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface EditIssueModalProps {
  data: {
    issue: Issue
    open: boolean
  }
}

const EditIssueModal = ({ data: { issue, open } }: EditIssueModalProps) => {
  const [title, setTitle] = useState(issue.title)
  const [description, setDescription] = useState(issue.description || "")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const { mutate: uploadImages, isPending: isUploading } = useMutation({
    mutationFn: (images: File[]) =>
      issueServices.updateIssueImages(issue._id, images),
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

      setSelectedImages([])
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

  const handleUploadImages = () => {
    if (selectedImages.length > 0) {
      uploadImages(selectedImages)
    }
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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Select Images
                </Button>
                {selectedImages.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Selected Images"}
                  </Button>
                )}
              </div>
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
              {issue.images && issue.images.length > 0 && (
                <>
                  <div className="text-sm font-medium">Current Images</div>
                  <div className="grid grid-cols-2 gap-2">
                    {issue.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative"
                      >
                        <img
                          src={imageUrl}
                          alt={`Issue image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </>
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditIssueModal
