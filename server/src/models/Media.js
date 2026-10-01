import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalName: {
      type: String,
      default: '',
    },
    contentType: {
      type: String,
      required: true,
      default: 'application/octet-stream',
    },
    data: {
      type: Buffer,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Media', mediaSchema);
