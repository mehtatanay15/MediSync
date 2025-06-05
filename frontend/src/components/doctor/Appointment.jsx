import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import search from "./images/Search.svg";
import { LocationDropdown, SidePanel } from "./DashBoard";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

// Status mapping for visual representation
const statusColors = {
  "Not Arrived": "#516E9C",
  Queued: "#FFC525",
  Ongoing: "#07A537",
  Completed: "#3B82F6",
  Delayed: "#EA4335",
};

// Main appointment component
export default function Appointment() {
  const navigate = useNavigate();
  const { authToken } = useAuth();
   const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Format: YYYY-MM-DD
  const [appointments, setAppointments] = useState({
    notArrived: [],
    queued: [],
    ongoing: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Fetch appointments based on selected date
  useEffect(() => {
    if (authToken) {
      fetchAppointments();
    }
  }, [selectedDate, authToken]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await authAxios.get(
        `https://medisync-backend-up4v.onrender.com/appointment/date?date=${selectedDate}`
      );

      if (response.data && response.data.appointments) {
        setAppointments(response.data.appointments);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments. Please try again.");
      setLoading(false);

      // Handle unauthorized access
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
          timer: 2000,
        }).then(() => {
          navigate("/login");
        });
      }
    }
  };

  // Handle appointment status updates
  const updateAppointmentStatus = async (appointmentId, isForward) => {
    try {
      const endpoint = isForward
        ? `https://medisync-backend-up4v.onrender.com/appointment/forward/${appointmentId}`
        : `https://medisync-backend-up4v.onrender.com/appointment/reverse/${appointmentId}`;

      await authAxios.put(endpoint);

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Appointment status has been ${
          isForward ? "advanced" : "reversed"
        } successfully.`,
        timer: 750,
        showConfirmButton: false,
      });

      // Refresh appointments after update
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status:", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Failed to update appointment status.",
      });

      // Handle unauthorized access
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
          timer: 2000,
        }).then(() => {
          navigate("/login");
        });
      }
    }
  };

  // Modify the viewPatientProfile function
  const viewPatientProfile = (patientId, appointmentId) => {
    navigate(`/doctor/patient/${patientId}`, {
      state: { appointmentId: appointmentId },
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

 const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to filter appointments based on search term
  const filterAppointments = (appointmentList) => {
    if (!searchTerm) return appointmentList;

    return appointmentList.filter(
      (appointment) =>
        appointment.patient_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.appointment_token
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  };

  // Reusable appointment list component
  const AppointmentList = ({ title, appointmentList, statusColor }) => {
    const filteredAppointments = filterAppointments(appointmentList || []);

    if (!appointmentList || appointmentList.length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <p className="text-[#4F678E] text-[28px] font-semibold my-6">
          {title} ({filteredAppointments.length})
        </p>
        <div className="flex flex-col rounded-[10px] border-[#567CBA] border-[1px]">
          <div className="flex text-[#567CBA] text-[14px] text-center mb-4 pt-6">
            <span className="w-1/12">SR. NO.</span>
            <span className="w-2/12">TOKEN NUMBER</span>
            <span className="w-3/12">NAME</span>
            <span className="w-1/12">AGE</span>
            <span className="w-2/12">REGION</span>
            <span className="w-2/12">STATUS</span>
            <span className="w-1/12">ACTIONS</span>
          </div>

          {filteredAppointments.length > 0 ? (
            filteredAppointments
              .sort(
                (a, b) =>
                  a.appointment_token.substring(
                    a.appointment_token.lastIndexOf("-") + 1
                  ) -
                  b.appointment_token.substring(
                    b.appointment_token.lastIndexOf("-") + 1
                  )
              )
              .map((appointment, index) => (
                <div
                  key={appointment._id}
                  className="w-full flex items-center text-[12px] text-[#464F60] h-[7vh] text-center mb-2"
                >
                  <span className="w-1/12">{index + 1}</span>
                  <span className="w-2/12">
                    {appointment.appointment_token.substring(
                      appointment.appointment_token.lastIndexOf("-") + 1
                    )}
                  </span>
                  <span
                    className="w-3/12 underline text-blue-600 cursor-pointer"
                    onClick={() =>
                      viewPatientProfile(appointment.patient, appointment._id)
                    }
                  >
                    {appointment.patient_name}
                  </span>
                  <span className="w-1/12">{appointment.patient_age}</span>
                  <span className="w-2/12">{appointment.region}</span>
                  <span className="w-2/12 text-white">
                    <span
                      className="inline-block rounded-full px-3 py-1"
                      style={{
                        backgroundColor: statusColors[appointment.status],
                      }}
                    >
                      {appointment.status}
                    </span>
                  </span>
                  <span className="w-1/12 flex justify-center space-x-2">
                    {/* Status update buttons */}
                    {appointment.status !== "Not Arrived" && (
                      <button
                        className="bg-gray-500 cursor-pointer text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, false)
                        }
                        title="Move to previous status"
                      >
                        ←
                      </button>
                    )}

                    {appointment.status !== "Completed" && (
                      <button
                        className="bg-blue-500 cursor-pointer text-white rounded-full w-6 h-6 flex items-center justify-center"
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, true)
                        }
                        title="Move to next status"
                      >
                        →
                      </button>
                    )}
                    {/* Emergency indicator */}
                    {appointment.emergency && (
                      <span className="text-red-500 font-bold">⚠️</span>
                    )}
                  </span>
                </div>
              ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No matching appointments found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Side Panel */}
      <div className="w-[15vw]">
        <SidePanel propActiveButton="appointment" />
      </div>

      <div className="flex flex-col w-[85vw]">
        {/* Navigation bar */}
        <nav className="flex mt-4 justify-between pr-3">
        

          {/* Date Filter */}
          <div className="flex ml-auto mr-4">
            <div className="flex flex-col">
              <label className="text-[#4F678E] text-sm mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border border-[#567CBA] rounded-md px-3 py-1"
              />
            </div>
          </div>
        </nav>

        <div className="main w-[81vw] mt-5 p-5 mx-auto rounded-[20px]">
          {loading ? (
            <div className="text-center py-10">
              <p>Loading appointments...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <div>
              <AppointmentList
                title="Not Arrived Appointments"
                appointmentList={appointments.notArrived}
              />
              <AppointmentList
                title="Queued Appointments"
                appointmentList={appointments.queued}
              />
              <AppointmentList
                title="Ongoing Appointments"
                appointmentList={appointments.ongoing}
              />
              <AppointmentList
                title="Completed Appointments"
                appointmentList={appointments.completed}
              />

              {Object.values(appointments).every((arr) => arr.length === 0) && (
                <div className="text-center py-10">
                  <p>No appointments found for this date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
