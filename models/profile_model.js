const mongoose = require("mongoose")

const profile_schema = new mongoose.Schema({
    user:
    {
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"user"
    },
    bio:
    {
        type:String,
        default:""
    },
    avatar:
    {
        type:String,
        default:""
    },
    location:
    {
        type:String,
        default:""
    }
},{timestamps:true})

const profile_model = mongoose.model("profile",profile_schema)

module.exports = profile_model