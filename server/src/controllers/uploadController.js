import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Media from '../models/Media.js';
import { generateFilename } from '../middleware/upload.js';
import { asyncHandler } from '../utils/sendEmail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST /api/upload  (admin) — saves uploaded file to MongoDB and returns accessible URL
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file received.');
  }

  const filename = generateFilename(req.file.originalname);

  // 1. Save permanently to MongoDB Atlas
  await Media.create({
    filename,
    originalName: req.file.originalname,
    contentType: req.file.mimetype || 'application/octet-stream',
    data: req.file.buffer,
    size: req.file.size,
  });

  // 2. Also mirror to local disk folder for fast local development serving
  try {
    const localDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(path.join(localDir, filename), req.file.buffer);
  } catch (err) {
    // Read-only serverless environment (Vercel) safely ignores disk write, log for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Local disk mirror skipped:', err.message);
    }
  }

  res.status(201).json({ url: `/api/uploads/${filename}` });
});
