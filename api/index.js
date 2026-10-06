import app from '../server/server.js';

// Vercel serverless function entry point
export default function handler(req, res) {
  return app(req, res);
}
