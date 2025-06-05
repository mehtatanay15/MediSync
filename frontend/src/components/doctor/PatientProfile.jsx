import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  RiHistoryLine,
  RiFileTextLine,
  RiTimeLine,
  RiUserLine,
  RiSearchLine,
  RiAddLine,
  RiEditLine,
} from "react-icons/ri";
import { SidePanel, LocationDropdown } from "./DashBoard";
import "../../styles/Dashboard.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

const getInitials = (name) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

// Component for patient's basic info
const PatientBasicInfo = ({ patient }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const initials = getInitials(patient.name);

  return (
    <div className="flex flex-col items-center">
      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-100 mb-3 flex items-center justify-center bg-blue-100 text-[#4F678E] text-3xl font-bold">
        {patient.profilePicture ? (
          <img
            src={patient.profilePicture}
            alt={patient.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = null;
              e.target.parentNode.innerText = initials;
            }}
          />
        ) : (
          initials
        )}
      </div>
      <h2 className="text-xl font-semibold text-[#4F678E]">{patient.name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        Last Visited on: {formatDate(patient.lastVisit || patient.updatedAt)}
      </p>

      <div className="flex flex-col w-full gap-3 mt-4">
        <StatsIndicator
          icon={<RiTimeLine />}
          text={`${patient.visitCount || 1} Times`}
        />
        <StatsIndicator
          icon={<RiUserLine />}
          text={`${patient.age || "N/A"} Yrs, ${patient.gender || "N/A"}`}
        />
      </div>
    </div>
  );
};

const StatsIndicator = ({ icon, text }) => {
  return (
    <div className="flex items-center justify-center bg-blue-50 p-3 rounded-lg">
      <span className="text-[#5B81BC] mr-2">{icon}</span>
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

// Contact details component
const ContactDetails = ({ phone, email }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-[#4F678E] mb-3">
        Contact Details
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="mb-2">
          <span className="font-medium">Phone No.:</span> {phone || "N/A"}
        </p>
        <p>
          <span className="font-medium">Email ID:</span> {email || "N/A"}
        </p>
      </div>
    </div>
  );
};

// Tab navigation component
const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 mb-4">
      <div className="flex">
        <TabButton
          isActive={activeTab === "medical"}
          onClick={() => setActiveTab("medical")}
          icon={<RiHistoryLine />}
          text="Medical History"
        />
        <TabButton
          isActive={activeTab === "prescription"}
          onClick={() => setActiveTab("prescription")}
          icon={<RiFileTextLine />}
          text="Prescription History"
        />
      </div>
    </div>
  );
};

// Tab button component
const TabButton = ({ isActive, onClick, icon, text }) => {
  return (
    <button
      className={`px-4 py-2 mr-4 font-medium ${
        isActive
          ? "text-[#5B81BC] border-b-2 border-[#5B81BC]"
          : "text-gray-500"
      }`}
      onClick={onClick}
    >
      <span className="inline mr-2">{icon}</span>
      {text}
    </button>
  );
};

// Medical history component
const MedicalHistory = ({ patient }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataField label="Patient ID" value={patient._id || "N/A"} />
        <DataField label="Clinic ID" value={patient.clinicId || "N/A"} />
        <DataField label="Test ID" value={patient.testId || "N/A"} />
      </div>
      <div className="mt-4">
        <DataField
          label="Past Illness"
          value={patient.pastIllness || "None recorded"}
        />
        <DataField
          label="Vaccinations"
          value={patient.vaccinations || "None recorded"}
          className="mt-2"
        />
        <DataField
          label="Allergies"
          value={patient.allergies || "None recorded"}
          className="mt-2"
        />
        <DataField
          label="Genetic Conditions"
          value={patient.geneticConditions || "None recorded"}
          className="mt-2"
        />
      </div>
    </div>
  );
};

// Data field component
const DataField = ({ label, value, className = "" }) => {
  return (
    <p className={className}>
      <span className="font-medium">{label}:</span> {value}
    </p>
  );
};

// Prescription Form Modal Component
const PrescriptionForm = ({ isOpen, onClose, patient, doctorId, onSubmitSuccess, prescriptionToEdit = null, appointmentId }) => {
  const { authToken } = useAuth();
  const [formData, setFormData] = useState({
    medicine: "",
    disease: "",
    remarks: "",
    patient: patient?._id || "",
    doctor: doctorId || "",
    appointment: appointmentId || "", 
    medical_tests: "", 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prescriptionToEdit) {
      setFormData({
        medicine: prescriptionToEdit.medicine || "",
        disease: prescriptionToEdit.disease || "",
        remarks: prescriptionToEdit.remarks || "",
        patient: patient?._id || "",
        doctor: doctorId || "",
        appointment: prescriptionToEdit.appointment || "",
        medical_tests: prescriptionToEdit.medical_tests || "",
      });
    } else {
      setFormData({
        medicine: "",
        disease: "",
        remarks: "",
        patient: patient?._id || "",
        doctor: doctorId || "",
        appointment: appointmentId || "",
        medical_tests: "",
      });
    }
  }, [prescriptionToEdit, patient?._id, doctorId, appointmentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      
      if (prescriptionToEdit) {
        // Update existing prescription
        response = await axios.put(
          `https://medisync-backend-up4v.onrender.com/prescription/update/${prescriptionToEdit._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Prescription updated successfully",
          confirmButtonColor: "#5B81BC",
        });
      } else {
        // Create new prescription
        response = await axios.post(
          "https://medisync-backend-up4v.onrender.com/prescription/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Prescription created successfully",
          confirmButtonColor: "#5B81BC",
        });
      }

      onSubmitSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error with prescription:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to process prescription",
        confirmButtonColor: "#5B81BC",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#4F678E]">
            {prescriptionToEdit ? "Update Prescription" : "New Prescription"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disease
            </label>
            <input
              type="text"
              name="disease"
              value={formData.disease}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicine
            </label>
            <input
              type="text"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment ID
            </label>
            <input
              type="text"
              name="appointment"
              value={formData.appointment}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              readOnly={!!appointmentId} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Tests (Optional)
            </label>
            <input
              type="text"
              name="medical_tests"
              value={formData.medical_tests}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#5B81BC] rounded-md hover:bg-[#4F678E]"
              disabled={loading}
            >
              {loading ? "Processing..." : prescriptionToEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Prescription card component
const PrescriptionCard = ({ prescription, onEdit }) => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-3">
      <div className="flex justify-between mb-2">
        <DataField label="Disease" value={prescription.disease || "N/A"} />
        <div className="flex items-center">
          <p className="text-sm text-gray-500 mr-3">
            Date: {formatDate(prescription.date || prescription.createdAt)}
          </p>
          <button
            onClick={() => onEdit(prescription)}
            className="text-[#5B81BC] hover:text-[#4F678E]"
          >
            <RiEditLine />
          </button>
        </div>
      </div>
      <DataField label="Medicine" value={prescription.medicine || "N/A"} />
      {prescription.remarks && (
        <DataField
          label="Remarks"
          value={prescription.remarks}
          className="mt-2"
        />
      )}
      {prescription.medical_tests && (
        <DataField
          label="Medical Tests"
          value={prescription.medical_tests}
          className="mt-2"
        />
      )}
    </div>
  );
};

// Prescription history component
const PrescriptionHistory = ({ prescriptions, onAddPrescription, onEditPrescription, showAddButton }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-[#4F678E]">Prescriptions</h3>
        {showAddButton && (
          <button
            onClick={onAddPrescription}
            className="flex items-center text-sm text-white bg-[#5B81BC] px-3 py-1 rounded-md hover:bg-[#4F678E]"
          >
            <RiAddLine className="mr-1" /> Add Prescription
          </button>
        )}
      </div>

      {!prescriptions || prescriptions.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg">
          No prescription history available.
        </div>
      ) : (
        prescriptions.map((prescription, index) => (
          <PrescriptionCard 
            key={index} 
            prescription={prescription} 
            onEdit={onEditPrescription}
          />
        ))
      )}
    </div>
  );
};

// Main content layout component
const MainContent = ({ children }) => {
  return (
    <div className="main w-[95%] md:w-[90%] mt-5 p-5 mx-auto rounded-[20px]">
      {children}
    </div>
  );
};

// PageHeader component
const PageHeader = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold text-[#4F678E]">{title}</h1>
    </div>
  );
};

// Search and filter bar component
const TopNavigationBar = () => {
  return (
    <nav className="flex flex-col md:flex-row mt-4 justify-between pr-3 gap-3">
      {/* Search Bar */}
      <div className="flex items-center">
        <RiSearchLine className="relative left-6 text-gray-400" />
        <input
          type="text"
          className="w-full md:w-[30vw] h-[32px] pl-8 search-bar border-0 outline-none rounded-md"
          placeholder="Search..."
        />
      </div>

      {/* Drop Downs */}
      <div className="flex flex-wrap gap-2">{/* <LocationDropdown /> */}</div>
    </nav>
  );
};

// Main PatientProfile component
export default function PatientProfile() {
  const { patientId } = useParams();
  const location = useLocation();
  const appointmentId = location.state?.appointmentId;
  const { authToken, user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("medical");
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://medisync-backend-up4v.onrender.com/user/doctor/getPatient/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setPatient(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError(err.message || "Failed to fetch patient details");
        setLoading(false);
      }
    };

    if (patientId && authToken) {
      fetchPatientDetails();
    }
  }, [patientId, authToken]); 

  const handleAddPrescription = () => {
    setSelectedPrescription(null); 
    setShowPrescriptionForm(true);
  };

  const handleEditPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionForm(true);
  };

  const handlePrescriptionSubmitSuccess = (newPrescription) => {
    if (selectedPrescription) {
      // Update existing prescription in the list
      setPatient(prevPatient => ({
        ...prevPatient,
        prescriptions: prevPatient.prescriptions.map(p => 
          p._id === selectedPrescription._id ? newPrescription : p
        )
      }));
    } else {
      // Add new prescription to the list
      setPatient(prevPatient => ({
        ...prevPatient,
        prescriptions: [...(prevPatient.prescriptions || []), newPrescription]
      }));
    }
    
    setActiveTab("prescription");
  };

  if (loading) {
    return (
      <div className="flex">
        <div className="w-[15vw] md:w-[20vw]">
          <SidePanel />
        </div>
        <div className="flex justify-center items-center w-[85vw] md:w-[80vw]">
          <p>Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <div className="w-[15vw] md:w-[20vw]">
          <SidePanel />
        </div>
        <div className="flex justify-center items-center w-[85vw] md:w-[80vw]">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex">
        <div className="w-[15vw] md:w-[20vw]">
          <SidePanel />
        </div>
        <div className="flex justify-center items-center w-[85vw] md:w-[80vw]">
          <p>Patient not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Side Panel */}
      <div className="w-[15vw] md:w-[15vw]">
        <SidePanel propActiveButton="patientlist" />
      </div>

      <div className="flex flex-col w-[85vw] md:w-[80w]">
        <TopNavigationBar />

        <MainContent>
          <PageHeader title="Patient Profile" />

          <Card className="mb-8">
            <div className="flex flex-col md:flex-row">
              {/* Left column - Patient image and basic info */}
              <div className="md:w-1/4 mb-6 md:mb-0">
                <PatientBasicInfo patient={patient} />
              </div>

              {/* Right column - Contact details and other info */}
              <div className="md:w-3/4 md:pl-8">
                <ContactDetails
                  phone={patient.phoneNumber}
                  email={patient.email}
                />

                <TabNavigation
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {/* Tab Content */}
                {activeTab === "medical" && (
                  <MedicalHistory patient={patient} />
                )}
                {activeTab === "prescription" && (
                  <PrescriptionHistory
                    prescriptions={patient.prescriptions || []}
                    onAddPrescription={handleAddPrescription}
                    onEditPrescription={handleEditPrescription}
                    showAddButton={!!appointmentId} 
                  />
                )}
              </div>
            </div>
          </Card>
        </MainContent>

        {/* Prescription Form Modal */}
        <PrescriptionForm
          isOpen={showPrescriptionForm}
          onClose={() => setShowPrescriptionForm(false)}
          patient={patient}
          doctorId={user?._id} 
          onSubmitSuccess={handlePrescriptionSubmitSuccess}
          prescriptionToEdit={selectedPrescription}
          appointmentId={appointmentId}
        />
      </div>
    </div>
  );
}