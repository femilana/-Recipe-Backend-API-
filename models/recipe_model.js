const mongoose = require("mongoose")

const recipe_schema = new mongoose.Schema({
    title:
    {
        type:String,
        required:[true, "Recipe title is required"]
    },
    ingredients:
    {
        type:[String],
        required:[true, "Ingredients are required"]
    },
    instructions:
    {
        type: String,
        required:[true, "Instructions are required"]
    },
    image:
    {
        type: [String]
    },
    createdBy:
    {
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    },
    likes:
    [
        {
            type:mongoose.Types.ObjectId,
            ref:"user"
        }
    ],
    comments:
    [
        {
            text:
            {
                type:[String],
                required:true
            },
            createdBy:
            {
                type:mongoose.Types.ObjectId,
                ref:'user',
                required:true
            },
            createdAt:
            {
                type:Date,
                default:Date.now
            }
        }
    ]

},{timestamps:true})

const recipe_model = mongoose.model("recipe",recipe_schema)

module.exports = recipe_model