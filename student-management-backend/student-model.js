import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: String, required: true }, // Use Date if you prefer
    reg: { type: String, required: true, unique: true }
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
