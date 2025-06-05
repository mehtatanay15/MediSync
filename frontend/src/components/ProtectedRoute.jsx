import { useAuth } from "../context/AuthContext";

// Spinner.js
import { motion } from "framer-motion";

export const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <motion.p
        className="mt-4 text-blue-600 text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

const ProtectedRoute = ({ allowedRoles, requireProfile = true, children }) => {
  const { authUser, isAuthenticated, hasCompletedProfile, isLoading } =
    useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(authUser.role)
  ) {
    return <Navigate to="/" />;
  }

  if (requireProfile && authUser.role === "Doctor" && !hasCompletedProfile()) {
    return <Navigate to="/doctor-registration" />;
  }

  return children;
};
export default ProtectedRoute;
