const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const user_schema = new mongoose.Schema({
    username:
    {
        type:String,
        unique:true,
        required:[true, "Username is required"],
        trim:true
    },
    email:
    {
        type:String,
        unique:true,
        required:[true, "email is required"],
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password:
    {
        type:String,
        required:[true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    recipe:
    [
        {
            type:mongoose.Types.ObjectId,
            ref:"recipe"
        }
    ]

},{timestamps:true})

// Hash password before saving
user_schema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    next()
    
})

// Hide password in responses
user_schema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password
        return ret
    }
})

user_schema.set("toObject", {
    transform: (doc, ret, options) => {
        delete ret.password
        return ret
    }
})

//exporting model
const user_model = mongoose.model("user",user_schema)

module.exports = user_model