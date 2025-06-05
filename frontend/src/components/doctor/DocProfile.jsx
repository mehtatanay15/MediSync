import React, { useState, useEffect } from "react";
import {  SidePanel } from "./DashBoard";
import "../../styles/DocProfile.css";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import docprofile from './images/doc.png'

export const DoctorProfileForm = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
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
        console.log("Doctor data received:", doctorData);

        let clinic_area = "";
        let clinic_city = "";
        
        if (doctorData.clinic_address) {
          const fullAddress = doctorData.clinic_address.trim();
          const addressParts = fullAddress.split(",").map(part => part.trim());
          
          if (addressParts.length >= 2) {
            clinic_area = addressParts[0];
            clinic_city = addressParts.slice(1).join(", ");
          } else if (addressParts.length === 1) {
            clinic_area = addressParts[0];
          }
        }

        setFormData({
          name: doctorData.name || "",
          gender: doctorData.gender || "",
          experience: doctorData.experience || 0,
          consultation_fees: doctorData.consultation_fees || 0,
          dob: doctorData.dob ? doctorData.dob.slice(0, 10) : "",
          specialization: doctorData.specialization || "",
          phone: doctorData.phone || "",
          clinic_area: clinic_area,
          clinic_city: clinic_city,
        });
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile data. Please try refreshing the page.",
          confirmButtonColor: "#3085d6",
        });
      }
    };

    fetchDoctorDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

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

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }
    
    if (!formData.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 22 || age > 80) {
        errors.dob = "Age must be between 22 and 80 years";
      }
    }
    
    if (!formData.gender) {
      errors.gender = "Gender is required";
    }
    
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(formData.phone)) {
      errors.phone = "Please enter a valid Indian mobile number";
    }
    
    if (!formData.experience && formData.experience !== 0) {
      errors.experience = "Experience is required";
    } else if (formData.experience < 0) {
      errors.experience = "Experience cannot be negative";
    } else if (formData.experience > 60) {
      errors.experience = "Experience cannot exceed 60 years";
    }
    
    if (!formData.specialization.trim()) {
      errors.specialization = "Specialization is required";
    } else if (formData.specialization.trim().length < 3) {
      errors.specialization = "Specialization must be at least 3 characters long";
    }
    
    if (!formData.consultation_fees && formData.consultation_fees !== 0) {
      errors.consultation_fees = "Consultation fees is required";
    } else if (formData.consultation_fees <= 0) {
      errors.consultation_fees = "Consultation fees must be greater than 0";
    } else if (formData.consultation_fees > 50000) {
      errors.consultation_fees = "Consultation fees cannot exceed ₹50,000";
    }
    
    if (!formData.clinic_area.trim()) {
      errors.clinic_area = "Clinic area is required";
    } else if (formData.clinic_area.trim().length < 3) {
      errors.clinic_area = "Clinic area must be at least 3 characters long";
    }
    
    if (!formData.clinic_city.trim()) {
      errors.clinic_city = "Clinic city is required";
    } else if (formData.clinic_city.trim().length < 2) {
      errors.clinic_city = "Clinic city must be at least 2 characters long";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const tabs = ["About", "Experience", "Address"];

  const handleUpdate = async () => {
    // Validate form before submission
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fix all validation errors before updating.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

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

    // Construct the complete clinic address
    const fullClinicAddress = formData.clinic_area.trim() && formData.clinic_city.trim() 
      ? `${formData.clinic_area.trim()}, ${formData.clinic_city.trim()}`
      : formData.clinic_area.trim() || formData.clinic_city.trim();

    const requestBody = {
      name: formData.name.trim(),
      experience: Number(formData.experience),
      consultation_fees: Number(formData.consultation_fees),
      gender: formData.gender,
      dob: formData.dob,
      specialization: formData.specialization.trim(),
      phone: formData.phone,
      clinic_address: fullClinicAddress,
    };

    try {
      const res = await axios.put(
        "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

      let errorMessage = "Failed to update profile. Please try again.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Invalid data provided. Please check all fields.";
      } else if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      }

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
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
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name: *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                disabled={activeTab !== "About"}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 text-sm ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {validationErrors.name && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Date Of Birth: *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                disabled={activeTab !== "About"}
                onChange={handleChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 22)).toISOString().split('T')[0]}
                className={`w-full border rounded-md p-2 text-sm ${
                  validationErrors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {validationErrors.dob && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.dob}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Gender: *
              </label>
              <select
                name="gender"
                value={formData.gender}
                disabled={activeTab !== "About"}
                onChange={handleChange}
                className={`w-full border rounded-md p-2 text-sm ${
                  validationErrors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.gender && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone No.: *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={activeTab !== "About"}
                maxLength={10}
                className={`w-full border rounded-md p-2 text-sm ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit phone number"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
              )}
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
              Years of Experience: *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              disabled={activeTab !== "Experience"}
              className={`w-full border rounded-md p-2 text-sm ${
                validationErrors.experience ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter years of experience"
            />
            {validationErrors.experience && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Specialization: *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              disabled={activeTab !== "Experience"}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-sm ${
                validationErrors.specialization ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="E.g., Cardiology, Pediatrics, etc."
            />
            {validationErrors.specialization && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.specialization}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Consultation Fees (₹): *
            </label>
            <input
              type="text"
              name="consultation_fees"
              value={formData.consultation_fees}
              disabled={activeTab !== "Experience"}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-sm ${
                validationErrors.consultation_fees ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter consultation fees"
            />
            {validationErrors.consultation_fees && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.consultation_fees}</p>
            )}
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
              Clinic Area / Street: *
            </label>
            <input
              type="text"
              name="clinic_area"
              value={formData.clinic_area}
              disabled={activeTab !== "Address"}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-sm ${
                validationErrors.clinic_area ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter clinic area or street"
            />
            {validationErrors.clinic_area && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.clinic_area}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">
              Clinic City and Pincode: *
            </label>
            <input
              type="text"
              name="clinic_city"
              value={formData.clinic_city}
              disabled={activeTab !== "Address"}
              onChange={handleChange}
              className={`w-full border rounded-md p-2 text-sm ${
                validationErrors.clinic_city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter clinic city and pincode"
            />
            {validationErrors.clinic_city && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.clinic_city}</p>
            )}
          </div>

          {/* Display Complete Address Preview */}
          {(formData.clinic_area || formData.clinic_city) && (
            <div className="mt-4 p-2 bg-blue-50 rounded-md">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Complete Address Preview:
              </label>
              <p className="text-sm text-gray-800">
                {formData.clinic_area && formData.clinic_city 
                  ? `${formData.clinic_area}, ${formData.clinic_city}`
                  : formData.clinic_area || formData.clinic_city}
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`mt-6 px-6 py-2 bg-[#5372A1] text-white rounded-full hover:bg-[#4a6491] transition-colors ${
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