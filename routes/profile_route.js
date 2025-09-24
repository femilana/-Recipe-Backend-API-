const express = require("express")
const {create_profile,get_profile,single} = require("../controllers/profile_controller")
const {authMiddleware} = require("../middleware/authMiddleware")
const multer = require("multer")

const upload = multer({dest:"upload/"})



route = express.Router()

route.get("/My_profile",authMiddleware,get_profile)
route.post("/create-profile", authMiddleware,upload.single("avatar"),create_profile)
//route.post("/single",field,single)

module.exports = route