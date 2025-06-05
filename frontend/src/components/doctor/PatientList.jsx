import React, { useState, useEffect } from "react";
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
  RiHistoryLine,
  RiFileTextLine,
  RiExternalLinkLine,
  RiTimeLine,
} from "react-icons/ri";
import "../../styles/Dashboard.css";
import { SidePanel } from "./DashBoard";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; 

export function LocationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Select Location");
  const locations = ["New York", "Los Angeles", "Chicago", "San Francisco"];

  const selectLocation = (location) => {
    setSelectedLocation(location);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-right drop-down rouned-[10px] w-[15vw] md:w-[18vw]">
      <div className="flex">
        <RiFilterLine className="relative left-6 top-2 text-gray-500" />
        <button
          type="button"
          className="inline-flex w-full justify-end gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#A1A9B888] ring-1 shadow-xs ring-gray-300 ring-inset border-0 hover:bg-gray-50 "
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {locations.map((location, index) => (
              <a
                href="#"
                key={index}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex="-1"
                onClick={() => selectLocation(location)}
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

function PatientCard({ patient, onClickDetails }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  // Get initials from patient name
  const getInitials = (name) => {
    if (!name) return "??";
    const nameParts = name.split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const patientInitials = getInitials(patient.name);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative border border-gray-100">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-blue-500"
        onClick={() => onClickDetails(patient._id)}
      >
        <RiExternalLinkLine size={20} />
      </button>

      <div className="flex flex-col items-center mb-4">
        {patient.profilePicture ? (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 mb-3">
            <img
              src={patient.profilePicture}
              alt={patient.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                // Switch to initials display on image error
                e.target.parentNode.className = "w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 mb-3 flex items-center justify-center bg-blue-100 text-[#4F678E] text-3xl font-bold";
                e.target.parentNode.innerHTML = patientInitials;
              }}
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 mb-3 flex items-center justify-center bg-blue-100 text-[#4F678E] text-3xl font-bold">
            {patientInitials}
          </div>
        )}

        <h3 className="font-semibold text-[#464F60] text-xl">{patient.name}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Last Visited on: {formatDate(patient.lastVisit)}
        </p>
      </div>

      <div className="flex justify-between mb-5 gap-3">
        <div className="flex items-center justify-center bg-blue-50 p-3 rounded-lg w-1/2">
          <RiUserLine className="text-[#5B81BC] mr-2" size={18} />
          <span className="text-sm text-gray-600">
            {patient.age || "N/A"} Yrs,
            <br />
            {patient.gender || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-center bg-blue-50 p-3 rounded-lg w-1/2">
          <RiTimeLine className="text-[#5B81BC] mr-2" size={18} />
          <span className="text-sm text-gray-600">
            {patient.visitCount || "1"} Times
          </span>
        </div>
      </div>

      <div className="mb-5 text-center">
        <h4 className="text-sm text-gray-500 mb-2">Contact Details</h4>
        <p className="text-sm text-gray-600">
          Phone No.: {patient.phoneNumber || "N/A"}
        </p>
        <p className="text-sm text-gray-600 truncate">
          Email ID: {patient.email || "N/A"}
        </p>
      </div>

      <div
        className="grid grid-cols-2 pt-4 border-t"
        style={{ borderColor: "#5B81BC" }}
      >
        <button className="flex items-center justify-center text-sm text-[#5B81BC] py-2 border-r">
          <RiHistoryLine className="mr-2" size={18} /> Medical History
        </button>
        <button className="flex items-center justify-center text-sm text-[#5B81BC] py-2">
          <RiFileTextLine className="mr-2" size={18} /> Prescription History
        </button>
      </div>
    </div>
  );
}

export default function PatientList() {
  const navigate = useNavigate();
  const { authToken } = useAuth(); // Use authToken from context
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://medisync-backend-up4v.onrender.com/user/doctor/profile/patients",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPatients(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message || "Failed to fetch patients");
        setLoading(false);
      }
    };

    if (authToken) {
      fetchPatients();
    }
  }, [authToken]); 

  const handleViewPatientDetails = (patientId) => {
    navigate(`/doctor/patient/${patientId}`);
  };

  const categorizePatients = (patient) => {
    const today = new Date();
    const lastVisit = new Date(patient.lastVisit || patient.createdAt);
    const daysDifference = Math.floor(
      (today - lastVisit) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference <= 7) return "recent";
    if (patient.visitCount > 3) return "frequent";
    return "all";
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const patientCategory = categorizePatients(patient);
    const matchesCategory =
      activeCategory === "all" || patientCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex">
        <div className="w-[15vw] md:w-[20vw]">
          <SidePanel propActiveButton="patientlist" />
        </div>
        <div className="flex justify-center items-center w-[85vw] md:w-[80vw]">
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="w-[15vw] md:w-[20vw]">
          <SidePanel propActiveButton="patientlist" />
        </div>
        <div className="flex justify-center items-center w-[85vw] md:w-[80vw]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="w-[15vw] md:w-[17vw]">
        <SidePanel propActiveButton="patientlist" />
      </div>

      <div className="flex flex-col w-[85vw] md:w-[80vw]">
        <nav className="flex flex-col md:flex-row mt-4 justify-between pr-3 gap-3">
          <div className="flex items-center">
            <RiSearchLine className="relative left-6 text-gray-400" />
            <input
              type="text"
              className="w-full md:w-[30vw] h-[32px] pl-8 search-bar border-0 outline-none rounded-md"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* <LocationDropdown /> */}
          </div>
        </nav>

        <div className="main w-[95%] md:w-[100%] mt-5 p-5 mx-auto rounded-[20px]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-xl font-semibold text-[#4F678E] mb-4 md:mb-0">
              Patient List
            </h1>

            <div className="flex gap-2 self-start md:self-auto">
              <button
                className={`px-4 py-2 rounded-md text-sm ${
                  activeCategory === "all"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All Patients
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm ${
                  activeCategory === "recent"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveCategory("recent")}
              >
                Recent Patients
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm ${
                  activeCategory === "frequent"
                    ? "bg-[#5B81BC] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setActiveCategory("frequent")}
              >
                Frequent Visitors
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  onClickDetails={handleViewPatientDetails}
                />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No patients found matching your criteria.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
