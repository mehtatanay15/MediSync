import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add this
  const [userInfo, setUserInfo] = useState("");

  const navigate = useNavigate();

  // Helper function to decode JWT token
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.payload || decoded;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = Cookies.get("authToken");

      if (storedToken) {
        const userData = decodeToken(storedToken);
        // console.log(userData);

        if (userData) {
          let profileComplete = userData.profileComplete || false;

          if (userData.role === "Doctor") {
            try {
              const response = await axios.get(
                "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                  },
                }
              );

              profileComplete =
                response.data && Object.keys(response.data).length > 0;
              userData.profileComplete = profileComplete;
            } catch (error) {
              console.log("Profile check error on refresh:", error);
              profileComplete = false;
              userData.profileComplete = false;
            }
          }

          setAuthToken(storedToken);
          setAuthUser(userData);
          localStorage.setItem("userRole", userData.role);
          localStorage.setItem("profileComplete", profileComplete);
        } else {
          handleLogout(false);
        }
      }

      setIsLoading(false);
    };
    // Check if doctor has completed profile
    const checkDoctorProfile = async () => {
      const storedToken = Cookies.get("authToken");
      try {
        const response = await axios.get(
          "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        // If we get a successful response, the profile exists
        // console.log(response);
        // const name = response.data.user.name;
        if (response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.log("Profile check error:", error);
      }
    };
    initializeAuth();
    checkDoctorProfile();
  }, []);

  const login = async (token, user, redirectBasedOnRole = true) => {
    const userData = decodeToken(token);

    if (!userData) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid authentication token",
      });
      return;
    }

    // Set token in cookie with secure settings
    Cookies.set("authToken", token, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Update auth token state
    setAuthToken(token);

    // For doctors, check if profile is complete
    let profileComplete = userData.profileComplete || false;

    if (userData.role === "Doctor") {
      try {
        // Check if doctor profile exists
        const response = await axios.get(
          "https://medisync-backend-up4v.onrender.com/user/doctor/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        profileComplete =
          response.data && Object.keys(response.data).length > 0;

        userData.profileComplete = profileComplete;
      } catch (error) {
        console.log("Profile check error:", error);
        profileComplete = false;
        userData.profileComplete = false;
      }
    }

    setAuthUser(userData);
    setUserInfo(user);
    // Store role for quick access
    localStorage.setItem("userRole", userData.role);
    localStorage.setItem("profileComplete", profileComplete);

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome back`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Redirect based on role
    if (redirectBasedOnRole) {
      if (userData.role === "Doctor" && !profileComplete) {
        navigate("/doctor-registration");
      } else if (userData.role === "Doctor") {
        navigate("/doctor");
      }
    }
  };

  // Handle logout
  const handleLogout = (showConfirmation = true) => {
    const performLogout = () => {
      setAuthUser(null);
      setAuthToken(null);

      // Clear cookies and storage
      Cookies.remove("authToken");
      localStorage.removeItem("userRole");

      if (showConfirmation) {
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out.",
          timer: 1500,
          showConfirmation: false,
        });
      }

      navigate("/login");
    };

    if (showConfirmation) {
      Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          performLogout();
        }
      });
    } else {
      performLogout();
    }
  };

  // Check if the current user is authenticated and token is valid
  const isAuthenticated = () => {
    if (!authToken) return false;

    const userData = decodeToken(authToken);
    if (!userData) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return userData.exp > currentTime;
  };

  // Check if user has completed profile
  const hasCompletedProfile = () => {
    if (!authUser) return false;

    if (authUser.role !== "Doctor") return true;

    return authUser.profileComplete === true;
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        authToken,
        isAuthenticated,
        hasCompletedProfile,
        login,
        userInfo,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
