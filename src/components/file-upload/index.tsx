import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  accept?: Record<string, string[]>
  maxSize?: number
  multiple?: boolean
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  maxSize = 5242880, // 5MB default
  multiple = false,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileSelect(acceptedFiles)
    },
    [onFileSelect]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here..."
          : "Drag & drop files here, or click to select files"}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
      </p>
    </div>
  )
}
