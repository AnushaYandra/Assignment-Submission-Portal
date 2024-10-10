const jwt = require('jsonwebtoken');

export default async function Authentication (req, res, next) {
    try{
        //Access authorize header to validate request
        const token = req.headers['authorization']?.split(' ')[1]; 
    
        // Check for the Bearer token
        if (!token) {
            return res.status(401).send({ message: 'Token is absent', status: false });
        }

        //Fetch the user details of the logged-in user 
        const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = user; 

        // Call the next middleware function
        next();  
    } catch(error) {
        res.status(401).json({error: "Authentication Failed"})
    }
};
