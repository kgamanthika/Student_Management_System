import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Student from './student-model.js'; // Import your student model

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoUrl = "mongodb+srv://user:1234@cluster0.w8lnv.mongodb.net/database-name?retryWrites=true&w=majority"


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

// GET route to fetch students
app.get("/students", (req, res) => {
    Student.find()
        .then((students) => {
            res.send(students);
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
            res.status(500).send("Error fetching students: " + error.message);
        });
});

// PUT route to update a student
app.put('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const updatedData = req.body;

  Student.findByIdAndUpdate(studentId, updatedData, { new: true })
    .then((updatedStudent) => {
      res.status(200).send(updatedStudent);
    })
    .catch((error) => {
      res.status(500).send("Error updating student: " + error.message);
    });
});

// DELETE route to delete a student
app.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;

  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(200).send("Student deleted");
    })
    .catch((error) => {
      res.status(500).send("Error deleting student: " + error.message);
    });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
