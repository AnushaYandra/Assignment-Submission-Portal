# Assignment Submission Portal - Backend Intern Assignment 

## Objective:
Develop a backend system for an assignment submission portal that allows users to upload assignments and admins to manage them. Users can submit assignments, while admins can view, accept, or reject assignments assigned to them. Admins will have access to assignment details including the user's name, task, and timestamp for efficient management.


## Set up :
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies.
4. Set up a new MongoDB project and connect.
5. Create a .env file with MongoDB URI and JWT secret.
6. Start the server to run the application.


## Explanation :
1. I began by creating a server.js file, which serves as the entry point for the application. I installed all necessary dependencies and configured the MongoDB connection using the MongoClient to establish a connection with the database.

2. Next, I organized the routes into two sections: user routes and admin routes. The registration and login routes are publicly accessible, while the other routes are secured with an authentication middleware that employs JWT to protect the endpoints.

3. I then developed the controller functions, dividing them into two categories: userController and adminController. This division allows for clear and organized logic management for both users and admins within the codebase.

4. In total, I created three collections: Users, Admins, and Assignments. The Users collection stores data for registered users, the Admins collection contains information for registered admins, and the Assignments collection holds the data for uploaded assignments.

5. Assignments can be filtered by their status, showing only those that have been accepted and omitting those that have been rejected.

