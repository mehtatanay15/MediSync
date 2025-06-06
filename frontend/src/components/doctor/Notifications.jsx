import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiBellLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiUserLine,
  RiSearchLine,
  RiFilterLine,
  RiCloseLine,
  RiTimeLine,
  RiMenuLine,
} from "react-icons/ri";
import "../../styles/Dashboard.css";
import { SidePanel } from "./DashBoard";
import { LocationDropdown } from "./PatientList";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

function NotificationCard({ notification, onDismiss }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border border-gray-100 mb-4 relative">
      {/* Title and dismiss button */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-6 h-6 mr-2 md:mr-3 flex items-center justify-center">
            <RiBellLine className="text-[#5B81BC]" size={18} />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
            New Appointment Booked
          </h3>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={() => onDismiss(notification._id)}
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      {/* Notification body */}
      <div className="ml-8 md:ml-9">
        <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
          {notification.message}
        </p>
        <p className="text-gray-400 text-xs mb-2 md:mb-3">
          Booked: {formatDate(notification.sent_at)}
        </p>
        <p className="text-gray-500 text-xs mb-2">
          Token: {notification.token} | Status: {notification.status}
        </p>

        {/* Action button */}
        <button className="bg-[#5B81BC] text-white text-xs md:text-sm py-1 px-3 md:px-4 rounded-md hover:bg-[#4A6DA0]">
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("today");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  // Configure axios headers with authentication token
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Fetch today's appointments to create notifications
  useEffect(() => {
    if (authToken) {
      fetchTodaysAppointments();
    }
  }, [authToken]);

  const fetchTodaysAppointments = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await authAxios.get(
        `https://medisync-backend-up4v.onrender.com/appointment/date?date=${today}`
      );

      if (response.data && response.data.appointments) {
        // Convert appointments to notifications
        const appointmentNotifications = [];
        
        // Get all appointments from different categories
        const allAppointments = [
          ...(response.data.appointments.notArrived || []),
          ...(response.data.appointments.queued || []),
          ...(response.data.appointments.ongoing || []),
          ...(response.data.appointments.completed || []),
        ];

        // Sort by creation time (most recent first)
        allAppointments.sort((a, b) => new Date(b.createdAt || b.appointment_date) - new Date(a.createdAt || a.appointment_date));

        // Create notification objects
        allAppointments.forEach((appointment) => {
          appointmentNotifications.push({
            _id: appointment._id,
            patient: appointment.patient,
            sent_at: appointment.createdAt || appointment.appointment_date,
            message: `${appointment.patient_name} booked an appointment${appointment.emergency ? ' (Emergency)' : ''}`,
            token: appointment.appointment_token.substring(
              appointment.appointment_token.lastIndexOf("-") + 1
            ),
            status: appointment.status,
            emergency: appointment.emergency,
            createdAt: appointment.createdAt || appointment.appointment_date,
            updatedAt: appointment.updatedAt || appointment.appointment_date,
          });
        });

        setNotifications(appointmentNotifications);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load notifications. Please try again.");
      setLoading(false);

      // Handle unauthorized access
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
          timer: 2000,
        }).then(() => {
          navigate("/login");
        });
      }
    }
  };

  const getDateCategory = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "yesterday";
    } else if (date > oneWeekAgo) {
      return "thisWeek";
    } else if (date > oneMonthAgo) {
      return "thisMonth";
    } else {
      return "older";
    }
  };

  const handleDismissNotification = (notificationId) => {
    setDismissedNotifications(prev => new Set([...prev, notificationId]));
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Filter notifications to show only today's notifications
  const filteredNotifications = notifications
    .filter(notification => !dismissedNotifications.has(notification._id))
    .filter((notification) => {
      const matchesSearch = notification.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Only show today's notifications
      const dateCategory = getDateCategory(notification.sent_at);
      const isToday = dateCategory === "today";

      return matchesSearch && isToday;
    });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Side Panel*/}
      <div
        className={`${
          isMobileMenuOpen
            ? "fixed inset-0 z-50 bg-black bg-opacity-50"
            : "hidden"
        } md:block md:relative md:w-[17vw]`}
      >
        <div
          className={`${
            isMobileMenuOpen ? "w-[70vw] h-full" : "w-0"
          } md:w-full transition-all duration-300 ease-in-out`}
        >
          {(isMobileMenuOpen || window.innerWidth >= 768) && (
            <SidePanel propActiveButton="notification" />
          )}
        </div>
      </div>

      <div className="flex flex-col w-full md:w-[80vw]">
        {/* Mobile menu toggle button*/}
        <div className="flex md:hidden items-center p-4">
          <button
            onClick={toggleMobileMenu}
            className="text-[#5B81BC] focus:outline-none"
          >
            <RiMenuLine size={24} />
          </button>
          <h1 className="text-xl font-bold text-center flex-1">
            Notifications
          </h1>
        </div>

        {/* Navigation bar */}
        <nav className="flex flex-col px-4 md:px-0 md:flex-row mt-2 md:mt-4 justify-between md:pr-3 gap-2 md:gap-3">
          {/* Refresh button */}
          <div className="flex items-center">
            <button
              onClick={fetchTodaysAppointments}
              className="bg-[#5B81BC] text-white px-4 py-2 rounded-md text-sm hover:bg-[#4A6DA0] flex items-center gap-2"
            >
              <RiBellLine size={16} />
              Refresh Notifications
            </button>
          </div>

          {/* Drop Downs*/}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
            {/* <LocationDropdown /> */}
          </div>
        </nav>

        {/* Main Content */}
        <div className="main w-[95%] md:w-[100%] mt-3 md:mt-5 p-3 md:p-5 rounded-[20px]">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            {/* Title - Hidden on mobile as it's now in the header */}
            <h1 className="hidden md:block text-xl font-semibold text-[#4F678E]">
              Today's Appointment Notifications ({filteredNotifications.length})
            </h1>
          </div>

          {/* Notifications List */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            {loading ? (
              <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="text-center py-6 md:py-8 text-red-500 text-sm md:text-base">
                {error}
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onDismiss={handleDismissNotification}
                />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                No appointment notifications found for today
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}