const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "username already exists"],
      required: [true, "this field is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "email already exists"],
      required: [true, "this field is required"],
      trim: true,
      lowercase: true,
    },
    tasks: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true }
);

userSchema.index({ username: "text" });

const User = mongoose.model("User", userSchema);
module.exports = User;
