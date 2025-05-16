import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import cron from 'node-cron';
import {swaggerUi, swaggerSpec} from "./config/swagger.js";

// Run every minute
cron.schedule('* * * * *', () => {
  console.log('Running every minute:', new Date());
});

const app = express();

const port = process.env.PORT || 8500;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

// APIs
import userRoute from "./routes/user.route.js";
import prescriptionRoute from "./routes/prescription.route.js";
import doctorRoute from "./routes/doctor.route.js";
import patientRoute from "./routes/patient.route.js";
import appointmentRoute from "./routes/appointment.route.js"
import clinciRoute from "./routes/clinic.route.js"
import medicalTestRoute from "./routes/medical.test.route.js"
import testCenterRoute from "./routes/test.center.route.js"
import medicalHistoryRoute from "./routes/medical.history.routes.js"

app.get("/",async(req,res)=>{res.json({message: "Home Page"})});
app.use("/user",userRoute);
app.use("/user/doctor",doctorRoute);
app.use("/user/patient",patientRoute);
app.use("/prescription",prescriptionRoute);
app.use("/appointment",appointmentRoute)
app.use("/clinic",clinciRoute)
app.use("/medicalTest",medicalTestRoute)
app.use("/testCenter",testCenterRoute)
app.use("/medicalHistory",medicalHistoryRoute)
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});


app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});
