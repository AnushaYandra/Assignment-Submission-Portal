import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);



/* Admin Registration - POST: http://localhost:8080/admin/register */
export async function registerAdmin(req, res) {

    // Extracting the username and password from the request body
    const { username, password } = req.body;
  
    try {
      // Hashing the password for security
      const hashedPassword = await bcrypt.hash(password, 10);

      //Inserting the user into the 'admins' collection
      const result = await client.db("submissionPortal").collection('admins').insertOne({ username, password: hashedPassword});
  
      if (result.insertedId) {
        //Checking if the insertion was successful
        return res.status(201).send({ message: 'User registered successfully', status: true });
      } else {
        return res.status(500).send({ message: "Couldn't register the user", status: false });
      }
    } catch (error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Internal error", status: false });
    }
};
  
  
/* Admin Login - POST: http://localhost:8080/admin/login */
export async function loginAdmin(req, res) {

    // Extracting the username and password from the request body
    const { username, password } = req.body;
  
    try {
      // Finding the registered admin in the 'admins' collection by username
      const registeredAdmin = await client.db("submissionPortal").collection('admins').findOne({username});
  
      // Checking if the admin exists and comparing the provided password with the stored hashed password
      if (registeredAdmin && await bcrypt.compare(password, registeredAdmin.password)) {

        // Generate a JWT token if the admin is found and password matches
        const token = jwt.sign({id : registeredAdmin._id, admin: registeredAdmin.username}, process.env.JWT_SECRET_KEY);
        return res.json({token});
      } else {
        return res.status(401).send({ message: 'Incorrect Details', status: false });
      }
    } catch (error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Couldn't Log In", status: false });
    }
};
  
  
/* Get all the assignments - GET: http://localhost:8080/admin/assignments */
export async function viewAssignments(req, res) {
  
    // Extracting the admin's name from the JWT payload
    const adminName = req.user.admin; 
  
    try {
      // Fetching all assignments tagged to the admin from the 'assignments' collection
      const assignments = await client.db("submissionPortal").collection('assignments').find({ admin: adminName }).toArray();

      // Sending the fetched assignments as a response
      res.send(assignments);
    } catch (error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Internal error", status: false });
    }
};
  
  
/* Accept an assignment - POST: http://localhost:8080/admin/assignments/:id/accept */
export async function acceptAssignment(req, res) {

    // Extracting the user's assignment id from the URL parameters
    const id = req.params.id; 
  
    try {
      // Updating the assignment status to 'accepted' 
      const result = await client.db("submissionPortal").collection('assignments').updateOne(
        { _id: new ObjectId(id) }, // Finding the assignment by its unique ObjectId
        { $set: { status: 'accepted'} } // Updating status
      );

      // If the update was successful, return a success message
      if (result.modifiedCount === 0) 
        return res.status(404).json({ message: 'Assignment not found' });
      res.json({ message: 'Assignment accepted' });
    } catch(error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Error", status: false });
    }
};
  
  
/* Reject an assignment - POST: http://localhost:8080/admin/assignments/:id/reject */
export async function rejectAssignment(req, res) {

    // Extracting the user's assignment id from the URL parameters
    const id = req.params.id;
  
    try {
      // Updating the assignment status to 'rejected' 
      const result = await client.db("submissionPortal").collection('assignments').updateOne(
        { _id: new ObjectId(id) }, // Finding the assignment by its unique ObjectId
        { $set: { status: 'rejected' } } // Updating status
      );

      // If the update was successful, return a success message
      if (result.modifiedCount === 0) return res.status(404).json({ message: 'Assignment not found' });
      res.json({ message: 'Assignment rejected' });
    } catch(error) {

      // Logging any errors
      console.error(error);
      return res.status(500).send({ message: "Error", status: false });
    }
};
