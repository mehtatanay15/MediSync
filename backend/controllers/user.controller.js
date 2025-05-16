import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from 'nodemailer'
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";
import Clinic from "../models/clinic.model.js";

const otp_store = {}

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "Account created", user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const sendOTP = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const sendOTPEmail = async (to, otp) => {
        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
        });
    };

    const { email, checkForEmail } = req.body;
	if (checkForEmail == true) {
		const existingUser = await User.findOne({ email: email });
		if (!existingUser) {
			return res.status(400).json({ error: "User does not exist." });
		}
	}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;

    otp_store[email] = { otp, expiresAt }
    try {
        await sendOTPEmail(email, otp);
        res.send("OTP sent to email. If you do not receive it in 5 mins, check your spam.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error sending OTP");
    }

}

const verifyOTP = async (req, res) => {
    try {
        const { email, otp, newPassword, checkForEmail } = req.body;
		if (checkForEmail == true) {
			const existingUser = await User.findOne({ email: email });
			if (!existingUser) {
				return res.status(400).json({ error: "User does not exist." });
			}
		}

        const record = otp_store[email];
        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).send("Invalid or expired OTP");
        }
		res.status(200).send("Valid OTP");
    }catch (e) {
        console.error(e);
        res.status(400).json("Could not reset password.")
    }

}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword} = req.body;
		const existingUser = await User.findOne({ email: email });
		if (!existingUser) {
			return res.status(400).json({ error: "User does not exist." });
		}

        const record = otp_store[email];
        if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
            return res.status(400).send("Invalid or expired OTP");
        }

        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne({ email }, { "$set": { password: hashedPassword } });
        delete otp_store[email];

        res.status(200).send("Password updated successfully");

    } catch (e) {
        console.error(e);
        res.status(400).json("Could not reset password.")
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.updateOne({ email }, { "$set": { password: hashedPassword } });

        res.status(400).send("Password changed successfully.")

    } catch (e) {
        console.error(e);
        res.status(400).json("Could not change password")
    }

}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        let roleId = null;

        switch (user.role) {
            case "Patient":
                const patient = await Patient.findOne({ user: user._id });
                roleId = patient?._id;
                break;
            case "Clinic":
                const clinic = await Clinic.findOne({ user: user._id });
                roleId = clinic?._id;
                break;
            case "Doctor":
                const doctor = await Doctor.findOne({ user: user._id });
                roleId = doctor?._id;
                break;
        }

        // allow if roleId is empty
        // profile creation might not have been done
        // if (!roleId) {
        //     return res.status(404).json({ message: `No ${user.role} profile found for user.` });
        // }

        const payload = {
            _id: user._id,
            role: user.role,
            roleId, 
            email: user.email,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1000h" }
        );

        res.json({ message: "Login successful", token, user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

const updateAccount = async (req, res) => {
    try {
        // const { id } = req.params;
        const userId = req.user._id;

        // if (userId.toString() !== id) {
        //     return res.status(403).json({ message: "Unauthorized to update this account." });
        // }

        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
const deleteAccount = async (req, res) => {
    try {
        // const { id } = req.params;
        const userId = req.user._id;

        // if (userId.toString() !== id) {
        //     return res.status(403).json({ message: "Unauthorized to delete this account." });
        // }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "Account Deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

export default {
    register,
    login,
    sendOTP,
	verifyOTP,
    resetPassword,
    changePassword,
    updateAccount,
    deleteAccount,
};
