const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next) =>{
    try{
         // 1. Check if token is provided in request header
        const authHeader = req.headers["authorization"]

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ message: "No token provided, not authorized" })
        }
         // 2. Extract token (remove "Bearer ")
         const token = authHeader.split(" ")[1]

         // 3. Verify the token with the secret key
         const verified_token = jwt.verify(token,process.env.JWT_SECRET)
         if(!verified_token){
            return res.status(401).json({ message: "User not authorized" })
         }

          // 4. Save user info in req.user (so controllers know the user)
          req.user = verified_token

         // 5. Allow request to continue
          next()

    }
    catch(error){
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}

module.exports = {authMiddleware}