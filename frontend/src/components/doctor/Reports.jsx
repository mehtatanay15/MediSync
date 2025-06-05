import React, { useState, useEffect, useContext } from "react";
import { SidePanel } from "./DashBoard";
import { FaFilter, FaSearch } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import axios from "axios";
import "../../styles/Dashboard.css";
import { useAuth } from "../../context/AuthContext";

// Enhanced dummy data for patient reports
const generateDummyReports = () => {
  const patients = [
    "Aditya Gupta",
    "Pooja Shah", 
    "Anika Shah",
    "Rishis Shah",
    "Rishi Mehta"
  ];
  
  const testTypes = [
    { category: "Blood", tests: ["Complete Blood Count", "Lipid Profile", "Liver Function Test", "Kidney Function Test", "Thyroid Function Test", "Blood Sugar", "Hemoglobin A1C"] },
    { category: "X-ray", tests: ["Chest X-ray", "Knee X-ray", "Spine X-ray", "Abdominal X-ray", "Hand X-ray"] }
  ];
  
  const statusOptions = ["Normal", "Abnormal", "Critical", "Pending Review"];
  const priorityLevels = ["High", "Medium", "Low"];
  
  const reports = [];
  
  // Generate reports for each patient
  patients.forEach((patient, patientIndex) => {
    const numReports = Math.floor(Math.random() * 4) + 2; // 2-5 reports per patient
    
    for (let i = 0; i < numReports; i++) {
      const categoryData = testTypes[Math.floor(Math.random() * testTypes.length)];
      const testName = categoryData.tests[Math.floor(Math.random() * categoryData.tests.length)];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
      const priority = priorityLevels[Math.floor(Math.random() * priorityLevels.length)];
      
      // Generate realistic dates (last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const reportDate = new Date();
      reportDate.setDate(reportDate.getDate() - daysAgo);
      
      reports.push({
        id: `RPT-${patientIndex + 1}${String(i + 1).padStart(2, '0')}`,
        patient_name: patient,
        test_name: testName,
        category: categoryData.category,
        description: `${testName} report for ${patient} - ${status}`,
        date: reportDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: `${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        status: status,
        priority: priority,
        timestamp: reportDate.getTime()
      });
    }
  });
  
  return reports.sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
};

const FilterBar = ({ setSearchText, setOrder, setCategory, onFilter }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-5 rounded-xl h">
      <button
        onClick={onFilter}
        className="p-2 text-gray-600 hover:text-blue-600 transition report-search"
      >
        <FaFilter size={18} />
      </button>

      <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded-md px-2 report-search">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by patient name or test..."
          className="w-full px-3 py-2 text-sm text-gray-700 focus:outline-none"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <select
        onChange={(e) => setOrder(e.target.value)}
        className="w-full md:w-1/6 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none report-search"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

      <select
        onChange={(e) => setCategory(e.target.value)}
        className="w-full md:w-1/6 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none report-search"
      >
        <option value="">All Categories</option>
        <option value="Blood">Blood Tests</option>
        <option value="X-ray">X-ray Reports</option>
      </select>
    </div>
  );
};

const ReportCard = ({ report }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Normal": return "text-green-600 bg-green-50";
      case "Abnormal": return "text-yellow-600 bg-yellow-50";
      case "Critical": return "text-red-600 bg-red-50";
      case "Pending Review": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition m-3">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-md font-medium">{report.patient_name}</h2>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
            {report.priority}
          </span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            {report.category}
          </span>
        </div>
        <h3 className="text-sm font-medium text-gray-800 mb-1">{report.test_name}</h3>
        <p className="text-sm text-gray-500 mb-3">{report.description}</p>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
          {/* <button className="bg-[#29B152] text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition">
            Send via WhatsApp
          </button> */}
        </div>
      </div>
    </div>
  );
};

const ReportsTable = ({ searchText, order, category }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const context = useAuth();
  const { authUser } = context;

  useEffect(() => {
    // Simulate API call with dummy data
    const fetchReports = async () => {
      try {
        console.log(authUser);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const dummyReports = generateDummyReports();
        setReports(dummyReports);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = [...reports];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(report => 
        report.patient_name.toLowerCase().includes(searchText.toLowerCase()) ||
        report.test_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(report => report.category === category);
    }

    // Sort by order
    if (order === "oldest") {
      filtered.sort((a, b) => a.timestamp - b.timestamp);
    } else {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    }

    setFilteredReports(filtered);
  }, [reports, searchText, order, category]);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-3 py-4">
        <h1 className="text-3xl font-semibold text-[#31316F]">
          Patient Reports
        </h1>
        <div className="text-sm text-gray-500">
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
        </div>
      </div>
      
      {filteredReports.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">No reports found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : (
        filteredReports.map((report, index) => (
          <ReportCard key={report.id} report={report} />
        ))
      )}
    </div>
  );
};

export default function Reports() {
  const [searchText, setSearchText] = useState("");
  const [order, setOrder] = useState("newest");
  const [category, setCategory] = useState("");

  const onFilter = () => {
    console.log("Filter clicked - Current filters:", { searchText, order, category });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-l from-[#F3F8FF] to-[#F2FDFF]">
      <div className="w-[15vw]">
        <SidePanel propActiveButton="report" />
      </div>

      <div className="flex-1 p-5">
        <div className="bg-white rounded-3xl shadow-md p-5 h-full">
          <div className="bg-gradient-to-l from-[#F3F8FF] to-[#F2FDFF] rounded-2xl p-5 h-full flex flex-col gap-4">
            <FilterBar
              setSearchText={setSearchText}
              setOrder={setOrder}
              setCategory={setCategory}
              onFilter={onFilter}
            />
            <ReportsTable 
              searchText={searchText}
              order={order}
              category={category}
            />
          </div>
        </div>
      </div>
    </div>
  );
}