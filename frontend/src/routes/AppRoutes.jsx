import { Routes, Route, Navigate } from "react-router-dom";

/* Public pages */
import Home from "../pages/public/Home";
import Businesses from "../pages/public/Businesses";
import BusinessDetails from "../pages/public/BusinessDetails";
import Book from "../pages/public/Book";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPassword from "../pages/public/ForgotPassword";
import Contact from "../pages/public/Contact";
import About from "../pages/public/About";
import CreateBusiness from "../pages/public/CreateBusiness";

/* Admin pages */
import AdminOverview from "../pages/admin/AdminOverview";
import AdminBusinessRequests from "../pages/admin/AdminBusinessRequests";
import AdminBusinesses from "../pages/admin/AdminBusinesses";
import AdminClients from "../pages/admin/AdminClients";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminMessagesPage from "../pages/admin/AdminMessagesPage";
import AdminAppealsPage from "../pages/admin/AdminAppealsPage";

/* User pages */
import UserMessagesPage from "../pages/user/UserMessagesPage";
import UserOverview from "../pages/user/UserOverview";
import UserAppointments from "../pages/user/UserAppointments";
import UserSettings from "../pages/user/UserSettings";

/* Business pages */
import BusinessOverview from "../pages/business/BusinessOverview";
import BusinessAppointments from "../pages/business/BusinessAppointments";
import BusinessServices from "../pages/business/BusinessServices";
import BusinessSchedule from "../pages/business/BusinessSchedule";
import BusinessAnalytics from "../pages/business/BusinessAnalytics";
import BusinessSettings from "../pages/business/BusinessSettings";
import BusinessReviews from "../pages/business/BusinessReviews";

/* Layouts */
import AdminLayout from "../layouts/AdminLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import UserLayout from "../layouts/UserLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE */}
      <Route path="/" element={<Home />} />
      <Route path="/businesses" element={<Businesses />} />
      <Route path="/business/:id" element={<BusinessDetails />} />
      <Route path="/book/:serviceId" element={<Book />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/create-business" element={<CreateBusiness />} />

      {/* ADMIN DASHBOARD */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="business-requests" element={<AdminBusinessRequests />} />
        <Route path="businesses" element={<AdminBusinesses />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="appeals" element={<AdminAppealsPage />} />
      </Route>

      {/* USER ACCOUNT */}
      <Route path="/account" element={<UserLayout />}>
        <Route index element={<UserOverview />} />
        <Route path="appointments" element={<UserAppointments />} />
        <Route path="messages" element={<UserMessagesPage />} />
        <Route path="settings" element={<UserSettings />} />
      </Route>

      {/* Redirect old messages route */}
      <Route
        path="/messages"
        element={<Navigate to="/account/messages" replace />}
      />

      {/* BUSINESS DASHBOARD */}
      <Route path="/dashboard" element={<BusinessLayout />}>
        <Route index element={<BusinessOverview />} />
        <Route path="appointments" element={<BusinessAppointments />} />
        <Route path="services" element={<BusinessServices />} />
        <Route path="schedule" element={<BusinessSchedule />} />
        <Route path="analytics" element={<BusinessAnalytics />} />
        <Route path="settings" element={<BusinessSettings />} />
        <Route path="reviews" element={<BusinessReviews />} />
      </Route>
    </Routes>
  );
}