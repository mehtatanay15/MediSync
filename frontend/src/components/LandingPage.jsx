import React, { useEffect, useRef } from "react";
import "../styles/LandingPage.css";
import Chooseleft from "./landingPageimages/Choose-left.svg";
import Chooseright from "./landingPageimages/Choose-right.svg";
import workingleft from "./landingPageimages/workingleft.svg";
import workingright from "./landingPageimages/workingright.svg";
import mobile from "./landingPageimages/iPhone 16 Pro.svg";
import logo from "./landingPageimages/MediSync-whitebg.png";
import doc from "./landingPageimages/doc.png";
import { useLocation, useNavigate } from "react-router";
import Testimonials from "./Testimonials";

import { useState } from "react";

export function LandingNavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToTestimonials = (e) => {
    e.preventDefault();

    // If already on landing page, scroll to testimonials
    if (location.pathname === "/") {
      const testimonialsSection = document.getElementById(
        "testimonials-section"
      );
      if (testimonialsSection) {
        testimonialsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If on another page, navigate to landing page with a query parameter
      navigate("/?scrollTo=testimonials");
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center py-4 px-4 lg:px-8">
        <div className="text-center flex-shrink-0">
          <img src={logo} alt="Medisync" className="h-12 lg:h-16" />
        </div>

        <div className="hidden md:flex items-center justify-center px-3 lg:px-6 py-2 mx-2 lg:mx-4 bg-white rounded-full shadow-sm flex-shrink">
          <a
            href="/"
            className="mx-4 lg:mx-4 text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </a>
          <a
            href="/about"
            className="mx-4 lg:mx-4 text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a
            href="/demo"
            className="mx-4 lg:mx-4 text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Demo
          </a>
          <a
            href="#testimonials"
            onClick={navigateToTestimonials}
            className="mx-4 lg:mx-4 text-xs lg:text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Testimonials
          </a>
        </div>

        <div className="flex space-x-2 lg:space-x-4 flex-shrink-0">
          <button
            type="button"
            className="sign-in text-xs lg:text-sm w-20 lg:w-24 h-8 rounded-full font-semibold text-white clickable"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            type="button"
            className="sign-up text-xs lg:text-sm w-20 lg:w-24 h-8 rounded-full font-semibold clickable"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center py-3 px-4">
        <div className="text-center">
          <img src={logo} alt="Medisync" className="h-12" />
        </div>

        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {/* Custom hamburger menu icon */}
          <div
            className={`w-6 flex flex-col justify-between h-5 ${
              isMenuOpen ? "hidden" : "flex"
            }`}
          >
            <span className="w-full h-0.5 bg-gray-800 rounded-sm"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-sm"></span>
            <span className="w-full h-0.5 bg-gray-800 rounded-sm"></span>
          </div>

          {/* Custom close icon */}
          <div className={`relative w-6 h-6 ${isMenuOpen ? "flex" : "hidden"}`}>
            <span className="absolute top-2.5 w-6 h-0.5 bg-gray-800 rounded-sm transform rotate-45"></span>
            <span className="absolute top-2.5 w-6 h-0.5 bg-gray-800 rounded-sm transform -rotate-45"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden">
          <div className="flex flex-col py-2 px-4">
            <a href="/" className="py-3 px-2 border-b hover:bg-gray-50">
              Home
            </a>
            <a href="/about" className="py-3 px-2 border-b hover:bg-gray-50">
              About
            </a>
            <a href="/demo" className="py-3 px-2 border-b hover:bg-gray-50">
              Demo
            </a>
            <a
              href="/testimonials"
              className="py-3 px-2 border-b hover:bg-gray-50"
            >
              Testimonials
            </a>

            <div className="flex flex-col space-y-3 mt-4 mb-2">
              <button
                type="button"
                className="sign-in text-sm py-2 rounded-full font-semibold text-white clickable"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
              <button
                type="button"
                className="sign-up text-sm py-2 rounded-full font-semibold clickable"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function IntroBox() {
  return (
    <div className="intro-box w-[97%] mx-auto mt-6 rounded-[25px] relative overflow-hidden px-4 md:px-6">
      <LandingNavigationBar />

      {/* Title Section */}
      <div className="flex flex-col text-center mt-4 md:mt-0">
        <p className="text-2xl md:text-4xl lg:text-[60px] font-semibold">
          Streamline Your Clinic
        </p>
        <p className="text-2xl md:text-4xl lg:text-[60px] font-semibold">
          Appointments with Ease
        </p>
      </div>

      {/* Center image - Order changes with responsive layout */}
      <div className="w-full flex justify-center mt-2 order-first lg:order-none lg:mt-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-0 z-10">
        <img
          src={doc}
          alt="Doctor illustration"
          className="h-[400px] md:h-[400px] lg:h-[500px] max-w-full md:max-w-[40vw] object-contain"
        />
      </div>

      {/* Content Section - Responsive Layout */}
      <div className="flex flex-col w-full relative mt-3 lg:mt-20 pb-4">
        {/* Boxes Container - Changes to vertical layout below 1024px */}
        <div className="w-full flex flex-col sm:flex-row items-center lg:z-20">
          {/* Left Box */}
          <div className="w-full lg:w-[27vw] flex flex-col mt-2 lg:mt-4 lg:ml-10">
            <div className="bg-white text-base md:text-md p-4 rounded-[10px] font-medium sm:h-44 md:h-44">
              MediSync is your all-in-one clinic management solution that
              simplifies appointment booking, real-time updates, and seamless
              doctor-patient interactions.
            </div>
            <button className="intro-buttons text-xs md:text-[12px] w-40 h-8 rounded-full self-center lg:self-end mt-3 lg:mt-2">
              <a href="/signup">Register Your Clinic Now</a>
            </button>
          </div>

          {/* Right Box */}
          <div className="w-full lg:w-[270px] flex flex-col mt-4 lg:mt-20 lg:ml-[38vw] sm:ml-4">
            <div className="bg-white text-base md:text-md p-4 rounded-[10px] font-medium sm:h-44 lg:h-30">
              Effortless Appointments. Smarter Consultations. Better Healthcare.
            </div>
            <button className="intro-buttons text-xs md:text-[12px] w-40 h-8 rounded-full self-center lg:self-start mt-3 lg:mt-2">
              <a href="/signup">Book Appointment Now</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Choose() {
  return (
    <div className="relative w-full overflow-visible z-20 px-4">
      {/* Container for images and content */}
      <div className="relative flex flex-wrap justify-center items-center">
        {/* Left Image */}
        <img
          src={Chooseleft}
          alt=""
          className="absolute left-0 -mb-[100%] md:-mb-0 h-[90vw] md:h-[40vw] z-10 -ml-[10%] md:-ml-[5%]"
        />

        {/* Content */}
        <div className="relative text-center z-20">
          <p className="text-3xl md:text-5xl font-semibold mt-10">
            Why choose us?
          </p>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative">
            {[
              {
                title: "Hassle-Free Booking",
                description:
                  "Say goodbye to long waiting times and tedious scheduling. Patients can book appointments effortlessly through an intuitive interface.",
                imgSrc:
                  "https://s3-alpha-sig.figma.com/img/7e0f/c032/40a649f1c53b794b9bf1d8986550721f?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=adY~WDrXB~3ZFcS~YljfDI7gYfXmZv3i-akuBiHkQnQaemTwdDUHGuKuMSfpjW-1UB72NlybjmD75we6FGQYMWv2XGHDzDsgcz9s76jWjGQwi5SlkyAfMSUIojm~y55D~QUqzRTtToT2dDSQ-csT3OTucyQfIEaBWfu7BkXa2KBJS0nDs-koVbMYylWVA147Pho9SBQ4udmahTMER3f4nF4vsNNyZ96ovaWZjYjZwkLKVq51kv0sS6lKZ5fbQuiMHIiWn9JCWMZFfnQVsY3paJObRP~sky8uan6H-HIiHWvHbE7q6QvWYNd73J77hJsZOZKdieEBzGef7FmHq9R7hw__",
              },
              {
                title: "Real-Time Queue Updates",
                description:
                  "Reduce clinic congestion with live queue tracking. Doctors and patients receive instant updates on appointment status.",
                imgSrc:
                  "https://s3-alpha-sig.figma.com/img/77b6/e64b/d0fdd5bc7332a4fdf1f6de3e965a1e13?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jRW8ntikDWjRHYqpacvwzXPza2N9YxVhwN8f8~hAmpYxmruxWwy6zedAQdlR-qPM1nNsHql25xXdDYYRZ46R82mQ8AB2iwyPl8bDrmB1mDuBjNVAThFNfqVwA8raSZEH9kaI51Rf8~0MfepUeP5P3Trr2iQodHIYinRAuQ5RfWKMhhao4L3UYis~lrBwV1OE-c2CL2o6eBwZLBeMQko2UOOMaTgbRpUWJxgoS46KxuZDJK4r6bxDu8TQ6raB7qo5-T1c5fQcawBmZHVUp~8baFa1zQvaKogZIFqTm36-j8~P-R70YE3mWzoN232ssIkZR-pJJg9fbdweK4yrjj2LHw__",
              },
              {
                title: "Integrated Patient Records",
                description:
                  "Access medical information securely. Doctors can view patient history, past diagnoses, test reports, and treatment plans.",
                imgSrc:
                  "https://s3-alpha-sig.figma.com/img/320f/42a8/134d7da658362597c90897e48a1f8a3a?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=N3rFqXR1vHWMvsXbaYQWSpl8OC3X0MD1EbdvYd3XQ4daWxGjI9WpGKr8~2IHx3Cbrxikfveijs4LVYD6EFGI6leF1XQVlqcFqCTq0GXdyGckAq2FBOuBA15ZGtlUr6QiY0qC452HrgBidftBvMq4jfRAxA1Ew7dzUZJ-igYQishYlU8gm6EZr8cB7RjwOvHXxuiChGpJuKNtKEQuNWPFShOodu1a0mcTnatqSLj1gopAtaOCgeP7tJZrzR-tuHtTAzSszULwoJK3ITX545NYf~JkvrezE5FuQZqFRNWHTqvpUk6lo2bGykzt2L1clzVk-HTPexbR5JemNW5FFeCipg__",
              },
            ].map((box, index) => (
              <div
                key={index}
                className="w-60 py-6 px-3 bg-[#C5E2E8] rounded-md mx-auto"
              >
                <img
                  src={box.imgSrc}
                  alt=""
                  className="h-40 w-56 border border-[#54A9DF] rounded-lg"
                />
                <p className="text-[14px] text-[#183149] font-semibold my-2">
                  {box.title}
                </p>
                <p className="text-[12px]">{box.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <img
          src={Chooseright}
          alt=""
          className="absolute right-0 top-10 h-[90vw] md:h-[40vw] z-10 -mr-[10%] md:-mr-[5%]"
        />
      </div>
    </div>
  );
}

export function TestimonialsBox() {
  return (
    <div id="testimonials-section" className="text-center mt-20 h-full">
      <p className="text-3xl   md:text-5xl text-[#2C2C44] font-semibold">
        Testimonials
      </p>
      <p className="text-[#2C2C44] text-[16px] md:text-[18px]">
        Trusted by doctors, loved by patients, and empowering
      </p>
      <p className="text-[#2C2C44] text-[16px] md:text-[18px]">
        clinics—see what our users have to say!
      </p>
      <Testimonials />
    </div>
  );
}

export function Working() {
  return (
    <div className="relative w-full overflow-visible">
      <div className="text-center">
        <p className="text-5xl font-semibold mt-16">How does it work?</p>

        <div className="relative flex justify-center">
          {/* Left Image - Properly Positioned Without Overflow */}
          <div className="absolute left-0 inset-y-0 flex items-center z-10">
            <img
              src={workingleft}
              alt="Decorative left image"
              className="max-h-screen h-auto w-auto max-w-none object-contain -mt-96 md:-mt-0"
            />
          </div>

          {/* Content Boxes */}
          <div
            className="working flex flex-wrap justify-center mt-16 pt-16 pb-16 px-6 items-center z-20 relative w-full mx-auto"
            style={{ maxWidth: "min(1024px, 80vw)" }}
          >
            <div className="working-boxes mx-2 w-full md:w-[calc(33%-16px)]">
              <p className="mb-8 h-12 rounded-full">For Doctors</p>
              <ol className="px-6 py-6 list-decimal list-inside">
                <li>Manage daily schedules and availability effortlessly.</li>
                <li>Accept, review, and conduct consultations seamlessly.</li>
                <li>
                  Access patient history, add prescriptions, and update medical
                  records in one place.
                </li>
              </ol>
            </div>
            <div className="working-boxes mx-2 w-full md:w-[calc(33%-16px)]">
              <p className="mb-8 h-12 rounded-full">For Patients</p>
              <ol className="px-6 py-6 list-decimal list-inside">
                <li>Book appointments easily with a hassle-free process.</li>
                <li>
                  Receive real-time queue updates and estimated waiting times.
                </li>
                <li>
                  Securely store and access personal health records and
                  prescriptions.
                </li>
              </ol>
            </div>
            <div className="working-boxes mx-2 w-full md:w-[calc(33%-16px)]">
              <p className="mb-8 h-12 rounded-full">For Administrators</p>
              <ol className="px-6 py-6 list-decimal list-inside">
                <li>
                  Streamline operations with centralized patient management.
                </li>
                <li>
                  Optimize doctor schedules and reduce patient waiting times.
                </li>
                <li>
                  Gain valuable insights with performance analytics and reports.
                </li>
              </ol>
            </div>
          </div>

          {/* Right Image - Properly Positioned Without Overflow */}
          <div className="absolute right-0 inset-y-0 flex items-center z-10">
            <img
              src={workingright}
              alt="Decorative right image"
              className="max-h-screen h-auto w-auto max-w-none object-contain -mb-96"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <div className="text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 lg:px-30 pt-12 pb-8 bg-[#01132C] text-white text-[12px] md:text-left">
      <div className="footer-list rounded">
        <p className="font-semibold">Service</p>
        <ul className="mt-2">
          <li>Arbitration cases</li>
          <li>Market research</li>
          <li>Accounting services</li>
          <li>Legal consultations</li>
        </ul>
      </div>

      <div className="footer-list rounded">
        <p className="font-semibold">Catalog</p>
        <ul className="mt-2 mb-6">
          <li>Sell a ready-made company</li>
          <li>Buy a ready-made company</li>
          <li>All services</li>
        </ul>
        <p className="font-semibold">Company</p>
        <ul className="mt-2">
          <li>About us</li>
          <li>Articles</li>
          <li>Contacts</li>
        </ul>
      </div>

      <div className="rounded">
        <p className="font-semibold">Contact</p>
        <p className="mt-2">+1 999 888-76-54</p>
        <p>hello@logoipsum.com</p>
      </div>

      <div className="rounded md:text-left lg:text-right mt-3">
        <button className="bg-[#0053CD] h-10 px-4 rounded mb-4">
          Call me back
        </button>
        <p className="opacity-80">2972 Westheimer Rd. Santa Ana</p>
        <p className="opacity-80 mb-4">Illinois 85486</p>
        <p className="opacity-80">From 10 a.m. to 6 p.m.</p>
        <p className="opacity-60">All days</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const location = useLocation();
  const testimonialsRef = useRef(null);

  // Check for the query parameter on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const scrollTo = urlParams.get("scrollTo");

    if (scrollTo === "testimonials") {
      setTimeout(() => {
        const testimonialsSection = document.getElementById(
          "testimonials-section"
        );
        if (testimonialsSection) {
          testimonialsSection.scrollIntoView({ behavior: "smooth" });

          // Clean up the URL without reloading the page
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
        }
      }, 500); // Small delay to ensure the page is fully loaded
    }
  }, [location]);

  return (
    <div className="overflow-x-hidden">
      <div className="w-full mx-auto">
        <IntroBox />
      </div>
      <div className="min-w-screen">
        <Choose />
      </div>
      <div>
        <Working />
      </div>
      <div className="">
        <TestimonialsBox />
      </div>
      <div className="ready flex flex-col md:flex-row w-10/12 md:w-4/5 m-auto rounded-[25px] py-6 px-4 md:py-4 md:px-8 justify-evenly items-center text-center md:text-left">
        <div className="mb-4 md:mb-0">
          <p className="text-[#2C2C44] text-lg md:text-2xl font-medium">
            Ready to get started?
          </p>
          <p className="text-sm md:text-base text-[#000000A6]">
            Effortless Appointments. Smarter Consultations. Better Healthcare.
          </p>
        </div>
        <div className="intro-buttons flex items-center justify-center w-full md:w-60 h-12 rounded-[20px] bg-[#54A9DF] text-white font-semibold">
          <a href="/signup" className="w-full text-center">
            Book Appointment Now
          </a>
        </div>
      </div>

      <div className="relative flex flex-col-reverse md:flex-row items-center w-full">
        {/* Text Section */}
        <div className="relative text-center md:text-left w-full md:w-7/12 px-6 md:pl-24 lg:pl-54">
          <div className="text-2xl md:text-3xl font-semibold">
            <p>Download the</p>
            <p>Mobile App now!</p>
          </div>
          <p className="mt-6 text-[#000000A6] text-sm md:text-base max-w-md mx-auto md:mx-0">
            Lorem ipsum dolor sit amet consectetur. Arcu risus donec gravida
            nisl rhoncus egestas rhoncus pharetra. Ultrices dolor consectetur
            ante luctus integer.
          </p>
        </div>

        {/* Image Section - Reduced width to bring it closer */}
        <div className="w-full flex justify-center md:justify-start md:-ml-30 lg:-ml-40">
          <img src={mobile} alt="Mobile App" className="w-[80%] lg:w-[60vw]" />
        </div>
      </div>

      <div className="mt-10  md:mt-0">
        <Footer />
      </div>
    </div>
  );
}
