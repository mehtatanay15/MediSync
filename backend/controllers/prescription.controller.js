import Patient from "../models/patient.model.js";
import Prescription from "../models/prescription.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import TestCentre from "../models/prescription.model.js";
import Appointment from "../models/appointment.model.js";
import Doctor from "../models/doctor.model.js";

const generatePrescriptionPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findById(id)
      .populate({
        path: "appointment",
        populate: [
          { path: "doctor", populate: { path: "user", select: "name email phone" } },
          { path: "clinic" },
          { path: "patient", populate: { path: "user", select: "name email" } }
        ]
      })
      .populate("medical_tests");

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    const { appointment } = prescription;
    const doctorUser = appointment?.doctor?.user || {};
    const patientUser = appointment?.patient?.user || {};

    const doctorDetails = {
      name: doctorUser.name || "Not Available",
      email: doctorUser.email || "Not Available",
      phone: appointment.doctor?.phone || "Not Available",
      specialization: appointment.doctor?.specialization || "General",
      experience: appointment.doctor?.experience ? `${appointment.doctor.experience} years` : "Not Specified",
      gender: appointment.doctor?.gender || "Not Specified"
    };

    const clinicDetails = {
      name: appointment.clinic?.name || "Not Available",
      address: appointment.clinic?.location || "Not Available",
      contact: appointment.clinic?.contact || "Not Available",
      opens_at: appointment.clinic?.opens_at || "Not Available",
      closes_at: appointment.clinic?.closes_at || "Not Available",
    };

    const patientDetails = {
      name: patientUser.name || "Not Available",
      email: patientUser.email || "Not Available"
    };

    //
    const medicalTestDetails = [];
    for (const test of prescription.medical_tests || []) {
      const testCentre = test.center ? await TestCentre.findById(test.center) : null;
      medicalTestDetails.push({
        name: test.test_name || "None",
        description: test.description || "No Description",
        price: test.price ? `$${test.price}` : "Not Available",
        centreName: testCentre?.name || "Not Available",
        centreAddress: testCentre?.address || "Not Available",
        centrePhone: testCentre?.phone || "Not Available"
      });
    }

    const prescriptionDate = prescription.createdAt.toLocaleString();
    const pdfGenerationDate = new Date().toLocaleString();

    const pdfPath = `prescription_${id}.pdf`;
    const doc = new PDFDocument({ margin: 30 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text("Prescription Details", { align: "center" }).moveDown();

    // Doctor
    doc.fontSize(16).text("Doctor Details", { underline: true }).fontSize(12);
    Object.entries(doctorDetails).forEach(([key, value]) => doc.text(`${key[0].toUpperCase() + key.slice(1)}: ${value}`));
    doc.moveDown();

    // Clinic
    doc.fontSize(16).text("Clinic Details", { underline: true }).fontSize(12);
    Object.entries(clinicDetails).forEach(([key, value]) => doc.text(`${key[0].toUpperCase() + key.slice(1)}: ${value}`));
    doc.moveDown();

    // Patient
    doc.fontSize(16).text("Patient Details", { underline: true }).fontSize(12);
    Object.entries(patientDetails).forEach(([key, value]) => doc.text(`${key[0].toUpperCase() + key.slice(1)}: ${value}`));
    doc.moveDown();

    // Prescription
    doc.fontSize(16).text("Prescription Info", { underline: true }).fontSize(12);
    doc.text(`Disease: ${prescription.disease}`);
    doc.text(`Medicine: ${prescription.medicine}`);
    doc.text(`Remarks: ${prescription.remarks}`);
    doc.moveDown();

    // Medical Tests
    doc.fontSize(16).text("Medical Test Details", { underline: true });
    if (medicalTestDetails.length > 0) {
      medicalTestDetails.forEach((test, index) => {
        doc.fontSize(12).text(`\n#${index + 1}`);
        Object.entries(test).forEach(([key, value]) => {
          doc.text(`${key[0].toUpperCase() + key.slice(1)}: ${value}`);
        });
      });
    } else {
      doc.fontSize(12).text("No medical tests prescribed.");
    }
    doc.moveDown();

    // Appointment
    doc.fontSize(16).text("Appointment Details", { underline: true }).fontSize(12);
    doc.text(`Date: ${new Date(appointment.date).toDateString()}`);
    doc.text(`Time: ${appointment.time}`);
    doc.text(`Status: ${appointment.status || 'Not specified'}`);
    doc.text(`Reason: ${appointment.reason || 'N/A'}`);
    doc.moveDown();

    // Timestamps
    doc.fontSize(16).text("Timestamps", { underline: true }).fontSize(12);
    doc.text(`Prescription Created On: ${prescriptionDate}`);
    doc.text(`PDF Generated On: ${pdfGenerationDate}`);
    doc.end();

    writeStream.on("finish", async () => {
      const uploadResponse = await cloudinary.uploader.upload(pdfPath, {
        resource_type: "raw",
        folder: "prescriptions"
      });

      prescription.pdf = uploadResponse.secure_url;
      await prescription.save();
      fs.unlinkSync(pdfPath);

      res.json({
        message: "PDF generated & uploaded",
        pdf: uploadResponse.secure_url
      });
    });

  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const create = async (req, res) => {
  try {
    const {appointmentId} = req.params;

    //
    const appointment = await Appointment.findById(appointmentId)
    .populate("doctor clinic patient");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    const doctor = await Doctor.findOne({user: req.user._id});
    if(!doctor) return res.status(404).json({error: "Doctor not found"});

    console.log("appointment.doctor._id : ", appointment.doctor._id.toString());
    console.log("doctor._id : ", doctor._id.toString());

    if (appointment.doctor._id.toString() !== doctor._id.toString()) return res.status(403).json({ error: "Unauthorized" });
    
    const prescription = new Prescription({...req.body, appointment: appointmentId});
    await prescription.save();

    await Patient.findByIdAndUpdate(appointment.patient, {
      $push: { prescriptions: prescription._id }
    });

    res.status(201).json(prescription);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const getAll = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().populate("patient doctor");
    res.json(prescriptions);
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

const getById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate("patient doctor");
    if (!prescription) return res.status(404).json({ message: "Prescription not found" });
    res.json(prescription);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const update = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prescription);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

const deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export default {
  create,
  getAll,
  getById,
  update,
  deletePrescription,
  generatePrescriptionPDF,
}