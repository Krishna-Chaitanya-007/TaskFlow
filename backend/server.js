import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import taskRoutes from './routes/task.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js'; 

import path from 'path'; 
import dotenv from 'dotenv';

// Explicitly define the path to the .env file in the current directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); 
const app = express();

// 1. UPDATE CORS: Allow requests from anywhere (for now)
app.use(cors({
    origin: '*', // ideally you put your Netlify URL here later
    credentials: true
}))
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI; 

// Log the URI to make sure it's correct and not undefined before connecting
console.log('MongoDB URI:', MONGO_URI); 

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


// REGISTER ROUTES 
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes); 


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});