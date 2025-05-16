import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import { useAuth } from "../../context/AuthContext";

import search from "./images/Search.svg";
import location from "./images/location.svg";
import approve from "./images/Approve.svg";
import cancel from "./images/Cancel.svg";
import { useNavigate } from "react-router-dom";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiBellLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiUserLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import logo from "./images/logo.png";
import Cookies from "js-cookie";

export function LocationDropdown() {
  // State to manage whether the dropdown is visible or not
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");

  // Array of locations
  const locations = ["New York", "Los Angeles", "Chicago", "San Francisco"];

  // Function to handle selecting a location
  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-right drop-down rouned-[10px] w-[15vw]">
      <div className="flex">
        <img src={location} className="relative left-6" />
        <button
          type="button"
          className="inline-flex w-full justify-end gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#A1A9B888] ring-1 shadow-xs ring-gray-300 ring-inset border-0 hover:bg-gray-50 "
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
        >
          {selectedLocation}
          <svg
            className="-mr-1 size-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1"
        >
          <div className="py-1" role="none">
            {/* Loop through locations and display them as menu items */}
            {locations.map((location, index) => (
              <a
                href="#"
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex="-1"
                onClick={() => selectLocation(location)} // Set location and close dropdown
              >
                {location}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SidePanel({ propActiveButton }) {
  const { logout, userInfo } = useAuth();
  const navigate = useNavigate();
  // Track the active button with state
  const [activeButton, setActiveButton] = useState(propActiveButton || "");

  // Handle button clicks
  const handleNavigation = (path, buttonName) => {
    setActiveButton(buttonName);
    navigate(path);
  };

  return (
    <div
      className="bg-[#EDF5FF] w-[15vw] min-h-screen text-center
          no-zoom fixed"
    >
      <div className="flex items-center justify-center mt-[5vh]">
        <img src={logo} alt="Medisync Logo" className="h-12 mr-2" />
        <p className="text-[26px] font-bold medisync-text">Medisync</p>
      </div>
      <div className="mt-[7vh] flex flex-col items-center">
        <button
          className={`flex items-center || w-10/12 h-[5vh] my-2 || rounded-[11px] ${
            activeButton === "dashboard" ? "side-panel-css" : ""
          } || font-semibold text-[14px] clickable`}
          onClick={() => handleNavigation("/doctor", "dashboard")}
        >
          <RiDashboardLine
            className={`h-[3vh] w-[3vh] mx-4 ${
              activeButton === "dashboard" ? "text-white" : "text-[#5B81BC]"
            }`}
          />
          <span
            className={
              activeButton === "dashboard" ? "text-white" : "text-[#5B81BC]"
            }
          >
            DashBoard
          </span>
        </button>

        <button
          className={`flex items-center || w-10/12 h-[5vh] my-2 || rounded-[11px] ${
            activeButton === "appointment" ? "side-panel-css" : ""
          } || font-semibold text-[14px] clickable`}
          onClick={() => handleNavigation("/doctor/appointment", "appointment")}
        >
          <RiCalendarCheckLine
            className={`h-[3vh] w-[3vh] mx-4 ${
              activeButton === "appointment" ? "text-white" : "text-[#5B81BC]"
            }`}
          />
          <span
            className={
              activeButton === "appointment" ? "text-white" : "text-[#5B81BC]"
            }
          >
            Appointments
          </span>
        </button>

        <button
          className={`flex items-center || w-10/12 h-[5vh] my-2 || rounded-[11px] ${
            activeButton === "report" ? "side-panel-css" : ""
          } || font-semibold text-[14px] clickable`}
          onClick={() => handleNavigation("/doctor/report", "report")}
        >
          <RiFileListLine
            className={`h-[3vh] w-[3vh] mx-4 ${
              activeButton === "report" ? "text-white" : "text-[#5B81BC]"
            }`}
          />
          <span
            className={
              activeButton === "report" ? "text-white" : "text-[#5B81BC]"
            }
          >
            Reports
          </span>
        </button>

        <button
          className={`flex items-center || w-10/12 h-[5vh] my-2 || rounded-[11px] ${
            activeButton === "patientlist" ? "side-panel-css" : ""
          } || font-semibold text-[14px] clickable`}
          onClick={() => handleNavigation("/doctor/patientlist", "patientlist")}
        >
          <RiUserLine
            className={`h-[3vh] w-[3vh] mx-4 ${
              activeButton === "patientlist" ? "text-white" : "text-[#5B81BC]"
            }`}
          />
          <span
            className={
              activeButton === "patientlist" ? "text-white" : "text-[#5B81BC]"
            }
          >
            Patient List
          </span>
        </button>

        <button
          className={`flex items-center || w-10/12 h-[5vh] my-2 || rounded-[11px] ${
            activeButton === "notification" ? "side-panel-css" : ""
          } || font-semibold text-[14px] clickable`}
          onClick={() =>
            handleNavigation("/doctor/notification", "notification")
          }
        >
          <RiBellLine
            className={`h-[3vh] w-[3vh] mx-4 ${
              activeButton === "notification" ? "text-white" : "text-[#5B81BC]"
            }`}
          />
          <span
            className={
              activeButton === "notification" ? "text-white" : "text-[#5B81BC]"
            }
          >
            Notifications
          </span>
        </button>
      </div>

      {/* Doctors info */}
      <div
        className="w-10/12 h-[12vw] || mt-[12vh] mx-auto || doc-css  ||
            rounded-[10px] ||  flex flex-col items-center"
      >
        {/* Replace this with actual doctor image or a placeholder */}
        <div
          className="border-[3px] border-[#7597CD] ||
                w-1/2 h-1/2 relative bottom-10 rounded-[15vh] flex items-center justify-center bg-white"
        >
          {/* Placeholder for doctor image */}
          <span className="text-[#5B81BC] text-4xl font-bold">
            {userInfo ? userInfo.name[0] : ""}
          </span>
        </div>

        {/* Fetch doc info from backend and display here*/}
        <p className="relative bottom-5 text-white text-[18px] font-semibold">
          {userInfo ? "Dr. " + userInfo.name : ""}
        </p>
        {/* <p className="relative bottom-5 text-white text-[14px] font-normal">
          MBBS
        </p> */}
        <div className="flex relative bottom-2">
          <button
            className="mr-2 text-white hover:text-gray-200 clickable"
            onClick={() => navigate("/doctor/profile")}
          >
            <RiSettings4Line size={22} />
          </button>
          <button
            className="ml-2 text-white hover:text-gray-200 clickable"
            onClick={logout}
          >
            <RiLogoutBoxRLine size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function LiveStatus({ appointmentsData }) {
  // Extract relevant data from the appointments API response
  const calculateStatsData = () => {
    if (!appointmentsData) return {};

    const totalAppointments =
      (appointmentsData.notArrived?.length || 0) +
      (appointmentsData.queued?.length || 0) +
      (appointmentsData.ongoing?.length || 0) +
      (appointmentsData.completed?.length || 0);

    const completedAppointments = appointmentsData.completed?.length || 0;

    // Get current token from the first ongoing appointment
    const currentToken =
      appointmentsData.ongoing?.length > 0
        ? appointmentsData.ongoing[0].appointment_number
        : 0;

    const confirmedAppointments =
      (appointmentsData.queued?.length || 0) +
      (appointmentsData.ongoing?.length || 0) +
      (appointmentsData.completed?.length || 0);

    // Assuming reports are generated for completed appointments
    // This is a mock value, replace with actual logic if you have report data
    const reportsGenerated = completedAppointments;

    // Assuming max tokens is the highest appointment number
    const maxTokens = totalAppointments > 0 ? totalAppointments : 1;

    return {
      completedAppointments,
      totalAppointments,
      currentToken,
      confirmedAppointments,
      reportsGenerated,
      maxTokens,
    };
  };

  const statsData = calculateStatsData();

  // Calculate percentages for progress bars
  const appointmentsPercentage =
    statsData.totalAppointments > 0
      ? (statsData.completedAppointments / statsData.totalAppointments) * 100
      : 0;

  const tokenPercentage =
    statsData.maxTokens > 0
      ? (statsData.currentToken / statsData.maxTokens) * 100
      : 0;

  const confirmedPercentage =
    statsData.totalAppointments > 0
      ? (statsData.confirmedAppointments / statsData.totalAppointments) * 100
      : 0;

  const reportsPercentage =
    statsData.completedAppointments > 0
      ? (statsData.reportsGenerated / statsData.completedAppointments) * 100
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center">
      {/* Completed Appointments */}
      <div className="livestatus-box">
        <p className="font-semibold text-[14px]">Today's Appointments</p>
        <p className="mt-[20px]">
          <span className="font-medium text-[32px]">
            {statsData.completedAppointments}
          </span>
          <span className="font-medium text-[18px]">
            /{statsData.totalAppointments}
          </span>
        </p>
        <p className="text-[11px] my-1">
          Completed appointments out of total scheduled.
        </p>

        {/* Progress Bar */}
        <div className="w-10/12">
          <span id="ProgressLabel" className="sr-only">
            {Math.round(appointmentsPercentage)}% Complete
          </span>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={Math.round(appointmentsPercentage)}
            className="block rounded-full bg-white"
          >
            <span
              className="block h-[5px] rounded-full bg-[#567CBA]"
              style={{ width: `${Math.round(appointmentsPercentage)}%` }}
            ></span>
          </span>
        </div>
      </div>

      {/* Current Token */}
      <div className="livestatus-box">
        <p className="font-semibold text-[14px]">Current Token</p>
        <p className="mt-[20px]">
          <span className="font-medium text-[32px]">
            T-{statsData.currentToken}
          </span>
        </p>
        <p className="text-[11px] my-1">Latest ongoing token number.</p>

        {/* Progress Bar */}
        <div className="w-10/12">
          <span id="ProgressLabel" className="sr-only">
            {Math.round(tokenPercentage)}% Complete
          </span>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={Math.round(tokenPercentage)}
            className="block rounded-full bg-white"
          >
            <span
              className="block h-[5px] rounded-full bg-[#567CBA]"
              style={{ width: `${Math.round(tokenPercentage)}%` }}
            ></span>
          </span>
        </div>
      </div>

      {/* Confirmed Appointments */}
      <div className="livestatus-box">
        <p className="font-semibold text-[14px]">Appointments Confirmed</p>
        <p className="mt-[20px]">
          <span className="font-medium text-[32px]">
            {statsData.confirmedAppointments}
          </span>
        </p>
        <p className="text-[11px] my-1">Total appointments confirmed today.</p>

        {/* Progress Bar */}
        <div className="w-10/12">
          <span id="ProgressLabel" className="sr-only">
            {Math.round(confirmedPercentage)}% Complete
          </span>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={Math.round(confirmedPercentage)}
            className="block rounded-full bg-white"
          >
            <span
              className="block h-[5px] rounded-full bg-[#567CBA]"
              style={{ width: `${Math.round(confirmedPercentage)}%` }}
            ></span>
          </span>
        </div>
      </div>

      {/* Reports Generated */}
      <div className="livestatus-box">
        <p className="font-semibold text-[14px]">Reports Generated</p>
        <p className="mt-[20px]">
          <span className="font-medium text-[32px]">
            {statsData.reportsGenerated}
          </span>
        </p>
        <p className="text-[11px] my-1">Total reports generated today.</p>

        {/* Progress Bar */}
        <div className="w-10/12">
          <span id="ProgressLabel" className="sr-only">
            {Math.round(reportsPercentage)}% Complete
          </span>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={Math.round(reportsPercentage)}
            className="block rounded-full bg-white"
          >
            <span
              className="block h-[5px] rounded-full bg-[#567CBA]"
              style={{ width: `${Math.round(reportsPercentage)}%` }}
            ></span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function PatientMiniCard({ patient_name, patient, token }) {
  const navigate = useNavigate();
  const getInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };
  return (
    <div className="w-1/3 px-2">
      <div className="flex flex-col h-[50%] shadow-lg p-8 bg-[#ecf3fe] rounded-2xl items-center gap-[1vh] relative">
        {/* Token Badge */}
        <div className="absolute top-2 right-2 bg-[#5B81BC] text-white px-3 py-1 rounded-full text-xs font-medium">
          T-{token || "??"}
        </div>

        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#7597CD] mb-3 flex items-center justify-center bg-white text-[#4F678E] text-xl font-bold">
          {getInitials(patient_name)}
        </div>
        <div className="flex flex-row justify-between gap-1 items-center content-center">
          <h1 className="font-medium text-[#464F60] text-center">
            {patient_name}
          </h1>
          <button
            className="cursor-pointer m-2 hover:text-blue-500"
            onClick={() => navigate(`/doctor/patient/${patient}`)}
          >
            <RiExternalLinkLine />
          </button>
        </div>
      </div>
    </div>
  );
}

export function OngoingAppointmentsBox({ appointments, loading }) {
  const navigate = useNavigate();
  const [ongoingAppointments, setOngoingAppointments] = useState([]);

  useEffect(() => {
    if (
      appointments &&
      appointments.ongoing &&
      appointments.ongoing.length > 0
    ) {
      // Only display maximum of 3 ongoing appointments
      setOngoingAppointments(appointments.ongoing.slice(0, 3));
    } else {
      setOngoingAppointments([]);
    }
  }, [appointments]);

  return (
    <div className="flex w-[55vw]">
      {loading ? (
        <div className="w-full text-center py-8">
          <h1 className="text-[30px] text-[#4F678E] font-semibold">
            Loading...
          </h1>
          <div className="mt-4 w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] text-[#4F678E] font-semibold pt-4 pb-2">
              Ongoing Appointments
            </h1>
            {appointments &&
              appointments.ongoing &&
              appointments.ongoing.length > 3 && (
                <button
                  className="text-[#5B81BC] font-medium hover:underline mr-4"
                  onClick={() => navigate("/doctor/appointment")}
                >
                  View All (
                  {appointments.ongoing ? appointments.ongoing.length : 0})
                </button>
              )}
          </div>
          <div className="h-full flex flex-row flex-wrap gap-y-4 w-full mt-4">
            {ongoingAppointments && ongoingAppointments.length > 0 ? (
              ongoingAppointments.map((appointment, index) => (
                <PatientMiniCard
                  key={index}
                  patient_name={appointment.patient_name}
                  patient={appointment.patient}
                  token={appointment.token_no}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full py-10 bg-gray-50 rounded-xl">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h1 className="text-[20px] text-[#4F678E] mt-4">
                  No Ongoing Appointments for this day
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
const Calendar = ({ setGlobalDate }) => {
  const currentDateObj = new Date();
  const [viewMonth, setViewMonth] = useState(currentDateObj.getMonth());
  const [viewYear, setViewYear] = useState(currentDateObj.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Days of the week
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate calendar data for the selected month/year
  const generateCalendarData = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Create a 2D array for the calendar
    const calendarData = [];
    let week = Array(7).fill(null);

    // Fill in days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      week[i] = null;
    }

    // Fill in the days of the month
    let dayCounter = 1;
    for (let i = startingDayOfWeek; i < 7; i++) {
      week[i] = dayCounter++;
    }
    calendarData.push([...week]);

    // Fill in the rest of the weeks
    while (dayCounter <= daysInMonth) {
      week = Array(7).fill(null);
      for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
        week[i] = dayCounter++;
      }
      calendarData.push([...week]);
    }

    return calendarData;
  };

  // Navigate to previous month
  const previousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (day !== null) {
      const newDate = new Date(viewYear, viewMonth, day);
      setSelectedDate(newDate);

      // Changed this line to fix the date offset issue
      const year = viewYear;
      const month = String(viewMonth + 1).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      setGlobalDate(`${year}-${month}-${formattedDay}`);
    }
  };

  // Check if a date is today
  const isToday = (day) => {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (day) => {
    if (day === null || selectedDate === null) return false;
    return (
      day === selectedDate.getDate() &&
      viewMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  };

  // Generate the calendar data
  const calendarData = generateCalendarData(viewMonth, viewYear);

  return (
    <div className="w-full max-w-md bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={previousMonth}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-400 clickable"
          aria-label="Previous month"
        >
          &lt;
        </button>

        <h2 className="text-lg text-[14px] font-semibold">
          {monthNames[viewMonth]} {viewYear}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-200 text-gray-400 clickable"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-2">
        {/* Header row with days of the week */}
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs text-gray-500 font-medium py-1"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.flat().map((day, index) => {
          // Style based on date condition
          let dayClass =
            "aspect-square flex items-center justify-center text-[12px] cursor-pointer";

          if (day === null) {
            return <div key={index} className="aspect-square"></div>;
          }

          if (isSelected(day)) {
            dayClass += " bg-blue-500 text-white rounded-full";
          } else if (isToday(day)) {
            dayClass += " bg-blue-100 text-blue-800 rounded-full";
          } else {
            dayClass += " hover:bg-gray-200 text-gray-700";
          }

          return (
            <div
              key={index}
              className={dayClass}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function UpcomingAppointments({ appointments, loading }) {
  const navigate = useNavigate();
  const [upcomingPatients, setUpcomingPatients] = useState([]);

  useEffect(() => {
    if (appointments) {
      // Combine queued and notArrived appointments for the upcoming list
      const combined = [
        ...(appointments.queued || []),
        ...(appointments.notArrived || []),
      ];

      // Map to the format expected by the UI
      const mapped = combined.map((app, index) => ({
        srNo: index + 1,
        name: app.patient_name,
        age: app.patient_age,
        region: app.region,
        token_no: app.appointment_number,
        eta: "15", // This seems to be a fixed value in your mock data
        reason: app.reason,
        remarks: "", // You might want to add this field to your API
        edit: "...",
      }));

      setUpcomingPatients(mapped);
    }
  }, [appointments]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10">
        <div className="mt-4 w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading upcoming appointments...</p>
      </div>
    );
  }

  if (!upcomingPatients || upcomingPatients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-10 bg-gray-50 rounded-xl mt-4">
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-[20px] text-[#4F678E] mt-4">
          No Upcoming Appointments for this day
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-6">
      <h1 className="text-[30px] text-[#4F678E] font-semibold mb-4">
        Upcoming Appointments
      </h1>
      <div className="flex items-center justify-center text-center font-medium text-[#464F60] mb-2">
        <span className="w-1/12 text-[13px]">SR.NO.</span>
        <span className="w-1/12 text-[13px]">TOKEN NUMBER</span>
        <span className="w-2/12 text-[13px]">NAME</span>
        <span className="w-1/12 text-[13px]">AGE</span>
        <span className="w-1/12 text-[13px]">REGION</span>
        <span className="w-1/12 text-[13px]">ETA</span>
        <span className="w-2/12 text-[13px]">REASON</span>
        <span className="w-2/12 text-[13px]">REMARKS</span>
        <span className="w-1/12 text-[13px]">EDIT</span>
      </div>
      {upcomingPatients.map((patient) => (
        <div
          key={patient.srNo}
          className="w-full flex items-center text-center text-[12px] h-[7vh] text-[#464F60] hover:bg-gray-50"
        >
          <span className="w-1/12 text-[13px]">{patient.srNo}</span>
          <span className="w-1/12 text-[13px]">T-{patient.token_no}</span>
          <span className="w-2/12 text-[13px]">{patient.name}</span>
          <span className="w-1/12 text-[13px]">{patient.age}</span>
          <span className="w-1/12 text-[13px]">{patient.region}</span>
          <span className="w-1/12 text-[13px]">{patient.eta} min</span>
          <span className="w-2/12 text-[13px] truncate">{patient.reason}</span>
          <span className="w-2/12 text-[13px]">{patient.remarks}</span>
          <span className="w-1/12 text-[13px] clickable">{patient.edit}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashBoard() {
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalDate, setGlobalDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    setLoading(true);
    // const selectedDate=new Date().toISOString().split("T")[0];
    const selectedDate = globalDate || "2025-04-15";
    const getAppointments = async () => {
      try {
        const response = await fetch(
          `https://medisync-backend-up4v.onrender.com/appointment/date?date=${selectedDate}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Appointments data:", data.appointments);
        setAppointments(data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    getAppointments();
  }, [globalDate, authToken]);

  return (
    <div className="flex">
      {/* Side Panel */}
      <div className="w-[15vw]">
        <SidePanel propActiveButton={"dashboard"} />
      </div>
      <div className="flex flex-col w-[85vw]">
        {/* Navigation bar */}
        <nav className="flex justify-between mt-4 pr-3">
          {/* Drop Downs */}
          <div className="ml-auto">{/* <LocationDropdown /> */}</div>
        </nav>

        <div className="main w-[81vw] || mt-5 p-5 mx-auto rounded-[20px] || ">
          <div>
            <p className="text-[#4F678E] text-[32px] font-semibold">
              Welcome to Consultancy!
            </p>
            {/* Progress Boxes */}
            <div>
              <LiveStatus appointmentsData={appointments} />
            </div>
            {/* Appointment Confirmation */}
            <div className="flex h-[60vh] overflow-hidden">
              {/* a small concised box to approve or decline appointments */}
              <div className="flex overflow-hidden w-[59vw]">
                <OngoingAppointmentsBox
                  appointments={appointments}
                  loading={loading}
                />
              </div>

              {/*CALENDAR TO SELECT THE DATE  */}
              <div className="flex flex-col">
                <p className="text-[30px] text-[#4F678E] font-semibold pt-4 pb-2">
                  Calendar
                </p>
                <Calendar setGlobalDate={setGlobalDate} />
              </div>
            </div>

            {/* Brief overview of the patients who have been assigned a token */}
            <div className="">
              <UpcomingAppointments
                appointments={appointments}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
