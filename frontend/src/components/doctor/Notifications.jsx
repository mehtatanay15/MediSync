import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

function NotificationCard({ notification, onDismiss }) {
  // Format the sent_at date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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
            Title
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
          Sent: {formatDate(notification.sent_at)}
        </p>

        {/* Action button */}
        <button className="bg-[#5B81BC] text-white text-xs md:text-sm py-1 px-3 md:px-4 rounded-md hover:bg-[#4A6DA0]">
          Button
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sample notification data matching your mongoose schema
  // Added some variety to demonstrate filtering
  const notifications = [
    {
      _id: "6461c2b14b35a12f34c56789",
      patient: "6461c2b14b35a12f34c56789", // ObjectId reference
      sent_at: "2025-04-04T10:30:00Z", // Today
      message: "Body text.",
      createdAt: "2025-04-04T10:30:00Z",
      updatedAt: "2025-04-04T10:30:00Z",
    },
    {
      _id: "6461c2b14b35a12f34c56790",
      patient: "6461c2b14b35a12f34c56789",
      sent_at: "2025-04-03T14:20:00Z", // Yesterday
      message: "Body text.",
      createdAt: "2025-04-03T14:20:00Z",
      updatedAt: "2025-04-03T14:20:00Z",
    },
    {
      _id: "6461c2b14b35a12f34c56791",
      patient: "6461c2b14b35a12f34c56790",
      sent_at: "2025-04-02T09:15:00Z", // This week
      message: "Body text.",
      createdAt: "2025-04-02T09:15:00Z",
      updatedAt: "2025-04-02T09:15:00Z",
    },
    {
      _id: "6461c2b14b35a12f34c56792",
      patient: "6461c2b14b35a12f34c56791",
      sent_at: "2025-03-28T16:45:00Z", // Last week
      message: "Body text.",
      createdAt: "2025-03-28T16:45:00Z",
      updatedAt: "2025-03-28T16:45:00Z",
    },
    {
      _id: "6461c2b14b35a12f34c56793",
      patient: "6461c2b14b35a12f34c56792",
      sent_at: "2025-03-04T11:10:00Z", // Last month
      message: "Body text.",
      createdAt: "2025-03-04T11:10:00Z",
      updatedAt: "2025-03-04T11:10:00Z",
    },
  ];

  // Function to determine if a date is today, yesterday, this week, etc.
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

  // Function to dismiss a notification
  const handleDismissNotification = (notificationId) => {
    // In a real app, you would remove the notification from state or mark as read in backend
    console.log(`Dismissed notification ${notificationId}`);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Filter notifications based on search term and time filter
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by time
    const dateCategory = getDateCategory(notification.sent_at);
    const matchesTimeFilter =
      timeFilter === "all" ||
      (timeFilter === "today" && dateCategory === "today") ||
      (timeFilter === "yesterday" && dateCategory === "yesterday") ||
      (timeFilter === "thisWeek" &&
        (dateCategory === "today" ||
          dateCategory === "yesterday" ||
          dateCategory === "thisWeek")) ||
      (timeFilter === "thisMonth" &&
        (dateCategory === "today" ||
          dateCategory === "yesterday" ||
          dateCategory === "thisWeek" ||
          dateCategory === "thisMonth"));

    return matchesSearch && matchesTimeFilter;
  });

  return (
    <div className="flex flex-col md:flex-row">
      {/* Side Panel - Hidden on mobile, shown with overlay when menu button clicked */}
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
        {/* Mobile menu toggle button - Only visible on mobile */}
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
          {/* Search Bar */}
          {/* <div className="flex items-center w-full md:w-auto">
            <RiSearchLine className="relative left-6 text-gray-400" />
            <input
              type="text"
              className="w-full md:w-[30vw] h-[32px] pl-8 search-bar border-0 outline-none rounded-md"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div> */}

          {/* Drop Downs - Stack vertically on small screens */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
            {/* <LocationDropdown /> */}
          </div>
        </nav>

        {/* Main Content */}
        <div className="main w-[95%] md:w-[100%] mt-3 md:mt-5 p-3 md:p-5 rounded-[20px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
            {/* Title - Hidden on mobile as it's now in the header */}
            <h1 className="hidden md:block text-xl font-semibold text-[#4F678E] mb-4 md:mb-0">
              Notifications
            </h1>

            {/* Time-based filters - Scrollable on small screens */}
            <div className="flex overflow-x-auto pb-2 w-full md:w-auto gap-2 self-start md:self-auto">
              <button
                className={`px-3 md:px-4 py-2 flex-shrink-0 rounded-md text-xs md:text-sm ${
                  timeFilter === "all"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setTimeFilter("all")}
              >
                All
              </button>
              <button
                className={`px-3 md:px-4 py-2 flex-shrink-0 rounded-md text-xs md:text-sm ${
                  timeFilter === "today"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setTimeFilter("today")}
              >
                Today
              </button>
              <button
                className={`px-3 md:px-4 py-2 flex-shrink-0 rounded-md text-xs md:text-sm ${
                  timeFilter === "thisWeek"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setTimeFilter("thisWeek")}
              >
                This Week
              </button>
              <button
                className={`px-3 md:px-4 py-2 flex-shrink-0 rounded-md text-xs md:text-sm ${
                  timeFilter === "thisMonth"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setTimeFilter("thisMonth")}
              >
                This Month
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onDismiss={handleDismissNotification}
                />
              ))
            ) : (
              <div className="text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                No notifications found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
