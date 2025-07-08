import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { mediaService } from '@/services/api/mediaService';
import { cn } from '@/utils/cn';
import 'react-image-crop/dist/ReactCrop.css';

const MediaUploadModal = ({ onClose, onUpload, existingFiles = [] }) => {
  const [files, setFiles] = useState(existingFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [cropIndex, setCropIndex] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  const MAX_FILES = 4;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov'];

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 50MB');
      return false;
    }

    const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
    const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      toast.error('Please select an image (JPG, PNG, GIF, WebP) or video (MP4, WebM, MOV) file');
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback(async (selectedFiles) => {
    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files`);
      return;
    }

    const validFiles = Array.from(selectedFiles).filter(validateFile);
    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = await mediaService.uploadFiles(validFiles);
      setFiles(prev => [...prev, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  }, [files.length]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCropStart = (index) => {
    const file = files[index];
    if (!file.type.startsWith('image/')) {
      toast.error('Only images can be cropped');
      return;
    }
    setCropIndex(index);
  };

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(newCrop);
  }, []);

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current || cropIndex === null) return;

    try {
      const croppedImageUrl = await mediaService.cropImage(
        imgRef.current,
        completedCrop,
        files[cropIndex]
      );
      
      setFiles(prev => prev.map((file, index) => 
        index === cropIndex 
          ? { ...file, url: croppedImageUrl }
          : file
      ));
      
      setCropIndex(null);
      setCrop(undefined);
      setCompletedCrop(undefined);
      toast.success('Image cropped successfully');
    } catch (error) {
      console.error('Crop error:', error);
      toast.error('Failed to crop image');
    }
  }, [completedCrop, cropIndex, files]);

  const handleSubmit = () => {
    onUpload(files);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upload Media</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Upload Area */}
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                dragActive ? 'border-primary bg-primary bg-opacity-5' : 'border-gray-300',
                isUploading && 'opacity-50 pointer-events-none'
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Upload" size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {isUploading ? 'Uploading...' : 'Drop files here or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Support for images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV)
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum {MAX_FILES} files, up to 50MB each
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Upload" size={16} />
                      Select Files
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* File Preview Grid */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Selected Files ({files.length}/{MAX_FILES})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {files.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <ApperIcon name="Play" size={32} className="text-white" />
                          </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex gap-2">
                            {file.type.startsWith('image/') && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCropStart(index)}
                                className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                              >
                                <ApperIcon name="Crop" size={16} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                              className="bg-white bg-opacity-20 text-white hover:bg-opacity-30"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* File Info */}
                      <div className="mt-1 text-xs text-gray-500 truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {files.length} of {MAX_FILES} files selected
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={files.length === 0}
              >
                Add to Post
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Crop Modal */}
        {cropIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4"
            onClick={() => setCropIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
                <Button variant="ghost" size="sm" onClick={() => setCropIndex(null)}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <div className="p-4 flex items-center justify-center" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                <ReactCrop
                  crop={crop}
                  onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                >
                  <img
                    ref={imgRef}
                    src={files[cropIndex]?.url}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-w-full max-h-full object-contain"
                  />
                </ReactCrop>
              </div>
              
              <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200">
                <Button variant="ghost" onClick={() => setCropIndex(null)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleCropComplete}>
                  Apply Crop
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaUploadModal;