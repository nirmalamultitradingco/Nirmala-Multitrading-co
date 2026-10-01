import app from '../server/server.js';

// Vercel entry point. Express receives the original /api/... path and handles
// routing itself, so every API endpoint shares the same database middleware.
export default app;
