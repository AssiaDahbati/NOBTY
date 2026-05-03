require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
const server = http.createServer(app);

// Connect DB
connectDB();

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    if (!userId) return;
    onlineUsers.set(String(userId), socket.id);
    console.log(`User ${userId} registered on socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);

    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Make io accessible in routes/controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Security middleware
app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts, please try again later." },
});

// General middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Apply rate limiting
app.use(globalLimiter);
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/businesses", require("./routes/businessRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Upload / multer error handler
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message: err.message || "Upload error",
    });
  }
  next();
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});