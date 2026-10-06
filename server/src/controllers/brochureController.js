import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Brochure from '../models/Brochure.js';
import Segment from '../models/Segment.js';
import Media from '../models/Media.js';
import { generateFilename } from '../middleware/upload.js';
import { asyncHandler } from '../utils/sendEmail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GET /api/brochures
export const getBrochures = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.segment) {
    if (mongoose.Types.ObjectId.isValid(req.query.segment)) {
      filter.segment = req.query.segment;
    } else {
      const seg = await Segment.findOne({ slug: req.query.segment });
      if (seg) {
        filter.segment = seg._id;
      } else {
        return res.json([]);
      }
    }
  }
  const brochures = await Brochure.find(filter)
    .populate('segment', 'name slug image description')
    .sort({ createdAt: -1 });
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
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(path.join(localDir, filename), req.file.buffer);
  } catch (_) {
    // Read-only serverless environment safely ignores disk write
  }

  const brochure = await Brochure.create({
    title: req.body.title,
    description: req.body.description || '',
    segment: req.body.segment || undefined,
    file: `/api/uploads/${filename}`,
  });

  const populated = await Brochure.findById(brochure._id).populate('segment', 'name slug image description');
  res.status(201).json(populated);
});

// PUT /api/brochures/:id  (admin, optional multipart with `file`)
export const updateBrochure = asyncHandler(async (req, res) => {
  const brochure = await Brochure.findById(req.params.id);
  if (!brochure) {
    res.status(404);
    throw new Error('Brochure not found.');
  }

  if (req.body.title !== undefined) {
    brochure.title = req.body.title.trim();
  }
  if (req.body.description !== undefined) {
    brochure.description = req.body.description.trim();
  }
  if (req.body.segment !== undefined) {
    brochure.segment = req.body.segment ? req.body.segment : undefined;
  }

  // If a new PDF file is uploaded, replace existing file
  if (req.file) {
    const filename = generateFilename(req.file.originalname);

    await Media.create({
      filename,
      originalName: req.file.originalname,
      contentType: req.file.mimetype || 'application/pdf',
      data: req.file.buffer,
      size: req.file.size,
    });

    try {
      const localDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      fs.writeFileSync(path.join(localDir, filename), req.file.buffer);
    } catch (_) {
      // safe in serverless
    }

    brochure.file = `/api/uploads/${filename}`;
  }

  await brochure.save();

  const populated = await Brochure.findById(brochure._id).populate('segment', 'name slug image description');
  res.json(populated);
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
