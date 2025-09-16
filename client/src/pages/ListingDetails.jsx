import { useEffect, useState } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams } from "react-router-dom";
import { facilities } from "../data";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";

const ListingDetails = () => {
  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  /* Payment Modal */
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/properties/${listingId}`,
          { method: "GET" }
        );
        const data = await response.json();
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.log("Fetch Listing Details Failed", err.message);
      }
    };
    fetchListing();
  }, [listingId]);

  /* BOOKING CALENDAR */
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);

  // ✅ Ensure at least 1 night is counted
  const dayCount = Math.max(
    1,
    Math.round((end - start) / (1000 * 60 * 60 * 24))
  );

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (dayCount < 1) {
      alert("You must book at least 1 night.");
      return;
    }

    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
        paymentStatus: "Paid", // ✅ mark as Paid after fake payment
      };

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        navigate(`/${customerId}/trips`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      <div className="listing-details">
        {/* Title & Photos */}
        <div className="title">
          <h1>{listing.title}</h1>
        </div>
        <div className="photos">
          {listing.listingPhotoPaths?.map((item, idx) => (
            <img key={idx} src={`${item.replace("public", "")}`} alt="listing" />
          ))}
        </div>

        {/* Info */}
        <h2>
          {listing.type} in {listing.city}, {listing.province},{" "}
          {listing.country}
        </h2>
        <p>
          {listing.guestCount} guests - {listing.bedroomCount} bedroom(s) -{" "}
          {listing.bedCount} bed(s) - {listing.bathroomCount} bathroom(s)
        </p>
        <hr />

        {/* Host */}
        <div className="profile">
          <img
            src={`${listing.creator.profileImagePath.replace("public", "")}`}
            alt={`${listing.creator.firstName} ${listing.creator.lastName}`}
          />
          <h3>
            Hosted by {listing.creator.firstName} {listing.creator.lastName}
          </h3>
        </div>

        <hr />

        {/* Details */}
        <h3>Description</h3>
        <p>{listing.description}</p>
        <hr />

        <h3>{listing.highlight}</h3>
        <p>{listing.highlightDesc}</p>
        <hr />

        {/* Booking */}
        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {facilities.find((facility) => facility.name === item)?.icon}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />
              <h2>
                ${listing.price} x {dayCount}{" "}
                {dayCount > 1 ? "nights" : "night"}
              </h2>
              <h2>Total price: ${listing.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                className="button"
                type="button"
                onClick={handleSubmit}
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-modal">
          <div className="payment-box">
            <h2>Payment</h2>
            <p>Total: ${listing.price * dayCount}</p>
            <input type="text" placeholder="Card Number" />
            <input type="text" placeholder="MM/YY" />
            <input type="text" placeholder="CVV" />
            <button className="button" onClick={handleSubmit}>
              Confirm Payment
            </button>
            <button
              className="button cancel"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ListingDetails;
