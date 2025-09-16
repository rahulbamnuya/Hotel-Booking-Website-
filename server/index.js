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
//   .catch((err) => console.error("❌ MongoDB connection error:", err.message));
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.js");
const listingRoutes = require("./routes/listing.js");
const bookingRoutes = require("./routes/booking.js");
const userRoutes = require("./routes/user.js");
const verifyToken = require("./middleware/authMiddleware.js"); // ✅ add middleware

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ROUTES */
app.use("/auth", authRoutes); // 👈 public (register/login)

// ✅ protect everything else
app.use("/properties", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use("/users", userRoutes);

/* ---------- SERVE REACT BUILD ---------- */
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

/* -------------------------------------- */

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URL, { dbName: "mydatabase" })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
