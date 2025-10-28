// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv").config();
// const cors = require("cors");

// const authRoutes = require("./routes/auth.js");
// const listingRoutes = require("./routes/listing.js");
// const bookingRoutes = require("./routes/booking.js");
// const userRoutes = require("./routes/user.js");
// const verifyToken = require("./middleware/authMiddleware.js"); // ✅ add middleware

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// /* ROUTES */
// app.use("/auth", authRoutes); // 👈 public (register/login)

// // ✅ protect everything else 
// app.use("/properties", listingRoutes);
// app.use("/bookings",  bookingRoutes);
// app.use("/users",  userRoutes);

// /* MONGOOSE SETUP */
// const PORT = process.env.PORT || 3001;

// mongoose
//   .connect(process.env.MONGO_URL, { dbName: "mydatabase" })
//   .then(() => {
//     app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB connection error:", err.message));const express = require("express");
// ✅ Step 1: IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

// ✅ Step 2: ROUTES
const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");
const verifyToken = require("./middleware/authMiddleware.js");

// ✅ Step 3: INITIALIZE EXPRESS
const app = express();

// ✅ Step 4: MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ Step 5: HEALTH CHECK (for Render)
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Step 6: BASE ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Dream Nest Server is live and healthy!");
});

// ✅ Step 7: ROUTES
app.use("/auth", authRoutes);
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

// ✅ Step 8: SERVE REACT BUILD
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// ✅ Step 9: DATABASE + SERVER START
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { dbName: "mydatabase" })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
