import mongoose from "mongoose";

// Define the schema for a student
const studentSchema = new mongoose.Schema({
  reg: {
    type: String,
    required: true,
    unique: true,  // Ensure registration number is unique
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,  // Use Date type for better handling
    required: true,
  },
});

// Export the model
export default mongoose.model("Student", studentSchema);
