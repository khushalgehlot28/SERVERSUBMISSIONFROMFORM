require('dotenv').config(); // Load secrets from .env file
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); // Required for GitHub Pages cross-origin requests

const app = express();

// Middleware
app.use(cors()); // Enables cross-origin resource sharing
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas Cloud!'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Schema & Model
const submissionSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true }
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);

// API Route
app.post('/api/submit', async (req, res) => {
    try {
        const { fullName, email, message } = req.body;
        const newSubmission = new Submission({ fullName, email, message });
        const savedData = await newSubmission.save();

        return res.status(201).json({
            success: true,
            message: 'Submission saved successfully!',
            submissionId: savedData._id
        });
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ success: false, error: 'Failed to save submission.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));