import multer from 'multer';
import path from 'path';

export const generateFilename = (originalname) => {
  const ext = path.extname(originalname || '');
  const base = path
    .basename(originalname || 'file', ext)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  return `${base}-${Date.now()}${ext}`;
};

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.pdf', '.mp4', '.webm', '.mov', '.m4v', '.mkv'];
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only images, PDFs, and video files are allowed.'));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit for direct MongoDB/serverless uploads
});
