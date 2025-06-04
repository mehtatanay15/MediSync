import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link} from "react-router-dom";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdKeyboardArrowRight,
  MdPassword,
} from "react-icons/md";
import resetImg from "../assets/svg/login_img.svg"; // You can use the same image or a different one
import "../styles/LoginPage.css"; // Using the same CSS file

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure the user has been verified
  // const email = location.state?.email || "";
  // const verified = location.state?.verified || false;
  const { email, verified = false, otp } = location.state;

  // Redirect if not verified
  useEffect(() => {
    if (!verified) {
      navigate("/forgot-password");
    }
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  // Toggle password visibility
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password criteria checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};

    // Check if passwords meet criteria
    if (!newPassword) errors.newPassword = "New password is required";
    else if (newPassword.length < 8)
      errors.newPassword = "Password must be at least 8 characters";
    else if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      errors.newPassword = "Password must meet all criteria";
    }

    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== newPassword)
      errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Form is valid, reset password
    console.log("Resetting password for:", email);
    const response = await fetch("https://medisync-backend-up4v.onrender.com/user/resetPassword", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp: otp.join(""),
        newPassword,
      }),
    });
    console.log(response);
    // Show success message and redirect after delay
    if (response.status == 200) {
      setResetSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    }
  };

  // Navigate back to login page
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-login-bg bg-cover bg-center flex items-center justify-center overflow-x-hidden overflow-y-auto">
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
              Create a
            </p>
            <p className="text-gradient text-6xl lg:text-8xl font-bold font-poppins -mt-2">
              New Password
            </p>
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/3 w-full flex justify-center">
            <img
              src={resetImg}
              alt="Reset password illustration"
              className="w-4/5 max-w-4xl object-contain"
            />
          </div>
        </div>

        {/* Right side with change password form */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            {resetSuccess ? (
              <div className="text-center py-8">
                <div className="mb-6 flex justify-center">
                  <MdCheckCircle className="text-green-500 text-7xl" />
                </div>
                <h2 className="text-gradient text-3xl font-bold mb-4">
                  Password Reset Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your password has been changed successfully. Redirecting to
                  login page...
                </p>
                <button
                  onClick={navigateToLogin}
                  className="login-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none"
                >
                  Login Now
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-gradient text-4xl md:text-5xl font-bold text-center mb-2 p-3">
                  Reset Password
                </h1>
                <p className="text-gray-500 text-center mb-8">
                  Create a new secure password
                </p>

                <form onSubmit={handleSubmit} className="w-full">
                  {/* Input Fields */}
                  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    {/* New Password Input */}
                    <div
                      className={`flex items-center border-b-2 ${
                        formErrors.newPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      } pb-2 mb-4`}
                    >
                      <MdLock className="text-gray-400 mr-3 text-xl" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full py-2 outline-none text-gray-700 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="text-gray-400 focus:outline-none"
                      >
                        {showNewPassword ? (
                          <MdVisibility className="text-xl" />
                        ) : (
                          <MdVisibilityOff className="text-xl" />
                        )}
                      </button>
                    </div>
                    {formErrors.newPassword && (
                      <p className="text-red-500 text-xs mb-2">
                        {formErrors.newPassword}
                      </p>
                    )}

                    {/* Confirm Password Input */}
                    <div
                      className={`flex items-center border-b-2 ${
                        formErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-200"
                      } pb-2 mb-4`}
                    >
                      <MdLock className="text-gray-400 mr-3 text-xl" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-2 outline-none text-gray-700 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-gray-400 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <MdVisibility className="text-xl" />
                        ) : (
                          <MdVisibilityOff className="text-xl" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mb-2">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Password must contain:
                    </p>
                    <ul className="space-y-1">
                      <li
                        className={`text-xs flex items-center ${
                          hasMinLength ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-2">{hasMinLength ? "✓" : "○"}</span>
                        At least 8 characters
                      </li>
                      <li
                        className={`text-xs flex items-center ${
                          hasUpperCase ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-2">{hasUpperCase ? "✓" : "○"}</span>
                        One uppercase letter
                      </li>
                      <li
                        className={`text-xs flex items-center ${
                          hasLowerCase ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-2">{hasLowerCase ? "✓" : "○"}</span>
                        One lowercase letter
                      </li>
                      <li
                        className={`text-xs flex items-center ${
                          hasNumber ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-2">{hasNumber ? "✓" : "○"}</span>
                        One number
                      </li>
                      <li
                        className={`text-xs flex items-center ${
                          hasSpecialChar ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        <span className="mr-2">
                          {hasSpecialChar ? "✓" : "○"}
                        </span>
                        One special character
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="login-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none flex items-center justify-center"
                  >
                    Reset Password
                    <MdKeyboardArrowRight className="ml-1 text-xl" />
                  </button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center text-sm text-gray-500 mt-6">
                  <p>
                    Remember your password?{" "}
                    <a
                      onClick={navigateToLogin}
                      className="text-blue-600 font-medium cursor-pointer hover:underline"
                    >
                      Login here
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
