const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve frontend build from client/build
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1, "../client/build")));
// ✅ API Routes
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// ✅ Health check (important for Render)
app.get("/health", (req, res) => res.status(200).send("OK"));

// ✅ Catch-all route for React (keep AFTER API routes)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "../client/build", "index.html"));
});

// ✅ MongoDB + Server setup
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { dbName: "mydatabase" })
  .then(() => app.listen(PORT, () => console.log(`✅ Dream Nest Server running on port ${PORT}`)))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
