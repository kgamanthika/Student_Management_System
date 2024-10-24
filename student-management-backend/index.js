import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Student from './student-model.js'; // Import your student model

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

// GET route to fetch students
app.get("/students", (req, res) => {
    Student.find()
        .then((students) => {
            console.log("Students fetched:", students); // Log the fetched students
            res.send(students);
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
            res.status(500).send("Error fetching students: " + error.message);
        });
});
// DELETE route to delete a student
app.delete('/students/:id', (req, res) => {
  const id = req.params.id; // Get the student _id from the URL

  // Find and delete the student by _id
  Student.findByIdAndDelete(id)
    .then((deletedStudent) => {
      if (deletedStudent) {
        res.status(200).send("Student deleted successfully");
      } else {
        res.status(404).send("Student not found");
      }
    })
    .catch((error) => {
      console.error("Error deleting student:", error);
      res.status(500).send("Error deleting student: " + error.message);
    });
});

// PUT route to update a student by _id
app.put('/students/:id', (req, res) => {
  const id = req.params.id; // Get the student _id from the URL
  const updatedData = req.body; // Get updated student data

  // Find the student by _id and update
  Student.findByIdAndUpdate(id, updatedData, { new: true }) // new: true returns the updated document
    .then((updatedStudent) => {
      if (updatedStudent) {
        res.status(200).send("Student updated successfully");
      } else {
        res.status(404).send("Student not found");
      }
    })
    .catch((error) => {
      console.error("Error updating student:", error);
      res.status(500).send("Error updating student: " + error.message);
    });
});



// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
