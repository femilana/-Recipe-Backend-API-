const user_model = require("../models/user_model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register_user = async(req,res, next) =>{
    try{
        const {username, email, password} = req.body

        //Validating user input
        if(!username || !email || !password){
            return  res.status(400).json({ message: 'Please provide username, email and password' })
        }
        
        //Validating if user already exist (avoid duplicate emails/usernames)
        const check_user = await user_model.findOne({email})
        if(check_user){
            return res.status(409).json({ message: 'Email already in use' })
        }

        //Creating New User
        const new_user = new user_model({username, email, password})
        await new_user.save()

        return res.status(201).json({
            message:"New User created",
            user_details:
            {
                username:new_user.username,
                email:new_user.email,
                createdAt:new_user.createdAt
            }
        })
    }
    catch(error){
        next(error)
        
    }
}

const login = async(req,res,next) =>{
    try{
        const {email,password} = req.body

        //Validating User Input
        if(!email || !password){
            return res.status(400).json({ message: 'Please provide email and password' })
        }
        
        //Validating if user exist
        const check_user = await user_model.findOne({email})
        if(!check_user){
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        //Validate if Password matches
        const is_match = await bcrypt.compare(password, check_user.password)
        if(!is_match){
            return res.status(401).json({ message: 'Invalid email or password' })
        }
        const token = jwt.sign(
            {id:check_user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES}
        )
        // res.cookie("token",token,{
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 24 * 60 * 60 * 1000
        // })
        return res.status(201).json({
            message:"Login successful",
            user:{
                id:check_user._id,
                username:check_user.username,
                token:token
            }
        })
    }
    catch(error){
        next(error)
    }
}

const get_me = async(req,res,next) =>{
    return res.json({message:"User Profile",
        user:req.user
    })
}

module.exports = {register_user,login,get_me}