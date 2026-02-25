const bcrypt = require("bcrypt");
const Users = require("../models/user");

// 🔒 Hash password
const hashPassword = (password, rounds = 10) => {
  const salt = bcrypt.genSaltSync(rounds);
  return bcrypt.hashSync(password, salt);
};

// 📝 Register user
module.exports.registerUser = async (req, res) => {
  try {
    const hashed = hashPassword(req.body.password);
    const newUser = await Users.create({
      full_name: req.body.full_name,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      password: hashed,
    });
    res.status(201).json({ message: "User registered", newUser });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🔐 Login
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔁 Forgot password (DB direct reset)
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'email and newPassword required' });
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const hashed = hashPassword(newPassword);
    await Users.updateOne({ _id: user._id }, { $set: { password: hashed } });
    res.json({ message: 'Password updated' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// 🚪 Logout
module.exports.logout = async (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  }).status(200).json("User has been logged out");
};

// 👥 Get all users or filter by role
module.exports.getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role; // ✅ support role-based filtering
    }
    const users = await Users.find(query).select("-password"); // exclude password
    res.status(200).json({ users });
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(400).json({ error: err.message });
  }
};

// 🧑‍🏫 Get only staff (optional)
module.exports.getStaffs = async (req, res) => {
  try {
    const staffs = await Users.find({ designation: "staff" }).select("-password");
    res.status(200).json({ staffs });
  } catch (error) {
    console.error("❌ Get staff error:", error);
    res.status(400).json({ error: error.message });
  }
};

// 🔍 Get user by ID
module.exports.getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get user by email
module.exports.getUserByEmail = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.params.email }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Get user by email error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
