import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import "../../styles/LoginPage.css";

const DoctorRegistrationForm = () => {
  const navigate = useNavigate();
  const { authUser, authToken, setAuthUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const totalSteps = 3;

  // State for form data
  const [formData, setFormData] = useState({
    gender: "",
    name: "",
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
    
    // Clear validation error for this field when user starts typing
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
          [name]: numericValue === "" ? "" : Number(numericValue),
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Comprehensive validation function
  const validateForm = () => {
    const errors = {};
    
    // Step 1 validations
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
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
        errors.dob = "Doctor must be between 22 and 80 years old";
      }
    }
    
    if (!formData.gender) {
      errors.gender = "Gender selection is required";
    }
    
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    } else if (!/^[6-9]/.test(formData.phone)) {
      errors.phone = "Please enter a valid Indian mobile number";
    }
    
    // Step 2 validations
    if (!formData.experience && formData.experience !== 0) {
      errors.experience = "Years of experience is required";
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
    
    // Step 3 validations
    if (!formData.clinic_area.trim()) {
      errors.clinic_area = "Clinic area/street is required";
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

  // Validate current step before moving to next
  const validateCurrentStep = () => {
    const errors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) errors.name = "Full name is required";
      if (!formData.dob) errors.dob = "Date of birth is required";
      if (!formData.gender) errors.gender = "Gender selection is required";
      if (!formData.phone) errors.phone = "Phone number is required";
      else if (formData.phone.length !== 10) errors.phone = "Phone number must be exactly 10 digits";
    } else if (currentStep === 2) {
      if (!formData.experience && formData.experience !== 0) errors.experience = "Years of experience is required";
      if (!formData.specialization.trim()) errors.specialization = "Specialization is required";
      if (!formData.consultation_fees && formData.consultation_fees !== 0) errors.consultation_fees = "Consultation fees is required";
    } else if (currentStep === 3) {
      if (!formData.clinic_area.trim()) errors.clinic_area = "Clinic area/street is required";
      if (!formData.clinic_city.trim()) errors.clinic_city = "Clinic city is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const moveToNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const moveToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear validation errors when going back
      setValidationErrors({});
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate entire form before submission
  if (!validateForm()) {
    // Get all validation error messages
    const errorMessages = Object.values(validationErrors).filter(error => error);
    const errorText = errorMessages.length > 0 
      ? `Please fix the following errors:\n• ${errorMessages.join('\n• ')}`
      : "Please fix all validation errors before submitting.";
    
    Swal.fire({
      icon: "error",
      title: "Validation Error",
      text: errorText,
      confirmButtonColor: "#3085d6",
    });
    return;
  }
  
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

  // Create request body matching the expected format
  const requestBody = {
    user: authUser._id,
    name: formData.name.trim(),
    experience: Number(formData.experience),
    consultation_fees: Number(formData.consultation_fees),
    gender: formData.gender,
    dob: formData.dob,
    specialization: formData.specialization.trim(),
    phone: formData.phone,
    clinic_address: `${formData.clinic_area.trim()}, ${formData.clinic_city.trim()}`,
  };

  console.log('Request body:', requestBody);

  try {
    // Create doctor profile
    const res = await axios.post(
      "https://medisync-backend-up4v.onrender.com/user/doctor/register",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Registration response:', res.data); // Debug log

    // Check if registration was successful
    if (res.status === 201) {
      // Update user data in cookies to include profile completion status
      const updatedUserData = {
        ...authUser,
        profileComplete: true,
      };
      // Cookies.set("userData", JSON.stringify(updatedUserData));
      setAuthUser(updatedUserData);
      
      Swal.fire({
        icon: "success",
        title: "Registration Complete!",
        text: "Your doctor profile has been created successfully.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        // Redirect to doctor dashboard after user clicks OK
        navigate("/doctor");
      });
    } else {
      // Unexpected response format
      throw new Error("Unexpected response format");
    }

  } catch (err) {
    console.error("Registration failed", err);
    console.error("Error response:", err.response?.data);

    let errorMessage = "Failed to create doctor profile. Please try again.";
    let errorTitle = "Registration Failed";
    
    // Handle specific error cases
    if (err.response?.status === 409 || 
        err.response?.data?.error === "Doctor profile already created" || 
        (err.response?.data?.message && err.response.data.message.includes("already created"))) {
      
      // Doctor profile already exists - redirect to dashboard
      Swal.fire({
        icon: "info",
        title: "Profile Already Exists",
        text: "Your doctor profile has already been created. Redirecting to dashboard...",
        confirmButtonColor: "#3085d6",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => {
        // Update user data to reflect profile completion
        const updatedUserData = {
          ...authUser,
          profileComplete: true,
        };
        Cookies.set("userData", JSON.stringify(updatedUserData));
        setAuthUser(updatedUserData);
        navigate("/doctor");
      });
      
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.response?.status === 400) {
      errorMessage = "Invalid data provided. Please check all fields and try again.";
    } else if (err.response?.status === 401) {
      errorMessage = "Authentication failed. Please log in again.";
      errorTitle = "Authentication Error";
    } else if (err.response?.status === 500) {
      errorMessage = "Server error occurred. Please try again later.";
      errorTitle = "Server Error";
    } else if (!err.response) {
      errorMessage = "Network error. Please check your internet connection and try again.";
      errorTitle = "Connection Error";
    } else {
      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
    }
  } finally {
    setLoading(false);
  }
};
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
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your full name"
                  required
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 22)).toISOString().split('T')[0]}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.dob ? 'border-red-500' : ''
                  }`}
                  required
                />
                {validationErrors.dob && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.dob}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.gender ? 'border-red-500' : ''
                  }`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not say">Prefer not say</option>
                </select>
                {validationErrors.gender && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.phone ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your 10-digit phone number"
                  required
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                )}
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
                  Years of Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.experience ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter years of experience"
                  required
                />
                {validationErrors.experience && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.specialization ? 'border-red-500' : ''
                  }`}
                  placeholder="E.g., Cardiology, Pediatrics, etc."
                  required
                />
                {validationErrors.specialization && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.specialization}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Consultation Fees (₹) *
                </label>
                <input
                  type="text"
                  name="consultation_fees"
                  value={formData.consultation_fees}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.consultation_fees ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter consultation fees"
                  required
                />
                {validationErrors.consultation_fees && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.consultation_fees}</p>
                )}
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
                  Clinic Area / Street *
                </label>
                <input
                  type="text"
                  name="clinic_area"
                  value={formData.clinic_area}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.clinic_area ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter clinic area or street"
                  required
                />
                {validationErrors.clinic_area && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.clinic_area}</p>
                )}
              </div>

              <div className="border-b-2 border-gray-200 pb-2 mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1 font-poppins">
                  Clinic City and Pincode *
                </label>
                <input
                  type="text"
                  name="clinic_city"
                  value={formData.clinic_city}
                  onChange={handleChange}
                  className={`w-full py-2 outline-none text-gray-700 bg-transparent font-poppins ${
                    validationErrors.clinic_city ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter clinic city and pincode"
                  required
                />
                {validationErrors.clinic_city && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.clinic_city}</p>
                )}
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
          <p className="text-center text-sm text-gray-600 font-poppins">
            Step {currentStep} of {totalSteps}
          </p>
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
  const [checkingProfile, setCheckingProfile] = useState(true);

  // Check if user is already registered
  useEffect(() => {
    const checkDoctorProfile = async () => {
      try {
        // If user has already completed profile, redirect to dashboard
        if (authUser?.profileComplete) {
          navigate("/doctor");
          return;
        }

       
      } catch (error) {
        // Profile doesn't exist, show registration form
        console.log("No existing profile found, showing registration form");
      } finally {
        setCheckingProfile(false);
      }
    };

    if (authUser) {
      checkDoctorProfile();
    }
  }, [authUser, navigate]);

  // Show loading while checking profile status
  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-login-bg bg-cover bg-center flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#567CBA] mx-auto mb-4"></div>
          <p className="text-gray-600 font-poppins">Checking profile status...</p>
        </div>
      </div>
    );
  }

  return <DoctorRegistrationForm />;
};

export default DoctorRegistration;