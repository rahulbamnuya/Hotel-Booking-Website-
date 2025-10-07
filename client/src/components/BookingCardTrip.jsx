import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";
import { QRCodeCanvas } from "qrcode.react"; // ✅ QR code import
import { apiFetch } from "../api";

const BookingCardTrip = ({
  listingId,
  creator,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  paymentStatus,
}) => {
  /* SLIDER FOR IMAGES */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // ✅ modal state

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
    );
  };

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
  };

  const dispatch = useDispatch();

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      const response = await apiFetch(
        `/users/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setWishList(data.wishList));
    }
  };

  return (
    <>
      {/* --- CARD --- */}
      <div
        className="listing-card"
        onClick={() => setIsOpen(true)} // ✅ open modal
      >
        {/* --- IMAGE SLIDER --- */}
        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths?.map((photo, index) => (
              <div key={index} className="slide">
                <img
                  src={`${photo?.replace("public", "")}`}
                  alt={`photoe ${index + 1}`}
                />
                <div
                  className="prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide();
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className="next-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide();
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- INFO SECTION --- */}
        <h3>
          {city}, {province}, {country}
        </h3>
        <p>{category}</p>

        {!booking ? (
          <>
            <p>{type}</p>
            <p>
              <span>${price}</span> per night
            </p>
          </>
        ) : (
          <>
            <p>
              {startDate} - {endDate}
            </p>
            <p>
              <span>${totalPrice}</span> total
            </p>
            <p>
              Payment:{" "}
              <span
                className={`payment-status ${
                  paymentStatus?.toLowerCase() === "paid" ? "paid" : "pending"
                }`}
              >
                {paymentStatus || "Pending"}
              </span>
            </p>
          </>
        )}

        {/* --- FAVORITE BUTTON --- */}
        <button
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
        >
          {isLiked ? (
            <Favorite sx={{ color: "red" }} />
          ) : (
            <Favorite sx={{ color: "white" }} />
          )}
        </button>
      </div>

      {/* --- MODAL --- */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing on inner click
          >
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              ✖
            </button>

            <h2>Trip Details</h2>
            <p>
              <b>Location:</b> {city}, {province}, {country}
            </p>
            <p>
              <b>Category:</b> {category}
            </p>
            <p>
              <b>Type:</b> {type}
            </p>

            {booking ? (
              <>
                <p>
                  <b>Dates:</b> {startDate} - {endDate}
                </p>
                <p>
                  <b>Total:</b> ${totalPrice}
                </p>
                <p>
                  <b>Payment:</b>{" "}
                  <span
                    className={`payment-status ${
                      paymentStatus?.toLowerCase() === "paid"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {paymentStatus || "Pending"}
                  </span>
                </p>

                {/* ✅ QR CODE FOR TRIP */}
                <div className="qr-section">
                  <h3>Your QR Code</h3>
                  <QRCodeCanvas
                    value={JSON.stringify({
                      listingId,
                      startDate,
                      endDate,
                      totalPrice,
                      paymentStatus,
                    })}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    includeMargin={true}
                  />
                  <p className="qr-note">
                    Scan this QR to view/verify your trip.
                  </p>
                </div>
              </>
            ) : (
              <p>
                <b>Price:</b> ${price} per night
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCardTrip;
