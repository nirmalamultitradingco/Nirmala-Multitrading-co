import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Brochure from '../models/Brochure.js';
import Media from '../models/Media.js';
import { generateFilename } from '../middleware/upload.js';
import { asyncHandler } from '../utils/sendEmail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GET /api/brochures
export const getBrochures = asyncHandler(async (req, res) => {
  const brochures = await Brochure.find().populate('segment', 'name slug').sort({ createdAt: -1 });
  res.json(brochures);
});

// POST /api/brochures  (admin, multipart with `file`)
export const createBrochure = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please attach a PDF file.');
  }

  const filename = generateFilename(req.file.originalname);

  // 1. Save PDF file to MongoDB Atlas
  await Media.create({
    filename,
    originalName: req.file.originalname,
    contentType: req.file.mimetype || 'application/pdf',
    data: req.file.buffer,
    size: req.file.size,
  });

  // 2. Also optionally save locally if writable
  try {
    const localDir = path.join(__dirname, '../../uploads');
    if (fs.existsSync(localDir)) {
      fs.writeFileSync(path.join(localDir, filename), req.file.buffer);
    }
  } catch (_) {
    // Read-only serverless environment safely ignores disk write
  }

  const brochure = await Brochure.create({
    title: req.body.title,
    description: req.body.description || '',
    segment: req.body.segment || undefined,
    file: `/uploads/${filename}`,
  });

  res.status(201).json(brochure);
});

// DELETE /api/brochures/:id  (admin)
export const deleteBrochure = asyncHandler(async (req, res) => {
  const brochure = await Brochure.findByIdAndDelete(req.params.id);
  if (!brochure) {
    res.status(404);
    throw new Error('Brochure not found.');
  }
  res.json({ message: 'Brochure deleted.' });
});
