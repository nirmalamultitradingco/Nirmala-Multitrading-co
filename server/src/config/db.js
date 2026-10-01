import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js DNS resolution issues on Windows for MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in environments where setServers is restricted
}

// Reuse the same MongoDB connection across local hot reloads and Vercel
// serverless invocations. Never create a new connection for every request.
const globalState = globalThis.__NMC_MONGOOSE__ || {
  conn: null,
  promise: null,
};
globalThis.__NMC_MONGOOSE__ = globalState;

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGO_URI is missing. Add your MongoDB Atlas connection string to the server environment variables.'
    );
  }

  if (globalState.conn && mongoose.connection.readyState === 1) {
    return globalState.conn;
  }

  if (!globalState.promise) {
    globalState.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        minPoolSize: 0,
      })
      .then((connection) => {
        console.log(
          `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`
        );
        return connection;
      })
      .catch((error) => {
        globalState.promise = null;
        console.error('MongoDB connection failed:', error.message);
        throw error;
      });
  }

  globalState.conn = await globalState.promise;
  return globalState.conn;
};
