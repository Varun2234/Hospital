import { validationResult } from "express-validator";
import doctorModel from "../models/doctorModel.js";
import mongoose from "mongoose";

const addDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  try {
    const doctor = new doctorModel(req.body);
    await doctor.save();

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't create doctor",
      error: err,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    return res.status(200).json({
      success: true,
      message: "All doctors retrieved",
      data: doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err,
    });
  }
};

const getDoctor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID provided",
    });
  }

  try {
    const doctor = await doctorModel.findOne({ doctorID: id });
    return res.status(200).json({
      success: true,
      message: "Successfully retrieved",
      data: doctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't retrieve",
      error: err,
    });
  }
};

const updateDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const updated = await doctorModel.findOneAndUpdate(
      { doctorID: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Updated doctor",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  try {
    const deleted = await doctorModel.findOneAndDelete({ doctorID: id });
    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: deleted,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err,
    });
  }
};

export { addDoctor, getAllDoctors, getDoctor, updateDoctor, deleteDoctor };
