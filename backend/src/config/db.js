import dns from "node:dns";
import mongoose from "mongoose";

// Fix for Windows / ISP SRV DNS lookup issues with MongoDB Atlas (querySrv ECONNREFUSED)
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers:", e.message);
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing. Copy .env.example to .env and set it.");
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
