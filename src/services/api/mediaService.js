const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mediaService = {
  async uploadFiles(files) {
    await delay(500);
    
    return files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      originalFile: file
    }));
  },

  async cropImage(imageElement, crop, fileData) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        const scaleX = imageElement.naturalWidth / imageElement.width;
        const scaleY = imageElement.naturalHeight / imageElement.height;
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          imageElement,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            
            const croppedUrl = URL.createObjectURL(blob);
            resolve(croppedUrl);
          },
          fileData.type || 'image/jpeg',
          0.9
        );
      } catch (error) {
        reject(error);
      }
    });
  },

  async validateFile(file) {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    const ACCEPTED_TYPES = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/mov'
    ];

    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds 50MB limit');
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('File type not supported');
    }

    return true;
  },

  async processVideo(file) {
    await delay(300);
    
    // Create a video element to extract thumbnail
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.preload = 'metadata';
    
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.currentTime = 0;
        
        video.onseeked = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx.drawImage(video, 0, 0);
          
          const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          resolve({
            id: Date.now(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            thumbnailUrl,
            originalFile: file
          });
        };
      };
    });
  },

  async deleteFile(fileId) {
    await delay(200);
    return true;
  }
};