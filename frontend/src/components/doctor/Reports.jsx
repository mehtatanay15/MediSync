import React, { useState, useEffect,useContext } from "react";
import { SidePanel } from "./DashBoard";
import { FaFilter, FaSearch } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";
import Cookies from "js-cookie";
import axios from "axios";
import "../../styles/Dashboard.css";
import { useAuth } from "../../context/AuthContext";

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
          placeholder="Search..."
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
        <option value="">All</option>
        <option value="Blood">Blood</option>
        <option value="X-ray">X-ray</option>
      </select>
    </div>
  );
};

const ReportCard = ({ report }) => {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition m-3">
      <div className="flex flex-col max-w-[80%]">
        <h2 className="text-md font-medium truncate">{report.test_name}</h2>
        <p className="text-sm text-gray-500 truncate">{report.description}</p>
        <button className="bg-[#29B152] text-white text-xs mt-2 w-fit px-3 py-1 rounded hover:bg-green-600 transition">
          Send via Whatsapp
        </button>
      </div>
      <SlArrowRight className="text-gray-500 size-6 cursor-pointer hover:text-black transition" />
    </div>
  );
};

const ReportsTable = () => {
  const [reports, setReports] = useState([]);
  const context = useAuth();
  const { authUser } = context;
  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log(authUser)
        const response = await axios.get(
          `https://medisync-backend-up4v.onrender.com/medicalTest/readByDoctorId/${authUser.roleId}`
        );
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <h1 className="text-3xl font-semibold text-[#31316F] px-3 py-4">
        Reports
      </h1>
      {reports.map((report, index) => (
        <ReportCard key={index} report={report} />
      ))}
    </div>
  );
};

export default function Reports() {
  const [searchText, setSearchText] = useState("");
  const [order, setOrder] = useState("newest");
  const [category, setCategory] = useState("");

  const onFilter = () => {
    console.log("Filter clicked");
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
            <ReportsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
