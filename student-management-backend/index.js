import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Student from './student-model.js'; // Correctly import the student model

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb+srv://user:amesh2318@cluster0.w8lnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// POST route to add a student
app.post('/students', (req, res) => {
  const studentData = req.body;
  const student = new Student(studentData);

  student.save()
    .then(() => {
      res.status(201).send("Student added successfully");
    })
    .catch((error) => {
      res.status(500).send("Error adding student: " + error.message);
    });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
