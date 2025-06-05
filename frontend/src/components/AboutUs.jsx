import React from "react";
import { motion } from "framer-motion";
import { LandingNavigationBar } from "./LandingPage";
import { Footer } from "./LandingPage";
import logo from "./landingPageimages/MediSync-whitebg.png";
import sharkTankImage from "../assets/svg/post3.jpg"; 
import { 
  FaUserMd, FaUsers, FaCog, FaTrophy, FaHandshake, FaCode, 
  FaDatabase, FaLayerGroup, FaMobile, FaPalette, FaChalkboardTeacher
} from "react-icons/fa";
import { MdHealthAndSafety, MdSecurity, MdTimer } from "react-icons/md";

export default function AboutUs() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <div className="intro-box w-[97%] max-w-[1440px] mx-auto mt-6 rounded-[25px] relative overflow-hidden px-4 md:px-6 pb-16">
        <LandingNavigationBar />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col items-center justify-center mt-10 text-center"
        >
          <img src={logo} alt="MediSync Logo" className="w-64 md:w-80 mb-6" />
          <h1 className="text-3xl md:text-5xl font-semibold text-[#183149] mb-4">About MediSync</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-[#183149] opacity-90">
            Revolutionizing healthcare management with intuitive technology that connects doctors, 
            patients, and administrators in a seamless ecosystem.
          </p>
        </motion.div>
      </div>

      {/* Our Mission Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="w-10/12 max-w-5xl mx-auto my-20 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-[#2C2C44] mb-8">Our Mission</h2>
        <p className="text-lg text-[#2C2C44] mb-12 max-w-3xl mx-auto">
          At MediSync, we're committed to transforming healthcare delivery by eliminating inefficiencies
          that plague traditional clinic management. Our platform bridges the gap between medical 
          professionals and patients, creating a more responsive, accessible, and effective healthcare ecosystem.
        </p>
        
        {/* Core Benefits */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeIn} className="bg-[#C5E2E8] rounded-lg p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <FaUserMd className="text-5xl text-[#54A9DF]" />
            </div>
            <h3 className="text-xl font-medium text-[#183149] mb-2">For Doctors</h3>
            <p className="text-sm">
              Streamlined scheduling, consultation management, and integrated medical records access
              in one powerful platform.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-[#C5E2E8] rounded-lg p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <FaUsers className="text-5xl text-[#54A9DF]" />
            </div>
            <h3 className="text-xl font-medium text-[#183149] mb-2">For Patients</h3>
            <p className="text-sm">
              Effortless appointment booking, real-time queue updates, and secure personal health record storage.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-[#C5E2E8] rounded-lg p-6 shadow-md transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <FaCog className="text-5xl text-[#54A9DF]" />
            </div>
            <h3 className="text-xl font-medium text-[#183149] mb-2">For Administrators</h3>
            <p className="text-sm">
              Centralized management, optimized scheduling, and powerful analytics to improve clinic operations.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Key Features */}
      <div className="working w-full bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-semibold text-center text-[#2C2C44] mb-12"
          >
            Key Features
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white rounded-lg p-8 shadow-lg transform hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#C5E2E8] p-4 rounded-full">
                  <MdTimer className="text-4xl text-[#54A9DF]" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#183149] mb-3 text-center">Hassle-Free Booking</h3>
              <p className="text-sm text-center">
                Say goodbye to long waiting times and tedious scheduling. Patients can book appointments 
                effortlessly through an intuitive interface.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white rounded-lg p-8 shadow-lg transform hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#C5E2E8] p-4 rounded-full">
                  <MdHealthAndSafety className="text-4xl text-[#54A9DF]" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#183149] mb-3 text-center">Real-Time Queue Updates</h3>
              <p className="text-sm text-center">
                Reduce clinic congestion with live queue tracking. Doctors and patients receive instant 
                updates on appointment status.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white rounded-lg p-8 shadow-lg transform hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#C5E2E8] p-4 rounded-full">
                  <MdSecurity className="text-4xl text-[#54A9DF]" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#183149] mb-3 text-center">Integrated Patient Records</h3>
              <p className="text-sm text-center">
                Access medical information securely. Doctors can view patient history, past diagnoses, 
                test reports, and treatment plans.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Achievements Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="w-10/12 max-w-5xl mx-auto my-20"
      >
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#2C2C44] mb-12">Our Achievements</h2>
        
        <div className="bg-gradient-to-r from-[#C5E2E8] to-[#A5BBDF] rounded-2xl overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row items-stretch">
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex justify-center md:justify-start mb-6">
                <div className="bg-white p-4 rounded-full shadow-md">
                  <FaTrophy className="text-5xl text-[#54A9DF]" />
                </div>
              </div>
              <h3 className="text-2xl font-medium text-[#183149] mb-4 text-center md:text-left">
                Shark Tank Trinity Winner
              </h3>
              <p className="text-[#183149] text-center md:text-left">
                MediSync secured a prestigious mentorship and business deal during the Shark Tank Trinity 
                competition, validating our innovative approach to healthcare management.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <img 
                  src= {sharkTankImage} 
                  alt="Shark Tank Trinity Win" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Section - Improved Layout */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
        className="w-full bg-gray-50 py-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#2C2C44] mb-4">Our Team</h2>
          <p className="text-lg text-center text-[#2C2C44] mb-12 max-w-3xl mx-auto">
            Meet the talented individuals behind MediSync who are passionate about transforming healthcare delivery.
          </p>
          
          {/* Mentors */}
          <div className="mb-20">
            <h3 className="text-2xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
              <FaChalkboardTeacher className="mr-2 text-[#54A9DF]" /> Mentors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Vanshika Shah", role: "Backend Node Mentor", icon: <FaDatabase className="text-white" /> },
                { name: "Rishi Shah", role: "Flutter Mentor", icon: <FaMobile className="text-white" /> },
                { name: "Gaurang Singhania", role: "Frontend Mentor", icon: <FaCode className="text-white" /> }
              ].map((mentor, index) => (
                <motion.div 
                  key={index}
                  variants={fadeIn} 
                  className="bg-gradient-to-br from-[#C5E2E8] to-[#A5BBDF] rounded-lg p-6 text-center shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-24 h-24 bg-[#54A9DF] rounded-full mx-auto mb-6 flex items-center justify-center shadow-md">
                    <div className="text-4xl">{mentor.icon}</div>
                  </div>
                  <h4 className="text-xl font-semibold text-[#183149] mb-1">{mentor.name}</h4>
                  <p className="text-[#183149] opacity-80">{mentor.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Team Members - Reorganized Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16">
            {/* Left Column */}
            <div>
              {/* Full-Stack Mentees */}
              <div className="mb-16">
                <h3 className="text-xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
                  <FaLayerGroup className="mr-2 text-[#54A9DF]" /> Full-Stack Mentees
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Tanay Mehta", role: "Full-Stack Developer" },
                    { name: "Pranav Ahuja", role: "Full-Stack Developer" }
                  ].map((member, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeIn}
                      className="bg-white rounded-lg p-6 text-center shadow-md flex items-center"
                    >
                      <div className="bg-[#C5E2E8] p-3 rounded-full mr-4">
                        <FaLayerGroup className="text-2xl text-[#54A9DF]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#183149] text-left">{member.name}</h4>
                        <p className="text-sm text-[#183149] opacity-80 text-left">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Frontend */}
              <div className="mb-16">
                <h3 className="text-xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
                  <FaCode className="mr-2 text-[#54A9DF]" /> Frontend
                </h3>
                <motion.div 
                  variants={fadeIn}
                  className="bg-white rounded-lg p-6 text-center shadow-md flex items-center"
                >
                  <div className="bg-[#C5E2E8] p-3 rounded-full mr-4">
                    <FaCode className="text-2xl text-[#54A9DF]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#183149] text-left">Omkar Sawant</h4>
                    <p className="text-sm text-[#183149] opacity-80 text-left">Frontend Developer</p>
                  </div>
                </motion.div>
              </div>

              {/* UI/UX */}
              <div>
                <h3 className="text-xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
                  <FaPalette className="mr-2 text-[#54A9DF]" /> UI/UX
                </h3>
                <motion.div 
                  variants={fadeIn}
                  className="bg-white rounded-lg p-6 text-center shadow-md flex items-center"
                >
                  <div className="bg-[#C5E2E8] p-3 rounded-full mr-4">
                    <FaPalette className="text-2xl text-[#54A9DF]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-[#183149] text-left">Swarali Pednekar</h4>
                    <p className="text-sm text-[#183149] opacity-80 text-left">UI/UX Designer</p>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              {/* Flutter */}
              <div className="mb-16">
                <h3 className="text-xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
                  <FaMobile className="mr-2 text-[#54A9DF]" /> Flutter
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Rishi Mehta", role: "Flutter Developer" },
                    { name: "Ashka Jain", role: "Flutter Developer" }
                  ].map((member, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeIn}
                      className="bg-white rounded-lg p-6 text-center shadow-md flex items-center"
                    >
                      <div className="bg-[#C5E2E8] p-3 rounded-full mr-4">
                        <FaMobile className="text-2xl text-[#54A9DF]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#183149] text-left">{member.name}</h4>
                        <p className="text-sm text-[#183149] opacity-80 text-left">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Backend */}
              <div>
                <h3 className="text-xl font-medium text-center text-[#183149] mb-8 flex items-center justify-center">
                  <FaDatabase className="mr-2 text-[#54A9DF]" /> Backend
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Aditya Gupta", role: "Backend Developer" },
                    { name: "Anika Shah", role: "Backend Developer" },
                    { name: "Hasan Rampurawala", role: "Backend Developer" }
                  ].map((member, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeIn}
                      className="bg-white rounded-lg p-6 text-center shadow-md flex items-center"
                    >
                      <div className="bg-[#C5E2E8] p-3 rounded-full mr-4">
                        <FaDatabase className="text-2xl text-[#54A9DF]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-[#183149] text-left">{member.name}</h4>
                        <p className="text-sm text-[#183149] opacity-80 text-left">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Unicode Project Phase */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeIn}
        className="ready w-10/12 max-w-5xl mx-auto my-20 rounded-[25px] p-8 bg-gradient-to-r from-[#C5E2E8] to-[#A5BBDF]"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 mb-8 md:mb-0 md:pr-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#183149] mb-4">Unicode Project Phase</h2>
            <p className="text-[#183149]">
              MediSync was developed as part of the Unicode Project Phase, a rigorous development program 
              that brings together talented mentors and mentees to create innovative solutions. Through 
              this collaborative effort, we've built a platform that addresses real healthcare challenges
              while providing valuable learning experiences for all team members.
            </p>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <FaHandshake className="text-8xl mx-auto text-[#54A9DF]" />
              <p className="text-center mt-4 font-medium text-[#183149]">Unicode Project Phase</p>
            </div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}