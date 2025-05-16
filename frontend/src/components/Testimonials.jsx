import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const COLORS = [
  "#4285F4", // Blue
  "#34A853", // Green
  "#FBBC05", // Yellow
  "#EA4335", // Red
  "#FF6D01", // Orange
  "#9C27B0", // Purple
  "#673AB7", // Deep Purple
];

const generateAvatar = (name, size = 150) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorIndex =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    COLORS.length;
  const backgroundColor = COLORS[colorIndex];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 150 150">
      <circle cx="75" cy="75" r="75" fill="${backgroundColor}"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy=".35em" 
        fill="white" 
        font-family="Arial, sans-serif" 
        font-size="60"
        font-weight="500"
      >
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const testimonialSet1 = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    role: "Family Physician",
    text: "This system has completely transformed my practice. The centralized patient management saves me hours each day, and the integrated records give me all the information I need at my fingertips. My patients appreciate the reduced waiting times too!",
    avatar: generateAvatar("Dr. Sarah Johnson"),
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Patient",
    text: "Booking appointments is now hassle-free! I love getting real-time updates about my place in the queue - no more sitting in waiting rooms for hours. Being able to access my health records and prescriptions online is incredibly convenient.",
    avatar: generateAvatar("Michael Chen"),
  },
  {
    id: 3,
    name: "Dr. Robert Garcia",
    role: "Clinic Director",
    text: "The performance analytics have given us valuable insights to optimize our operations. We've reduced patient waiting times by 40% and improved doctor scheduling efficiency. The integrated patient records system is secure and comprehensive.",
    avatar: generateAvatar("Dr. Robert Garcia"),
  },
];

const testimonialSet2 = [
  {
    id: 4,
    name: "Emily Patel",
    role: "Healthcare Administrator",
    text: "Managing multiple doctors' schedules used to be a nightmare. This system makes it effortless. The performance reports help us make data-driven decisions, and patient satisfaction has increased significantly since implementation.",
    avatar: generateAvatar("Emily Patel"),
  },
  {
    id: 5,
    name: "Dr. James Wilson",
    role: "Specialist Physician",
    text: "The seamless consultation process and integrated patient records have revolutionized my practice. I can review patient history, add prescriptions, and update medical records all in one place. Truly smarter consultations for better healthcare.",
    avatar: generateAvatar("Dr. James Wilson"),
  },
  {
    id: 6,
    name: "Sophia Rodriguez",
    role: "Regular Patient",
    text: "I used to dread doctor appointments because of the long waits. Now I receive real-time queue updates, can access my prescriptions online, and book appointments without any hassle. This system has made healthcare so much more accessible!",
    avatar: generateAvatar("Sophia Rodriguez"),
  },
];

const TestimonialCard = ({ name, role, text, avatar }) => (
  <div className="shrink-0 w-[280px] sm:w-[320px] lg:w-[400px] rounded-xl overflow-hidden relative grid grid-cols-[5rem,1fr] transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group">
    <div className="h-full bg-[#033C7A]/5 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#033C7A]/10">
      <img
        src={avatar}
        alt={name}
        className="w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 rounded-full object-cover border-2 border-[#033C7A]/20 transition-all duration-300 group-hover:border-[#033C7A]/40"
      />
    </div>
    <div className="bg-[#033C7A]/5 p-4 sm:p-5 lg:p-6 relative transition-colors duration-300 group-hover:bg-[#033C7A]/10">
      <div className="relative z-10">
        <span className="block font-semibold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 text-[#033C7A]">
          {name}
        </span>
        <span className="block mb-2 sm:mb-3 text-sm lg:text-base font-medium text-[#033C7A]/70">
          {role}
        </span>
        <span className="block text-sm lg:text-base text-[#033C7A]/60 leading-relaxed line-clamp-4">
          {text}
        </span>
      </div>
      <span className="text-2xl sm:text-2xl lg:text-2xl absolute -top-2 right-2 text-[#FEDA2B]/40 font-serif transition-colors duration-300 group-hover:text-[#FEDA2B]/60">
        "
      </span>
    </div>
  </div>
);

// Scrolling row of testimonials
const TestimonialRow = ({ direction = "right", speed = 1, testimonials }) => {
  const [offset, setOffset] = useState(0);
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  const calculateItemsNeeded = () => {
    if (!width) return testimonials.length;
    const itemWidth = width < 640 ? 280 : width < 1024 ? 320 : 400;
    const gap = 24;
    return Math.ceil((width * 2) / (itemWidth + gap)) + 1;
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed > 16) {
        // Limit to ~60fps
        setOffset((curr) => {
          const itemWidth = width < 640 ? 280 : width < 1024 ? 320 : 400;
          const gap = 24;
          const moveBy =
            (direction === "right" ? -1 : 1) * speed * (elapsed / 16);
          const newOffset = curr + moveBy;
          const resetPoint = -(testimonials.length * (itemWidth + gap));

          if (direction === "right" && newOffset <= resetPoint) {
            return 0;
          } else if (direction === "left" && newOffset >= 0) {
            return resetPoint;
          }
          return newOffset;
        });
        lastTimeRef.current = timestamp;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, speed, width, testimonials]);

  const itemsNeeded = calculateItemsNeeded();
  const repeatedTestimonials = Array(itemsNeeded).fill(testimonials).flat();

  return (
    <div className="flex items-center mb-6" ref={containerRef}>
      <div className="relative overflow-x-hidden w-full">
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div
          className="flex gap-6 px-4 py-4 overflow-y-hidden will-change-transform"
          style={{
            transform: `translate3d(${Math.round(offset)}px, 0, 0)`,
            width: "max-content",
            backfaceVisibility: "hidden",
          }}
        >
          {repeatedTestimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={`${testimonial.id}-${idx}`}
              {...testimonial}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Testimonials Section
const Testimonials = () => {
  const titleWords = ["Effortless", "Appointments.", "Smarter", "Healthcare."];

  return (
    <div className="bg-white sm:py-16 lg:py-20">
      <div className="overflow-visible relative">
        <TestimonialRow
          direction="right"
          speed={0.8}
          testimonials={testimonialSet1}
        />
        <TestimonialRow
          direction="left"
          speed={0.8}
          testimonials={testimonialSet2}
        />
      </div>
    </div>
  );
};

export default Testimonials;