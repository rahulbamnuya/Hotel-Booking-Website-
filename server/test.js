// index.js
const { sendBookingConfirmation } = require("./utils/Notification.js");

async function main() {
  const bookingDetails = {
    guestName: "Alice Smith",
    hotelName: "The Lakeside Inn",
    bookingId: "LSI987654321",
    checkInDate: "November 15, 2023",
    checkOutDate: "November 18, 2023",
    roomType: "Lake View Suite",
    roomNumber: "501",
    totalPrice: "$450.00",
    numAdults: 2,
    numChildren: 1,
    hotelAddress: "456 Lakefront Ave, Watertown, USA",
    hotelPhone: "+1-555-987-6543",
    hotelWebsite: "www.lakesideinn.com",
  };

  const customRecipientNumber = "+919340475725"; // override default

  console.log("Attempting to send booking confirmation...");
  await sendBookingConfirmation(bookingDetails, customRecipientNumber);
  console.log("Confirmation process completed.");
}

main();
