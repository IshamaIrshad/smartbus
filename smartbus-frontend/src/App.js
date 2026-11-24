import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

import SearchBus from "./pages/SearchBus";
import SeatSelection from "./pages/SeatSelection";
import BookingSummary from "./pages/BookingSummary";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";

import PassengerDashboard from "./pages/PassengerDashboard";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import TrackBus from "./pages/TrackBus";

import AdminDashboard from "./pages/AdminDashboard";
import ManageBuses from "./pages/ManageBuses";
import ManageRoutes from "./pages/ManageRoutes";
import ManageSchedules from "./pages/ManageSchedules";
import ManageBookings from "./pages/ManageBookings";
import ManagePassengers from "./pages/ManagePassengers";
import ManageStaff from "./pages/ManageStaff";
import AdminReports from "./pages/AdminReports";

import DriverDashboard from "./pages/DriverDashboard";
import DriverMyTrip from "./pages/DriverMyTrip";
import DriverPassengers from "./pages/DriverPassengers";
import DriverTrackBus from "./pages/DriverTrackBus";
import DriverProfile from "./pages/DriverProfile";


import ConductorDashboard from "./pages/ConductorDashboard";
import ConductorMyTrip from "./pages/ConductorMyTrip";
import ConductorPassengers from "./pages/ConductorPassengers";
import ConductorTickets from "./pages/ConductorTickets";
import ConductorTrackBus from "./pages/ConductorTrackBus";
import ConductorProfile from "./pages/ConductorProfile";


import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Passenger */}

        <Route
          path="/passenger-dashboard"
          element={<PassengerDashboard />}
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        <Route path="/track-bus" element={<TrackBus />} />

        {/* Booking */}

        <Route path="/search" element={<SearchBus />} />

        <Route
          path="/seat-selection"
          element={<SeatSelection />}
        />

        <Route
          path="/booking-summary"
          element={<BookingSummary />}
        />

        <Route path="/payment" element={<Payment />} />

        <Route
          path="/booking-confirmation"
          element={<BookingConfirmation />}
        />

        {/* Authentication */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Admin */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        <Route path="/manage-buses" element={<ManageBuses />} />
        <Route path="/manage-routes" element={<ManageRoutes />} />
        <Route path="/manage-schedules" element={<ManageSchedules />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
        <Route path="/manage-passengers" element={<ManagePassengers />} />
        <Route path="/manage-staff" element={<ManageStaff />} />
        <Route path="/admin-reports" element={<AdminReports />} />

        {/* Driver */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver-my-trip" element={<DriverMyTrip />} />
        <Route path="/driver-passengers" element={<DriverPassengers />} />
        <Route path="/driver-track-bus" element={<DriverTrackBus />} />
        <Route path="/driver-profile" element={<DriverProfile />} />

        <Route path="/conductor-dashboard" element={<ConductorDashboard />}/>
        <Route path="/conductor-my-trip" element={<ConductorMyTrip />}/>
        <Route path="/conductor-passengers"element={<ConductorPassengers />}/>
        <Route path="/conductor-tickets"element={<ConductorTickets />}/>

<Route
  path="/conductor-track-bus"
  element={<ConductorTrackBus />}
/>

<Route
  path="/conductor-profile"
  element={<ConductorProfile />}
/>

        {/* Not Found */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}


export default App;