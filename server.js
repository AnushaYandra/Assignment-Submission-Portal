import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { registerUser, loginUser, uploadAssignment, allAdmins } from './Controller/userController.js';
import { registerAdmin, loginAdmin, viewAssignments, acceptAssignment, rejectAssignment } from './Controller/adminController.js';
import Authentication from './Middleware/authentication.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

/* Middleware */
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

/* MongoDB client setup */
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* MongoDB Connection */
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

/* User Routes */
app.post('/user/register', registerUser);
app.post('/user/login', loginUser);
app.post('/user/upload', Authentication, uploadAssignment); //Protected route
app.get('/user/admins', Authentication, allAdmins); //Protected route

/* Admin Routes */
app.post('/admin/register', registerAdmin);
app.post('/admin/login', loginAdmin);
app.get('/admin/assignments', Authentication, viewAssignments); //Protected route
app.post('/admin/assignments/:id/accept', Authentication, acceptAssignment); //Protected route
app.post('/admin/assignments/:id/reject', Authentication, rejectAssignment); //Protected route

/* Connecting to Database */
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
