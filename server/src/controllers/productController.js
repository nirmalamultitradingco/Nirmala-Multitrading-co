import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Segment from '../models/Segment.js';
import Partner from '../models/Partner.js';
import SubSegment from '../models/SubSegment.js';
import { asyncHandler } from '../utils/sendEmail.js';
import { notifySubscribers } from './subscriberController.js';

// GET /api/products?segment=slugOrId&subSegment=slugOrId&partner=slugOrId&featured=true&search=&page=1&limit=12&sort=latest
export const getProducts = asyncHandler(async (req, res) => {
  const { segment, subSegment, partner, featured, search, admin, sort, newArrival } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 12);

  const filter = {};
  if (admin !== 'true') filter.isActive = true;
  if (featured === 'true') filter.featured = true;

  // Dynamic Segment filter (works with either slug or MongoDB ObjectId)
  if (segment) {
    const isId = mongoose.Types.ObjectId.isValid(segment);
    const segQuery = isId
      ? { $or: [{ _id: segment }, { slug: segment }] }
      : { slug: segment };
    const seg = await Segment.findOne(segQuery);
    filter.segment = seg ? seg._id : null;
  }

  // Dynamic SubSegment filter
  if (subSegment) {
    const isId = mongoose.Types.ObjectId.isValid(subSegment);
    const subQuery = isId
      ? { $or: [{ _id: subSegment }, { slug: subSegment }] }
      : { slug: subSegment };
    const sub = await SubSegment.findOne(subQuery);
    filter.subSegment = sub ? sub._id : null;
  }

  // Dynamic Partner filter
  if (partner) {
    const isId = mongoose.Types.ObjectId.isValid(partner);
    const pQuery = isId
      ? { $or: [{ _id: partner }, { slug: partner }] }
      : { slug: partner };
    const p = await Partner.findOne(pQuery);
    filter.partner = p ? p._id : null;
  }

  // Dynamic Search (supports name, shortDescription, description, origin, and HSN / HS code)
  if (search) {
    const rawSearch = search.trim();
    // Strip common prefixes like 'HSN', 'HS', 'HS-Code', etc.
    const cleanHs = rawSearch.replace(/^(hsn|hs|code)[\s:\-_]*/i, '').trim();
    const alphanumeric = cleanHs.replace(/[^a-zA-Z0-9]/g, '');

    const searchConditions = [
      { name: { $regex: rawSearch, $options: 'i' } },
      { shortDescription: { $regex: rawSearch, $options: 'i' } },
      { description: { $regex: rawSearch, $options: 'i' } },
      { origin: { $regex: rawSearch, $options: 'i' } },
      { hsCode: { $regex: rawSearch, $options: 'i' } },
    ];

    if (cleanHs && cleanHs !== rawSearch) {
      searchConditions.push({ hsCode: { $regex: cleanHs, $options: 'i' } });
      searchConditions.push({ name: { $regex: cleanHs, $options: 'i' } });
    }

    // Flexible regex for HSN code without formatting (e.g. searching '090411' matches '0904.11')
    if (alphanumeric && alphanumeric.length >= 2) {
      const flexiblePattern = alphanumeric.split('').join('[.\\s\\-_]?');
      searchConditions.push({ hsCode: { $regex: flexiblePattern, $options: 'i' } });
    }

    filter.$or = searchConditions;
  }

  // Dynamic Sort
  let sortOption = { featured: -1, createdAt: -1 };
  if (sort === 'name') sortOption = { name: 1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'latest' || newArrival === 'true') sortOption = { createdAt: -1 };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('segment', 'name slug')
    .populate('subSegment', 'name slug image description')
    .populate('partner', 'name slug logo country website')
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ products, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/products/:slug (supports both slug AND MongoDB _id dynamically)
export const getProductBySlug = asyncHandler(async (req, res) => {
  const param = req.params.slug;
  const isId = mongoose.Types.ObjectId.isValid(param);
  const query = isId
    ? { $or: [{ _id: param }, { slug: param }] }
    : { slug: param };

  const product = await Product.findOne(query)
    .populate('segment', 'name slug')
    .populate('subSegment', 'name slug image description')
    .populate('partner', 'name slug logo country website');

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const relatedFilter = {
    _id: { $ne: product._id },
    isActive: true,
  };

  if (product.subSegment?._id) {
    relatedFilter.subSegment = product.subSegment._id;
  } else {
    relatedFilter.segment = product.segment?._id;
  }

  const related = await Product.find(relatedFilter)
    .limit(4)
    .select('name slug image shortDescription origin');

  res.json({ product, related });
});

// POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };
  if (!productData.subSegment) delete productData.subSegment;
  if (!productData.partner) delete productData.partner;

  const product = await Product.create(productData);
  await product.populate([
    { path: 'segment', select: 'name slug' },
    { path: 'subSegment', select: 'name slug' },
    { path: 'partner', select: 'name slug logo' },
  ]);

  // Notify subscribers in background
  notifySubscribers({
    type: 'product',
    title: product.name,
    slug: product.slug,
    excerpt: product.shortDescription || `New export commodity: ${product.name}`,
  }).catch((err) => console.error('Subscriber alert error on product creation:', err));

  res.status(201).json(product);
});

// PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const updateData = { ...req.body };
  if (!updateData.subSegment) updateData.subSegment = null;
  if (!updateData.partner) updateData.partner = null;

  Object.assign(product, updateData);
  await product.save();
  await product.populate([
    { path: 'segment', select: 'name slug' },
    { path: 'subSegment', select: 'name slug' },
    { path: 'partner', select: 'name slug logo' },
  ]);
  res.json(product);
});

// DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  const subSegmentId = product.subSegment;
  await product.deleteOne();

  let subSegmentDeleted = false;

  // Remove an empty sub-segment automatically after its last product is deleted.
  if (subSegmentId) {
    const remainingProducts = await Product.countDocuments({
      subSegment: subSegmentId,
    });

    if (remainingProducts === 0) {
      const deletedSubSegment = await SubSegment.findByIdAndDelete(subSegmentId);
      subSegmentDeleted = Boolean(deletedSubSegment);
    }
  }

  res.json({
    message: 'Product deleted.',
    subSegmentDeleted,
  });
});
