import { sync } from "tar/lib/mkdir.js";
import Appointment from "../models/appointment.model.js";
import Clinic from "../models/clinic.model.js";
import { ObjectId } from "mongodb";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import mongoose from "mongoose"

// export const getAvailableDates = async (req, res) => {
//     try {
//         const clinic_initials = req.body.unique_initials
//         const clinic = await Clinic.findOne({ unique_initials: clinic_initials })
//         const latest_available_date = clinic.latest_available_date

//         return res.status(201).json(latest_available_date)

//     } catch (error) {
//         console.error("Error getting available dates:", error);
//         return res.status(500).json({ error: "Internal Server Error" });

//     }
// }

export const createAppointment = async (req, res) => {
    try {
        const [day, month, year] = req.body.preferred_date.split('/').map(Number)
        // const preferred_date = new Date(year, month - 1, day);
        // preferred_date.setHours(0,0,0,0);
        // Fix: Create date string in ISO format (YYYY-MM-DD) and parse it
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const preferred_date = new Date(dateString);
        preferred_date.setHours(0, 0, 0, 0);

        let patientDetails = {};

        const patient = await Patient.findOne({ user: req.user._id });
        if (req.body.isForSelf) {

            if (!patient) {
                return res.status(404).json({ error: "Patient not found" });
            }

            patientDetails = {
                patient_name: patient.name,
                patient_age: patient.age,
                patient_gender: patient.gender,
                patient_blood_group: patient.blood_group,
                patient_phone: patient.phone,
                patient_address: patient.address
            }
        } else {
            patientDetails = {
                patient_name: req.body.patient_name,
                patient_age: req.body.patient_age,
                patient_gender: req.body.patient_gender,
                patient_blood_group: req.body.patient_blood_group,
                patient_phone: req.body.patient_phone,
                patient_address: req.body.patient_address
            }
        }

        let clinicId = req.body.clinic;
        if (!clinicId) {
            const clinicFound = await Clinic.findOne({ doctor: req.body.doctor });
            if (!clinicFound) {
                return res.status(404).json({ error: "No clinic found for the selected doctor." });
            }
            clinicId = clinicFound._id;
        }

        const existingAppointment = await Appointment.findOne({
            patient: patient?._id,
            doctor: req.body.doctor,
            preferred_date: preferred_date
        });
        
        if (existingAppointment) {
            return res.status(400).json({
                error: `You already have an appointment with this doctor on ${preferred_date.toDateString()}`
            });
        }

        const appointment = new Appointment({ patient, ...req.body, ...patientDetails });

        appointment.preferred_date = preferred_date;
        appointment.clinic = clinicId;
        const no_of_appointments = await Appointment.countDocuments({ preferred_date: { "$gte": preferred_date }, clinic: new ObjectId(req.body.clinic), status: { $nin: ["Completed"] } })
        const clinic = await Clinic.findOne({ _id: new ObjectId(clinicId) })
        console.log("clinic capacity: ", clinic.capacity)
        if (no_of_appointments == 0) {
            appointment.appointment_number = 1
            


        }else if (clinic.capacity == no_of_appointments + 1) {
            
                console.log(req.user)
                const nextDate = new Date(clinic.latest_available_date)
                nextDate.setDate(clinic.latest_available_date.getDate() + 1)
                clinic.latest_available_date = nextDate
                await clinic.save()
                await clinic.updateOne()
                
                appointment.appointment_number = 1
            

        }else if (no_of_appointments >= clinic.capacity) {
            
                // console.log("reached here")
                // const nextDate = new Date(clinic.latest_available_date)
                // nextDate.setDate(clinic.latest_available_date.getDate() + 1)
                // clinic.latest_available_date = nextDate
                // await clinic.save()
                // appointment.appointment_number = 1
                return res.status(400).json({ error: `Clinic is fully booked for this date => ${preferred_date.toDateString()}` });
        }else {


                appointment.appointment_number = no_of_appointments + 1
        }

        await appointment.save();
        

        if (patient && req.body.doctor) {
            await Patient.findByIdAndUpdate(
                patient._id,
                { $addToSet: { doctors: req.body.doctor } },
                { new: true }
            );
        }
        
        return res.status(201).json(appointment);

    } catch (error) {
        console.error("Error creating appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const readAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("patient doctor clinic");

        return res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching all appointments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllAppointmentsByPatientId = async (req, res) => {
    try {
        const { _id: patientId } = req.patient;
        const appointments = await Appointment.find({ patient: patientId })
            .populate("patient doctor clinic");

        return res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching patient appointments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllAppointmentsByDate = async (req, res) => {
    try {
        const [day, month, year] = req.body.preferred_date.split('/').map(Number)
        const preferred_date = new Date(year, month - 1, day);
        const appointments = await Appointment.find({ preferred_date: { "$gte": preferred_date } })
            .populate("patient doctor clinic");

        return res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments by date:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

export const readAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("patient doctor clinic");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json(appointment);
    } catch (error) {
        console.error("Error fetching appointment by ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const patientId = req.user._id;

        const updateOptions = { new: true, runValidators: true };
        const appointment = await Appointment.findOneAndUpdate({ _id: appointmentId, patient: patientId }, req.body, updateOptions)
            .populate("patient doctor clinic");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        return res.status(200).json(appointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const appointmentId = req.params;
        const patientId = req.user._id;

        const appointment = await Appointment.findOneAndDelete({ _id: appointmentId, patient: patientId });

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        return res.status(200).json({ message: "Appointment deleted successfully.", appointment });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAppointmentsByConsultationStatus = async (req, res) => {
    try {
        const { status } = req.params;

        const validStatuses = ['Ongoing', 'Delayed', 'Queued', 'Not_Arrived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid consultation status provided." });
        }

        const appointments = await Appointment.find({ consultation_status: status })
            .populate("patient doctor clinic");

        return res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments by consultation status:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAppointmentsByDoctorId = async (req, res) => {
    try {
        const doctorId = req.user._id;
        console.log("Doctor ID from Request:", doctorId);

        const appointments = await Appointment.find({ doctor: doctorId })
            .populate("doctor patient clinic");

        console.log("Appointments Found:", appointments);

        if (appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this doctor." });
        }

        return res.status(200).json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments by doctor ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const approveAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' })
        }

        appointment.status = 'Approved'
        await appointment.save()

        res.status(200).json({ message: 'Appointment approved successfully', appointment })
    } catch (error) {
        res.status(500).json({ message: 'Error approving appointment', error: error.message })
    }
}

export const rejectAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' })
        }

        appointment.status = 'Rejected'
        await appointment.save()

        res.status(200).json({ message: 'Appointment rejected successfully', appointment })
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting appointment', error: error.message })
    }
}

export const getAvailableBookingDates = async (req, res) => {
    try {
        const { clinicId } = req.params;
        const clinic = await Clinic.findById(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: "Clinic not found" });
        }

        const availableDates = [];
        const daysToCheck = 30; // check next 30 days
        const requiredAvailableDates = 7; // show top 7 available dates

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < daysToCheck && availableDates.length < requiredAvailableDates; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Skip weekends (optional)
            if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;

            // Create date string in consistent format
            const dateString = currentDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
            const dayStart = new Date(dateString);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dateString);
            dayEnd.setHours(23, 59, 59, 999);

            const appointmentsCount = await Appointment.countDocuments({
                preferred_date: { $gte: dayStart, $lte: dayEnd },
                clinic: new mongoose.Types.ObjectId(clinicId),
                status: { $nin: ["Completed"] },
            });

            const slotsLeft = Math.max(0, clinic.capacity - appointmentsCount);

            if (slotsLeft > 0) {
                availableDates.push({
                    date: currentDate.toISOString().split("T")[0], // "YYYY-MM-DD"
                    slots_left: slotsLeft
                });
            }
        }

        return res.status(200).json(availableDates);

    } catch (error) {
        console.error("Error fetching available booking dates:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const appointmentsToday = async (req, res) => {
    try {
        // const { clinicId } = req.params;
        const clinicId = req.clinic._id;
        if (!clinicId) {
            return res.status(400).json({ message: 'clinicId is required' });
        }

        // Get today's date (local time)
        const now = new Date();

        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Create query base for today
        const baseQuery = {
            preferred_date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            clinic: clinicId
        };

        // Parallel fetch per status
        const [notArrived, queued, ongoing, completed] = await Promise.all([
            Appointment.find({ ...baseQuery, status: 'Not Arrived' }),
            Appointment.find({ ...baseQuery, status: 'Queued' }),
            Appointment.find({ ...baseQuery, status: 'Ongoing' }),
            Appointment.find({ ...baseQuery, status: 'Completed' }),
        ]);

        res.status(200).json({
            "Not Arrived": notArrived,
            "Queued": queued,
            "Ongoing": ongoing,
            "Completed": completed,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};

export const appointmentsDate = async (req, res) => {
    try {
        // const { clinicId } = req.params;
        const clinicId = req.clinic._id;
        const { date } = req.query;

        if (!clinicId || !date) {
            return res.status(400).json({ message: 'clinicId (param) and date (query) are required' });
        }

        // Parse and validate the date
        const inputDate = new Date(date);
        if (isNaN(inputDate)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // Get start and end of the given date
        const startOfDay = new Date(inputDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(inputDate);
        endOfDay.setHours(23, 59, 59, 999);

        const baseQuery = {
            clinic: clinicId,
            preferred_date: { $gte: startOfDay, $lte: endOfDay },
        };

        // Fetch appointments by status in parallel
        const [notArrived, queued, ongoing, completed] = await Promise.all([
            Appointment.find({ ...baseQuery, status: 'Not Arrived' }),
            Appointment.find({ ...baseQuery, status: 'Queued' }),
            Appointment.find({ ...baseQuery, status: 'Ongoing' }),
            Appointment.find({ ...baseQuery, status: 'Completed' }),
        ]);

        res.status(200).json({
            date: inputDate.toISOString().split('T')[0],
            clinicId,
            appointments: {
                notArrived,
                queued,
                ongoing,
                completed
            }
        });
    } catch (err) {
        console.error('Error fetching appointments by status:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const forwardTransitions = {
    'Not Arrived': 'Queued',
    'Queued': 'Ongoing',
    'Ongoing': 'Completed',
};

const reverseTransitions = {
    'Queued': 'Not Arrived',
    'Ongoing': 'Queued',
    'Completed': 'Ongoing',
};

export const forward = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const currentStatus = appointment.status;
        const expectedNextStatus = forwardTransitions[currentStatus];

        // If no valid next status exists, return an error
        if (!expectedNextStatus) {
            return res.status(400).json({
                message: `No valid next status for '${currentStatus}'`,
            });
        }

        // Automatically update the status to the next valid status
        appointment.status = expectedNextStatus;
        await appointment.save();

        return res.status(200).json({ message: `Status updated to ${expectedNextStatus}`, appointment });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const reverse = async (req, res) => {
    try {
        const { appointmentId } = req.params;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const currentStatus = appointment.status;
        const previousStatus = reverseTransitions[currentStatus];

        // If no previous status exists (i.e., already at the beginning), return an error
        if (!previousStatus) {
            return res.status(400).json({
                message: `No previous status to revert to for '${currentStatus}'`,
            });
        }

        // Revert to the previous status using the reverse mapping
        appointment.status = previousStatus;
        await appointment.save();

        return res.status(200).json({ message: `Status reverted to ${previousStatus}`, appointment });
    } catch (error) {
        console.error("Error reverting appointment status:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// giving clinic and doctor both the access for appointment routes
// middleware to check if clinic or doctor is trying to access the route
export const verifyClinicOrDoctor = async(req,res,next) => {
    try{
        const user_id = req.user._id;

        const clinic = await Clinic.findOne({user: user_id});
        if(clinic){
            req.clinic = clinic;
            return next();
        }

        // if it is not a clinic, then try to find a doctor
        const doctor = await Doctor.findOne({user: user_id});
        // if doctor is found, then find the associated clinic with him
        if(doctor){
            const clinicOfFoundDoctor = await Clinic.findOne({doctor: doctor._id});
            
            if(clinicOfFoundDoctor){
                req.clinic = clinicOfFoundDoctor
                req.doctor = doctor
                return next();
            }
        }

        return res.status(400).json({message: "Should be Clinic or Doctor"})
    }catch(e){
        return res.status(500).json({error: e.message})
    }
}