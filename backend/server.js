const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: "http://localhost:3000" })); // Allow only specific origin
app.use(express.json());
app.use(morgan("dev")); // Request logging

// Validate Environment Variables
if (!process.env.MONGO_URI || !process.env.PORT) {
  console.error("❌ Missing required environment variables. Check .env file.");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// Import Routes
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

// WebSocket Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("🔥 A user connected:", socket.id);

  // Listen for new document events
  socket.on("new_document", (data) => {
    io.emit("document_added", data); // Broadcast to all clients
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("🛑 Shutting down server...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.");
    server.close(() => {
      console.log("🛑 Server stopped.");
      process.exit(0);
    });
  });
});