import appointmentModel from "../models/appointmentModel.js";
import { validationResult } from "express-validator";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";

const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const userID = req.user.id;

  try {
    const pat = await patientModel.findOne({ patientID: userID });
    const patientID = pat._id;

    const exist = await appointmentModel.findOne({
      patientID,
      doctorID: req.body.doctorID,
    });

    const away = await doctorModel.findOne({
      doctorID: req.body.doctorID,
    });

    if (away.status === "Away") {
      return res.status(400).json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    if (exist) {
      return res.status(400).json({
        success: false,
        message: "Appointment Already Exists",
      });
    }

    const appointment = new appointmentModel({
      patientID,
      ...req.body,
    });
    await appointment.save();

    return res.status(201).json({
      success: true,
      message: "Appointment Requested",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Appointment could not be created",
      error: err,
    });
  }
};

const updateAppointment = async (req, res) => {
  const doctorID = req.user._id;

  try {
    const appointment = await appointmentModel.findOneAndUpdate(
      doctorID,
      {
        status: req.body.status,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      data: appointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: "Server error updating",
      error: err,
    });
  }
};

const getAppointment = async (req, res) => {
  const { id: userID, role } = req.user;

  try {
    let filter = {};

    if (role === "doctor") {
      const doctor = await doctorModel.findOne({ doctorID: userID });
      if (!doctor)
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      filter.doctorID = doctor._id;
    } else if (role === "patient") {
      const patient = await patientModel.findOne({ patientID: userID });
      if (!patient)
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      filter.patientID = patient._id;
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role",
      });
    }

    const appointments = await appointmentModel
      .find(filter)
      .populate("doctorID")
      .populate("patientID");

    return res.status(200).json({
      success: true,
      message: "Appointments retrieved successfully",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err.message,
    });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .populate("patientID")
      .populate("doctorID");

    return res.status(200).json({
      success: true,
      message: "All appointments retrieved",
      data: appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching appointments",
      error: err,
    });
  }
};

export {
  createAppointment,
  updateAppointment,
  getAppointment,
  getAllAppointments,
};
