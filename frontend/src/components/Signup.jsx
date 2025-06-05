import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import {
  MdPerson,
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdKeyboardArrowDown,
} from "react-icons/md";
import signupimg from "../assets/svg/login_img.svg";
import "../styles/SignupPage.css";
import Swal from "sweetalert2";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Available roles
  const roles = ["Doctor"];

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle role dropdown
  const toggleRoleDropdown = () => {
    setShowRoleOptions(!showRoleOptions);
  };

  // Select a role
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleOptions(false);
  };

  // Password criteria checks
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate form
    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      errors.password = "Password must meet all criteria";
    }
    if (!selectedRole) errors.role = "Please select a role";
    if (!agreedToTerms)
      errors.terms = "You must agree to the terms and conditions";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Form is valid, send data to API
    try {
      setIsLoading(true);
      // const response = await axios.post(
      //   "https://medisync-backend-up4v.onrender.com/user/register",
      //   {
      //     name,
      //     email,
      //     password,
      //     role: selectedRole,
      //   }
      // );
      const response = await fetch(`https://medisync-backend-up4v.onrender.com/user/sendOTP`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          checkForEmail: false,
        }),
      });
      if (response.status != 200) {
        setApiError("Some error occurred. Please check credentials");
        setTimeout(() => {
          setApiError("");
        }, 3000);
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: "There was an error creating your account. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
        navigate("/signup");
        return;
      }

      console.log("Gone to OTP page", response);
      // Show success message
      // alert("Account created successfully!");
      // Swal.fire({
      //   icon: "success",
      //   title: "Signup Successful",
      //   text: "Your account was created successfully",
      //   timer: 2000,
      //   showConfirmButton: false,
      // });
      // Redirect to login page after successful signup
      navigate("/verify-otp", {
        state: { name, email, password, role: selectedRole, isSignUp: true },
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data) {
        setApiError(error.response.data.error || "Registration failed");
      } else {
        setApiError("An error occurred during registration. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to login page
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-signup-bg bg-cover bg-center flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <Link
        to="/"
        className="absolute top-6 left-6 login-button px-6 py-2 rounded-full text-white font-semibold text-sm transition-all hover:-translate-y-1 focus:outline-none z-10"
      >
        Back to Home
      </Link>
      <div className="w-full h-full flex items-center justify-center">
        {/* Left side with title and image */}
        <div className="hidden md:flex md:w-3/5 h-full flex-col relative">
          <div className="absolute top-20 left-16 lg:left-24 z-10">
            <p className="text-white text-2xl lg:text-3xl font-semibold font-poppins">
              Welcome to
            </p>
            <p className="text-gradient text-6xl lg:text-8xl font-bold font-poppins -mt-2">
              MediSync!
            </p>
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/3 w-full flex justify-center">
            <img
              src={signupimg}
              alt="Signup illustration"
              className="w-4/5 max-w-4xl object-contain"
            />
          </div>
        </div>

        {/* Right side with signup form */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-gradient text-4xl md:text-5xl font-bold text-center mb-6 p-3">
              Sign Up
            </h1>

            {/* API Error Message */}
            {apiError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              {/* Role Selector */}
              <div className="relative mb-4">
                <button
                  type="button"
                  className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-left text-gray-600 font-medium flex justify-between items-center shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={toggleRoleDropdown}
                >
                  <span>{selectedRole || "Select Role"}</span>
                  <MdKeyboardArrowDown
                    className={`text-gray-500 text-xl transition-transform ${
                      showRoleOptions ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showRoleOptions && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-md z-10">
                    {roles.map((role) => (
                      <div
                        key={role}
                        className="py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRoleSelect(role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}

                {formErrors.role && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
                )}
              </div>

              {/* Input Fields */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                {/* Name Input*/}
                <div
                  className={`flex items-center border-b-2 ${
                    formErrors.name ? "border-red-500" : "border-gray-200"
                  } pb-2 mb-4`}
                >
                  <MdPerson className="text-gray-400 mr-3 text-xl" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 outline-none text-gray-700 bg-transparent"
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-xs mb-2">{formErrors.name}</p>
                )}

                {/* Email Input */}
                <div
                  className={`flex items-center border-b-2 ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  } pb-2 mb-4`}
                >
                  <MdEmail className="text-gray-400 mr-3 text-xl" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 outline-none text-gray-700 bg-transparent"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mb-2">
                    {formErrors.email}
                  </p>
                )}

                {/* Password Input */}
                <div
                  className={`flex items-center border-b-2 ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  } pb-2 mb-3`}
                >
                  <MdLock className="text-gray-400 mr-3 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-2 outline-none text-gray-700 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 focus:outline-none"
                  >
                    {showPassword ? (
                      <MdVisibility className="text-xl" />
                    ) : (
                      <MdVisibilityOff className="text-xl" />
                    )}
                  </button>
                </div>

                {formErrors.password && (
                  <p className="text-red-500 text-xs mb-2">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-600 text-sm font-medium mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  <li className={`text-xs flex items-center ${hasMinLength ? "text-green-500" : "text-gray-400"}`}>
                    <span className="mr-2">{hasMinLength ? "✓" : "○"}</span>
                    At least 8 characters
                  </li>
                  <li className={`text-xs flex items-center ${hasUpperCase ? "text-green-500" : "text-gray-400"}`}>
                    <span className="mr-2">{hasUpperCase ? "✓" : "○"}</span>
                    One uppercase letter
                  </li>
                  <li className={`text-xs flex items-center ${hasLowerCase ? "text-green-500" : "text-gray-400"}`}>
                    <span className="mr-2">{hasLowerCase ? "✓" : "○"}</span>
                    One lowercase letter
                  </li>
                  <li className={`text-xs flex items-center ${hasNumber ? "text-green-500" : "text-gray-400"}`}>
                    <span className="mr-2">{hasNumber ? "✓" : "○"}</span>
                    One number
                  </li>
                  <li className={`text-xs flex items-center ${hasSpecialChar ? "text-green-500" : "text-gray-400"}`}>
                    <span className="mr-2">{hasSpecialChar ? "✓" : "○"}</span>
                    One special character
                  </li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start mb-4">
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    className="custom-checkbox"
                    checked={agreedToTerms}
                    onChange={() => setAgreedToTerms(!agreedToTerms)}
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 text-sm text-gray-500 cursor-pointer"
                  >
                    I agree with the terms and conditions and privacy policy
                  </label>
                </div>
              </div>

              {formErrors.terms && (
                <p className="text-red-500 text-xs mb-4">{formErrors.terms}</p>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                className="signup-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Already have an account? Click{" "}
                <a
                  onClick={navigateToLogin}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  here
                </a>{" "}
                to log in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
