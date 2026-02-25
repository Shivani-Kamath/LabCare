const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "technician", "lab_incharge", "admin"],
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

// userSchema.pre("save", async function(next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
