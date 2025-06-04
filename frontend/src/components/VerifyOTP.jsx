import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import otpImg from "../assets/svg/login_img.svg"; // You can use the same image or a different one
import "../styles/LoginPage.css"; // Using the same CSS file
import Swal from "sweetalert2";
import axios from "axios";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  // const email = location.state?.email || "";
  const {
    email,
    name,
    password,
    role,
    isSignUp = false,
    isForgotPassword = false,
  } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  // Updated to have 6 refs instead of 4
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];

  // Start countdown timer
  useEffect(() => {
    let interval = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // If pasted content, distribute across boxes
      const pasteData = value.slice(0, 6).split("");
      const newOtp = [...otp];

      pasteData.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });

      setOtp(newOtp);

      // Focus on the next input
      const nextIndex = Math.min(index + pasteData.length, 5);
      if (nextIndex < 6) inputRefs[nextIndex].current.focus();
    } else {
      // Handle single character input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if current one is filled
      if (value !== "" && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setIsTimerActive(true);
    setFormErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};
    if (otp.some((digit) => digit === "")) {
      errors.otp = "Please enter the complete verification code";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    // Form is valid, proceed to change password
    console.log(email, otp.join(""), isSignUp);
    const response = await fetch("https://medisync-backend-up4v.onrender.com/user/verifyOTP", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp: otp.join(""),
        checkForEmail: !isSignUp,
      }),
    });
    if (response.status != 200) {
      setFormErrors({
        otp: "Invalid OTP or OTP expired. Please try again. Redirecting...",
      });
      setTimeout(
        () =>
          navigate(
            isSignUp
              ? "/signup"
              : isForgotPassword
              ? "/forgot-password"
              : "/login"
          ),
        5000
      );
      return;
    }
    if (isSignUp) {
      const response = await fetch(
        "https://medisync-backend-up4v.onrender.com/user/register",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            role,
          }),
        }
      );
      if (response.status == 201) {
        // Show success message
        alert("Account created successfully!");
        Swal.fire({
          icon: "success",
          title: "Signup Successful",
          text: "Your account was created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
        return;
        // Redirect to login page after successful signup
      } else {
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
    }
    if (isForgotPassword) {
      navigate("/change-password", { state: { email, verified: true, otp } });
    }
  };

  // Navigate back to forgot password page
  const navigateBack = () => {
    if (isForgotPassword) navigate("/forgot-password");
    else navigate("/signup");
  };

  return (
    <div className="h-screen w-screen bg-login-bg bg-cover bg-center flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="w-full h-full flex items-center justify-center">
        {/* Left side with title and image */}
        <div className="hidden md:flex md:w-3/5 h-full flex-col relative">
          <div className="absolute top-20 left-16 lg:left-24 z-10">
            <p className="text-white text-2xl lg:text-3xl font-semibold font-poppins">
              Verify
            </p>
            <p className="text-gradient text-6xl lg:text-8xl font-bold font-poppins -mt-2">
              Your Email
            </p>
          </div>
          <div className="absolute top-1/2 transform -translate-y-1/3 w-full flex justify-center">
            <img
              src={otpImg}
              alt="OTP verification illustration"
              className="w-4/5 max-w-4xl object-contain"
            />
          </div>
        </div>

        {/* Right side with OTP verification form */}
        <div className="w-full md:w-2/5 h-full flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-gradient text-4xl md:text-5xl font-bold text-center mb-2 p-3">
              Verification
            </h1>
            <p className="text-gray-500 text-center mb-2">
              We have sent a code to
            </p>
            <p className="text-blue-600 font-medium text-center mb-8">
              {email}
            </p>

            <form onSubmit={handleSubmit} className="w-full">
              {/* OTP Input Fields */}
              <div className="mb-6">
                <div className="flex justify-center gap-3 mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      ref={inputRefs[index]}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-13 h-13 text-center text-xl font-bold rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:outline-none"
                      maxLength={1}
                    />
                  ))}
                </div>
                {formErrors.otp && (
                  <p className="text-red-500 text-xs text-center mt-1">
                    {formErrors.otp}
                  </p>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="text-center mb-6">
                {isTimerActive ? (
                  <p className="text-gray-500">
                    Resend code in{" "}
                    <span className="text-blue-600 font-medium">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-button w-full py-3 rounded-full text-white font-semibold text-base transition-all hover:-translate-y-1 focus:outline-none flex items-center justify-center"
              >
                Verify Code
                <MdKeyboardArrowRight className="ml-1 text-xl" />
              </button>
            </form>

            {/* Back Link */}
            <div className="text-center text-sm text-gray-500 mt-6">
              <p>
                <a
                  onClick={navigateBack}
                  className="text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  {isForgotPassword && "Back to forgot password"}
                  {isSignUp && "Back to signup"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
