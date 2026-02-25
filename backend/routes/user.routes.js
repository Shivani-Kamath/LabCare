const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.get("/", userController.getUsers); // ⬅️ this supports ?role=technician
router.get("/id/:id", userController.getUserById);
router.get("/email/:email", userController.getUserByEmail);
router.get("/staffs", userController.getStaffs);
router.post("/logout", userController.logout);

module.exports = router;
