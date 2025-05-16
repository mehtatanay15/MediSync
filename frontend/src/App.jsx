import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login.jsx";
import LandingPage from "./components/LandingPage";
import AboutUs from "./components/AboutUs"; // Import the new AboutUs component
import DashBoard from "./components/doctor/DashBoard";
import Appointment from "./components/doctor/Appointment";
import Reports from "./components/doctor/Reports.jsx";
import Notifications from "./components/doctor/Notifications";
import PatientList from "./components/doctor/PatientList.jsx";
import PatientProfile from "./components/doctor/PatientProfile.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import VerifyOTP from "./components/VerifyOTP.jsx";
import DocProfile from "./components/doctor/DocProfile";
import DoctorRegistration from "./components/doctor/DoctorRegistration";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import Demo from "./components/Demo.jsx";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/about" element={<AboutUs />}></Route>
            <Route path="/demo" element={<Demo />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
            <Route path="/verify-otp" element={<VerifyOTP />}></Route>
            <Route path="/change-password" element={<ChangePassword />}></Route>
            {/* <Route
              path="/doctor-registration"
              element={<DoctorRegistration />}
            ></Route> */}

            {/* Doctor Registration Route - Requires authentication but not profile completion */}
            <Route
              path="/doctor-registration"
              element={
                <ProtectedRoute
                  allowedRoles={["Doctor"]}
                  requireProfile={false}
                >
                  <DoctorRegistration />
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes - Require both authentication and profile completion */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/appointment"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <Appointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/report"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patientlist"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/notification"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/patient/:patientId"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <PatientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile"
              element={
                <ProtectedRoute allowedRoles={["Doctor"]}>
                  <DocProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
