import express from "express";
import { body } from "express-validator";
import { verifyToken, adminOnly } from "../middlewares/authMiddleware.js";
import {
  addPatient,
  deletePatient,
  getAllPatients,
  getPatient,
  updatePatient,
} from "../controllers/patientController.js";

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  addDoctor,
  getAllDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../controllers/servicesController.js";
import { getAllTransactions } from "../controllers/paymentController.js";
import {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

const patientValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),

  body("age")
    .isInt({ min: 1 })
    .withMessage("Age must be a positive integer")
    .notEmpty()
    .withMessage("Age is required"),

  body("gender")
    .isIn(["Male", "Female"])
    .withMessage("Gender must be 'Male' or 'Female'")
    .notEmpty()
    .withMessage("Gender is required"),

  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("Description is required"),
];

const userValidation = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email"),
];

const doctorValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("specialization")
    .isString()
    .withMessage("Specialization must be a string")
    .notEmpty()
    .withMessage("Specialization is required"),
  body("phone")
    .isString()
    .withMessage("Phone must be a string of digits")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must not exceed 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),
  body("gender")
    .isString()
    .isIn(["Male", "Female"])
    .withMessage("Gender must be either Male or Female"),
  body("age")
    .isInt({ min: 1, max: 120 })
    .withMessage("Age must be a positive integer"),
  body("status")
    .isString()
    .isIn(["Active", "Away"])
    .withMessage("status should be Active or Away"),
];

//Verify Admin
router.get("/verify", verifyToken, adminOnly, async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Verified Admin",
  });
});

//Patient Routes
router.get("/patients", verifyToken, adminOnly, getAllPatients);

router.get("/patients/:id", verifyToken, adminOnly, getPatient);

router.post("/patients", verifyToken, adminOnly, patientValidation, addPatient);

router.put(
  "/patients/:id",
  verifyToken,
  adminOnly,
  patientValidation,
  updatePatient
);

router.delete("/patients/:id", verifyToken, adminOnly, deletePatient);

//User Routes
router.get("/users", verifyToken, adminOnly, getAllUsers);

router.get("/users/:id", verifyToken, adminOnly, getUser);

router.put("/users/:id", verifyToken, adminOnly, userValidation, updateUser);

router.delete("/users/:id", verifyToken, adminOnly, deleteUser);

//Doctor Routes
router.get("/doctors", verifyToken, adminOnly, getAllDoctors);

router.get("/doctors/:id", verifyToken, adminOnly, getDoctor);

router.post("/doctors", verifyToken, adminOnly, doctorValidation, addDoctor);

router.put(
  "/doctors/:id",
  verifyToken,
  adminOnly,
  doctorValidation,
  updateDoctor
);

router.delete("/doctors/:id", verifyToken, adminOnly, deleteDoctor);

//Services Routes
router.get("/services", verifyToken, adminOnly, getAllServices);

router.get("/services/:id", verifyToken, adminOnly, getServiceById);

router.post("/services", verifyToken, adminOnly, createService);

router.put("/services", verifyToken, adminOnly, updateService);

router.delete("/services", verifyToken, adminOnly, deleteService);

//Transaction Routes
router.get("/payment", verifyToken, adminOnly, getAllTransactions);

//Appointment Routes
router.get("/appointments", verifyToken, adminOnly, getAllAppointments);

router.get("/appointments/:id", verifyToken, adminOnly, getAppointment);

router.post("/appointments", verifyToken, adminOnly, createAppointment);

router.put("/appointments/:id", verifyToken, adminOnly, updateAppointment);

export default router;
