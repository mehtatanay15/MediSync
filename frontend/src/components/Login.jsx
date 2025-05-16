import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdKeyboardArrowDown,
} from "react-icons/md";
import loginimg from "../assets/svg/login_img.svg";
import "../styles/LoginPage.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleOptions, setShowRoleOptions] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Available roles - matching the signup component
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

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate form
    const errors = {};
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (!selectedRole) errors.role = "Please select a role";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Form is valid, send data to API
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://medisync-backend-up4v.onrender.com/user/login",
        {
          email,
          password,
          role: selectedRole,
        }
      );

      console.log("Login successful:", response.data);

      // Get token from response
      const token = response.data.token;
      const user = response.data.user;

      // Call the login function from AuthContext with the token
      // The AuthContext will handle decoding the token and routing
      login(token, user);
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        setApiError(error.response.data.error || "Login failed");
      } else {
        setApiError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to signup page
  const navigateToSignup = () => {
    navigate("/signup");
  };

  // Navigate to forgot password page
  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="h-screen w-screen bg-login-bg bg-cover bg-center flex items-center justify-center overflow-x-hidden overflow-y-auto">
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
              src={loginimg}
              alt="Login illustration"
              className="w-4/5 max-w-4xl object-contain"
            />
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-gradient text-4xl md:text-5xl font-bold text-center mb-6 p-3">
              Login
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

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a
                    onClick={navigateToForgotPassword}
                    className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    forgot password?
                  </a>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-start mb-4">
                <div className="flex items-start">
                  <input
                    id="remember"
                    type="checkbox"
                    className="custom-checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-500 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="login-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Not a user? Click{" "}
                <a
                  onClick={navigateToSignup}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  here
                </a>{" "}
                to sign up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
