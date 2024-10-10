const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);


/* User Registration - POST: http://localhost:8080/user/register */
export async function registerUser(req, res) {

    // Extracting the username and password from the request body
    const { username, password } = req.body;
  
    try {
      // Hashing the password for security
      const hashedPassword = await bcrypt.hash(password, 10); 

      //Inserting the user into the 'users' collection
      const result = await client.db("submissionPortal").collection('users').insertOne({ username, password: hashedPassword}); 
  
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


/* User Login - POST: http://localhost:8080/user/login */
export async function loginUser(req, res) {

    // Extracting the username and password from the request body
    const { username, password } = req.body;
  
    try {
      // Finding the registered user in the 'users' collection by username
      const registeredUser = await client.db("submissionPortal").collection('users').findOne({username});  
  
      // Checking if the user exists and comparing the provided password with the stored hashed password
      if (registeredUser && await bcrypt.compare(password, registeredUser.password)) { 

        // Generate a JWT token if the user is found and password matches
        const token = jwt.sign({id : registeredUser._id}, process.env.JWT_SECRET_KEY);
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


/* Upload an assignment - POST: http://localhost:8080/user/upload */
export async function uploadAssignment(req, res) {

    // Extracting the userId, task and admin from the request body
    const {userId, task, admin} = req.body;

    // Current date and time for assignment creation
    const createAt =  new Date(); 

    try {
      // Inserting the assignment into the 'assignments' collection with a pending status
      await client.db("submissionPortal").collection('assignments').insertOne({userId, task, admin, createAt, status : "Pending"});
      return res.status(201).send({ message: 'Submitted assignment successfully', status: true });
    } catch (error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Internal error", status: false });
    }
};


/* Get all Admins - GET: http://localhost:8080/user/admins */
export async function allAdmins(req, res) {
    try {
       // Getting all the admins by fetching distinct usernames from the 'admins' collection
      const result = await client.db("submissionPortal").collection('admins').distinct('username');
      res.send(result);
    } catch (error) {

      // Logging any errors
      console.error(error); 
      return res.status(500).send({ message: "Internal error", status: false });
    }
};
