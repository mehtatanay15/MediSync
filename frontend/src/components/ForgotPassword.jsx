import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdKeyboardArrowRight } from "react-icons/md";
import forgotImg from "../assets/svg/login_img.svg"; // You can use the same image or a different one
import "../styles/LoginPage.css"; // Using the same CSS file
import Swal from "sweetalert2";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setTimeout(() => {
        setFormErrors({});
      }, 3000);
      return;
    }
    console.log("here");
    // Form is valid, proceed to OTP verification
    const response = await fetch(`https://medisync-backend-up4v.onrender.com/user/sendOTP`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        checkForEmail: true,
      }),
    });
    if (response.status != 200) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: "There was an error creating your account. Please try again.",
        timer: 5000,
        showConfirmButton: false,
      });
      navigate("/login");
      return;
    }
    navigate("/verify-otp", { state: { email, isForgotPassword: true } });
  };

  // Navigate back to login page
  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-login-bg bg-cover bg-center flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="w-full h-full flex items-center justify-center">
        {/* Left side with title and image */}
        <div className="hidden md:flex md:w-3/5 h-full flex-col relative">
          <div className="absolute top-20 left-16 lg:left-24 z-10">
            <p className="text-white text-2xl lg:text-3xl font-semibold font-poppins">
              Forgot your
            </p>
            <p className="text-gradient text-6xl lg:text-8xl font-bold font-poppins -mt-2">
              Password?
            </p>
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/3 w-full flex justify-center">
            <img
              src={forgotImg}
              alt="Forgot password illustration"
              className="w-4/5 max-w-4xl object-contain"
            />
          </div>
        </div>

        {/* Right side with forgot password form */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-gradient text-4xl md:text-5xl font-bold text-center mb-2 p-3">
              Forgot Password
            </h1>
            <p className="text-gray-500 text-center mb-8">
              Enter your email address to receive a verification code
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              {/* Input Fields */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                {/* Email Input */}
                <div
                  className={`flex items-center border-b-2 ${
                    formErrors.email ? "border-red-500" : "border-gray-200"
                  } pb-2 mb-2`}
                >
                  <MdEmail className="text-gray-400 mr-3 text-xl" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-2 outline-none text-gray-700 bg-transparent"
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-1">**{errorMessage}</p>
                )}
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    **{formErrors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none flex items-center justify-center"
              >
                Send Verification Code
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
          </div>
        </div>
      </div>
    </div>
  );
}
