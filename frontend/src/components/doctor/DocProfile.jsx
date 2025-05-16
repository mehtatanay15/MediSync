import React, { useState, useEffect } from "react";
import { LocationDropdown, SidePanel } from "./DashBoard";
import "../../styles/DocProfile.css";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import docprofile from './images/doc.png'
export const DoctorProfileForm = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: "",
    experience: 0,
    consultation_fees: 0,
    dob: "",
    specialization: "",
    phone: "",
    clinic_area: "",
    clinic_city: "",
  });

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      const token = Cookies.get("authToken");
      if (!token) {
        console.log("Token not found");
        return;
      }

      try {
        const res = await axios.get(
          "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const doctorData = res.data;

        const addressParts = doctorData.clinic_address
          ? doctorData.clinic_address.split(",").map((part) => part.trim())
          : [];

        setFormData({
          gender: doctorData.gender || "",
          experience: doctorData.experience || 0,
          consultation_fees: doctorData.consultation_fees || 0,
          dob: doctorData.dob ? doctorData.dob.slice(0, 10) : "",
          specialization: doctorData.specialization || "",
          phone: doctorData.phone || "",
          clinic_area: addressParts[0] || "",
          clinic_city: addressParts[1] || "",
        });
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["phone", "experience", "consultation_fees"].includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      if (name === "phone") {
        if (numericValue.length <= 10) {
          setFormData((prev) => ({ ...prev, [name]: numericValue }));
        }
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: numericValue === "" ? 0 : Number(numericValue),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const tabs = ["About", "Experience", "Address"];

  const handleUpdate = async () => {
    setLoading(true);

    let userId;
    try {
      const userDataString = Cookies.get("userData");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      userId = userData?._id;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "Could not parse user data from cookies",
        confirmButtonColor: "#3085d6",
      });
      setLoading(false);
      return;
    }

    const token = Cookies.get("authToken");

    if (!userId || !token) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "User not authenticated. Please log in again.",
        confirmButtonColor: "#3085d6",
      });
      setLoading(false);
      return;
    }

    const requestBody = {
      experience: formData.experience,
      consultation_fees: formData.consultation_fees,
      gender: formData.gender,
      dob: formData.dob,
      specialization: formData.specialization,
      phone: formData.phone,
      clinic_address: `${formData.clinic_area}, ${formData.clinic_city}`,
    };

    try {
      const res = await axios.put(
        "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully",
        confirmButtonColor: "#3085d6",
      });

      console.log("Update response:", res.data);
    } catch (err) {
      console.error("Update failed", err);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          err.response?.data?.message ||
          "Failed to update profile. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-3 gap-4 mb-4 bg-[#E5F1FF] p-2 rounded-full">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`rounded-full form-headers py-2 px-2 text-center font-medium cursor-pointer transition-colors text-[#31316FCC] border-[3px] border-white ${
              activeTab === tab ? "bg-white " : "bg-[#E5F1FF] "
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-3 gap-4 text-[#31316F]">
        {/* About Section */}
        <div
          className={`rounded-lg shadow p-4 ${
            activeTab !== "About"
              ? "bg-[#E5F1FF99] opacity-50"
              : "bg-[#E5F1FF] "
          }`}
        >
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Date Of Birth:
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                disabled={activeTab !== "About"}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Gender:
              </label>
              <select
                name="gender"
                value={formData.gender}
                disabled={activeTab !== "About"}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone No.:
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={activeTab !== "About"}
                maxLength={10}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter 10-digit phone number"
              />
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div
          className={`rounded-lg shadow p-4 ${
            activeTab !== "Experience"
              ? "bg-[#E5F1FF99] opacity-50"
              : "bg-[#E5F1FF] "
          }`}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Years of Experience:
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              disabled={activeTab !== "Experience"}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter years of experience"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Specialization:
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              disabled={activeTab !== "Experience"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="E.g., Cardiology, Pediatrics, etc."
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Consultation Fees (₹):
            </label>
            <input
              type="text"
              name="consultation_fees"
              value={formData.consultation_fees}
              disabled={activeTab !== "Experience"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter consultation fees"
            />
          </div>
        </div>

        {/* Address Section */}
        <div
          className={`rounded-lg shadow p-4 ${
            activeTab !== "Address"
              ? "bg-[#E5F1FF99] opacity-50"
              : "bg-[#E5F1FF] "
          }`}
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Clinic Area / Street:
            </label>
            <input
              type="text"
              name="clinic_area"
              value={formData.clinic_area}
              disabled={activeTab !== "Address"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter clinic area or street"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Clinic City and Pincode:
            </label>
            <input
              type="text"
              name="clinic_city"
              value={formData.clinic_city}
              disabled={activeTab !== "Address"}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              placeholder="Enter clinic city"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`mt-6 px-6 py-2 bg-[#5372A1] text-white rounded-full ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default function DocProfile() {
  const { userInfo } = useAuth();
  return (
    <div className="flex">
      {/* Side Panel */}
      <div className="w-[15vw]">
        <SidePanel propactiveButton={"a"} />
      </div>
      <div className="flex flex-col w-[85vw]">
        {/* Navigation bar */}
        <nav className="flex mt-4 justify-between  items-center pr-3">
          {/* Drop Downs */}
          <div className="ml-auto">{/* <LocationDropdown /> */}</div>
        </nav>

        <div className="main w-[81vw] mt-5 p-5 mx-auto h-[25vw] overflow-hidden doc-image flex">
          <div className="flex">
            <p className="text-[rgb(49,49,111)] text-5xl font-semibold self-end py-4 px-2">
              {userInfo ? "Dr. " + userInfo.name : ""}
            </p>
            <img
              src={docprofile}
              alt="Doctor profile image"
              className="h-[40vw] ml-40"
            />
          </div>
        </div>

        <div className="mt-10">
          <DoctorProfileForm />
        </div>
      </div>
    </div>
  );
}
