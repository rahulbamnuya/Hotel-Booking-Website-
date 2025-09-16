// utils/Notification.js
const path = require("path");
const dotenv = require("dotenv");
const twilio = require("twilio");

// Always point to the root-level .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Load from environment
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const defaultRecipientNumber = process.env.RECIPIENT_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Sends a booking confirmation SMS.
 */
async function sendBookingConfirmation(
  bookingDetails,
  recipientNumber = defaultRecipientNumber
) {
  const {
    guestName,
    hotelName,
    bookingId,
    checkInDate,
    checkOutDate,
    roomType,
    roomNumber,
    totalPrice,
    numAdults,
    numChildren,
    hotelAddress,
    hotelPhone,
    hotelWebsite,
  } = bookingDetails;

  // SMS body
  const textMessageBody = `
Dear ${guestName},

Your booking at ${hotelName} is confirmed!

Booking Ref: ${bookingId}
Check-in: ${checkInDate}
Check-out: ${checkOutDate}
Room Type: ${roomType}
Room No: ${roomNumber}
Total Price: ${totalPrice}
Guests: ${numAdults} Adult(s)${
    numChildren > 0 ? `, ${numChildren} Child(ren)` : ""
  }

Address: ${hotelAddress}
Contact: ${hotelPhone}
Website: ${hotelWebsite}

We look forward to welcoming you!
The ${hotelName} Team
`;

  try {
    const smsMessage = await client.messages.create({
      body: textMessageBody,
      from: twilioPhoneNumber,
      to: recipientNumber,
    });
    console.log("✅ SMS Confirmation Sent! SID:", smsMessage.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
  }
}

module.exports = {
  sendBookingConfirmation,
};
