import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/LoginPage.css"; // Import the CSS file with your custom styles

const DoctorRegistrationForm = () => {
  const navigate = useNavigate();
  const { authUser, authToken, setAuthUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 3;

  // State for form data
  const [formData, setFormData] = useState({
    gender: "",
    experience: "",
    consultation_fees: "",
    dob: "",
    specialization: "",
    phone: "",
    clinic_area: "",
    clinic_city: "",
  });

  // Handle form field changes
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

  const moveToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const moveToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Get user ID from auth context
    if (!authUser || !authToken) {
      Swal.fire({
        icon: "warning",
        title: "Authentication Required",
        text: "Please log in again to complete registration.",
        confirmButtonColor: "#3085d6",
      });
      setLoading(false);
      return;
    }

    // Create request body
    const requestBody = {
      user: authUser._id,
      experience: formData.experience,
      consultation_fees: formData.consultation_fees,
      gender: formData.gender,
      dob: formData.dob,
      specialization: formData.specialization,
      phone: formData.phone,
      clinic_address: `${formData.clinic_area}, ${formData.clinic_city}`,
    };

    try {
      // Create doctor profile
      const res = await axios.post(
        "https://medisync-backend-up4v.onrender.com/user/doctor/register",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Update user data in cookies to include profile completion status
      const updatedUserData = {
        ...authUser,
        profileComplete: true,
      };
      Cookies.set("userData", JSON.stringify(updatedUserData));
      setAuthUser(updatedUserData);
      Swal.fire({
        icon: "success",
        title: "Registration Complete!",
        text: "Your doctor profile has been created successfully.",
        confirmButtonColor: "#3085d6",
      });

      // Redirect to doctor dashboard
      navigate("/doctor");
    } catch (err) {
      console.error("Registration failed", err);

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          err.response?.data?.message ||
          "Failed to create doctor profile. Please try again.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 font-poppins">
              Personal Information
            </h2>

            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  required
                />
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  placeholder="Enter your 10-digit phone number"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 font-poppins">
              Professional Information
            </h2>

            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  required
                />
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  placeholder="E.g., Cardiology, Pediatrics, etc."
                  required
                />
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Consultation Fees (₹)
                </label>
                <input
                  type="text"
                  name="consultation_fees"
                  value={formData.consultation_fees}
                  onChange={handleChange}
                  min="0"
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 font-poppins">
              Additional Information
            </h2>

            <div className="bg-white rounded-xl shadow-md p-4 mb-4">
              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Clinic Area / Street
                </label>
                <input
                  type="text"
                  name="clinic_area"
                  value={formData.clinic_area}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  placeholder="Enter clinic area or street"
                  required
                />
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Clinic City and Pincode
                </label>
                <input
                  type="text"
                  name="clinic_city"
                  value={formData.clinic_city}
                  onChange={handleChange}
                  className="w-full py-2 outline-none text-gray-700 bg-transparent font-poppins"
                  placeholder="Enter clinic city and pincode"
                  required
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-login-bg bg-cover bg-center flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <h1 className="text-gradient text-3xl font-bold text-center mb-6 font-poppins">
            Build your profile
          </h1>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`h-2 w-1/3 rounded-full ${
                  index + 1 <= currentStep
                    ? "bg-gradient-to-r from-[#567CBA] to-[#67B5B0]"
                    : "bg-gray-200"
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="py-4">{renderStepContent()}</div>

        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={moveToPrevious}
              className="py-2 px-6 border border-[#567CBA] text-[#567CBA] rounded-full hover:bg-blue-50 transition-colors font-poppins"
            >
              Back
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={moveToNext}
              className={`login-button py-2 px-10 text-white rounded-full transition-all hover:-translate-y-1 font-poppins ${
                currentStep > 1 ? "ml-auto" : "w-full"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`login-button py-2 px-8 text-white rounded-full transition-all hover:-translate-y-1 font-poppins ml-auto ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Complete Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DoctorRegistration = () => {
  const { authUser } = useAuth();
  const navigate = useNavigate();

  // Check if user is already registered
  useEffect(() => {
    // If user has already completed profile, redirect to dashboard
    if (authUser?.profileComplete) {
      navigate("/doctor");
    }
  }, [authUser, navigate]);

  return <DoctorRegistrationForm />;
};

export default DoctorRegistration;
