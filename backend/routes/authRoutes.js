const express = require("express");

const {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    message: "Authenticated successfully",
    user: req.user,
  });
});

router.patch("/profile", protect, updateProfile);

router.patch("/password", protect, changePassword);

module.exports = router;