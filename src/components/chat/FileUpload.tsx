// src/components/chat/FileUpload.tsx
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { FileRejection } from 'react-dropzone'
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setErrors([])
    
    // Handle rejected files
    const newErrors: string[] = []
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        if (error.code === 'file-too-large') {
          newErrors.push(`${file.name} is too large (max ${formatFileSize(maxSize)})`)
        } else if (error.code === 'file-invalid-type') {
          newErrors.push(`${file.name} is not a supported file type`)
        }
      })
    })
    
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }
    
    setSelectedFiles(prev => [...prev, ...acceptedFiles].slice(0, maxFiles))
  }, [maxFiles, maxSize])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize,
    maxFiles
  })
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
      setSelectedFiles([])
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }
  
  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} files, {formatFileSize(maxSize)} each
        </p>
      </div>
      
      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setSelectedFiles([])}
            >
              Clear All
            </Button>
            <Button onClick={handleUpload}>
              Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}