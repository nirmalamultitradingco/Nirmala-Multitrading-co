import mongoose from 'mongoose';
import SubSegment from '../models/SubSegment.js';
import Segment from '../models/Segment.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/subsegments?segment=<segment-slug-or-id>&all=true
export const getSubSegments = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };

  if (req.query.segment) {
    const isId = mongoose.Types.ObjectId.isValid(req.query.segment);
    const segQuery = isId
      ? { $or: [{ _id: req.query.segment }, { slug: req.query.segment }] }
      : { slug: req.query.segment };
    const segment = await Segment.findOne(segQuery).select('_id');
    query.segment = segment ? segment._id : null;
  }

  const subsegments = await SubSegment.find(query)
    .populate('segment', 'name slug')
    .sort({ order: 1, name: 1 });

  res.json(subsegments);
});

// GET /api/subsegments/:slug
export const getSubSegmentBySlug = asyncHandler(async (req, res) => {
  const subsegment = await SubSegment.findOne({ slug: req.params.slug })
    .populate('segment', 'name slug');

  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  res.json(subsegment);
});

// POST /api/subsegments (admin)
export const createSubSegment = asyncHandler(async (req, res) => {
  const { segment } = req.body;
  if (!segment) {
    res.status(400);
    throw new Error('Parent segment is required.');
  }

  const isId = mongoose.Types.ObjectId.isValid(segment);
  const parent = await Segment.findOne(
    isId ? { $or: [{ _id: segment }, { slug: segment }] } : { slug: segment }
  );
  if (!parent) {
    res.status(400);
    throw new Error('Parent segment not found.');
  }

  const subsegment = await SubSegment.create({
    ...req.body,
    segment: parent._id,
  });
  await subsegment.populate('segment', 'name slug');
  res.status(201).json(subsegment);
});

// PUT /api/subsegments/:id (admin)
export const updateSubSegment = asyncHandler(async (req, res) => {
  const subsegment = await SubSegment.findById(req.params.id);
  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  const updateData = { ...req.body };
  if (req.body.segment) {
    const isId = mongoose.Types.ObjectId.isValid(req.body.segment);
    const parent = await Segment.findOne(
      isId ? { $or: [{ _id: req.body.segment }, { slug: req.body.segment }] } : { slug: req.body.segment }
    );
    if (!parent) {
      res.status(400);
      throw new Error('Parent segment not found.');
    }
    updateData.segment = parent._id;
  }

  Object.assign(subsegment, updateData);
  await subsegment.save();
  await subsegment.populate('segment', 'name slug');
  res.json(subsegment);
});

// DELETE /api/subsegments/:id (admin)
export const deleteSubSegment = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ subSegment: req.params.id });
  if (inUse > 0) {
    res.status(409);
    throw new Error(`Cannot delete: ${inUse} product(s) still use this sub-segment.`);
  }

  const subsegment = await SubSegment.findByIdAndDelete(req.params.id);
  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  res.json({ message: 'Sub-segment deleted.' });
});
