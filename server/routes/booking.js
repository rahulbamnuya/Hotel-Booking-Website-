const router = require("express").Router();
const Booking = require("../models/Booking");
const { sendBookingConfirmation } = require("../utils/Notification.js"); // 👈 import notification service

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const {
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
      paymentStatus, // ✅ new
    } = req.body;

    const newBooking = new Booking({
      customerId,
      hostId,
      listingId,
      startDate,
      endDate,
      totalPrice,
      paymentStatus: paymentStatus || "Pending", // default if not sent
    });

    await newBooking.save();

    // --- Generate random demo details for SMS ---
    const randomGuestNames = ["Alice", "Rahul", "Maria", "John", "Sofia"];
    const randomHotels = ["The Lakeside Inn", "Sunset Resort", "Grand Palace"];
    const randomRooms = ["101", "202", "303", "404", "505"];

    const bookingDetails = {
      guestName:
        randomGuestNames[Math.floor(Math.random() * randomGuestNames.length)],
      hotelName: randomHotels[Math.floor(Math.random() * randomHotels.length)],
      bookingId: newBooking._id.toString(),
      checkInDate: startDate,
      checkOutDate: endDate,
      roomType: "Deluxe Suite",
      roomNumber: randomRooms[Math.floor(Math.random() * randomRooms.length)],
      totalPrice,
      numAdults: Math.floor(Math.random() * 3) + 1, // 1–3 adults
      numChildren: Math.floor(Math.random() * 2), // 0–1 child
      hotelAddress: "123 Main Street, City Center",
      hotelPhone: "+1-555-123-4567",
      hotelWebsite: "www.examplehotel.com",
    };

    // --- Trigger SMS notification (async, no block) ---
    sendBookingConfirmation(bookingDetails).catch((err) =>
      console.error("❌ SMS send error:", err.message)
    );

    res.status(200).json(newBooking);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Fail to create a new Booking!", error: err.message });
  }
});

module.exports = router;
