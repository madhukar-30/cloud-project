import mongoose from "mongoose";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fname: {
      type: String,
      default: "",
    },
    lname: {
      type: String,
      default: "",
    },
    files: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create models based on the schemas
export const User = mongoose.models.User || mongoose.model("User", userSchema);
