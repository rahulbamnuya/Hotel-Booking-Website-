import { useEffect, useState, useCallback } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import BookingCardTrip from "../components/BookingCardTrip";
import Footer from "../components/Footer";
import { apiFetch } from "../api";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

  const getTripList = useCallback(async () => {
    try {
      const response = await apiFetch(
        `/users/${userId}/trips`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log(data)
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    getTripList();
  }, [getTripList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList?.map(
  ({
    listingId,
    hostId,
    startDate,
    endDate,
    totalPrice,
    booking = true,
    paymentStatus = "Pending", // 👈 add this if available in backend
  }) => (
    <BookingCardTrip
      key={listingId._id}
      listingId={listingId._id}
      creator={hostId._id}
      listingPhotoPaths={listingId.listingPhotoPaths}
      city={listingId.city}
      province={listingId.province}
      country={listingId.country}
      category={listingId.category}
      startDate={startDate}
      endDate={endDate}
      totalPrice={totalPrice}
      booking={booking}
      paymentStatus={paymentStatus} // 👈 send to card
    />
  )
)}

      </div>
      <Footer />
    </>
  );
};

export default TripList;
