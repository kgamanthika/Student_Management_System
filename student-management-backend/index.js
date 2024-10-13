import express from 'express';
import mongoose from 'mongoose';

const app = express();

const mongoUrl = "mongodb+srv://user:amesh2318@cluster0.w8lnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB without deprecated options
mongoose.connect(mongoUrl)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

app.listen(5000, () => {
    console.log("Server is running");
});
