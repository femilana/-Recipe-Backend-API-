const express = require("express")
const {authMiddleware} = require("../middleware/authMiddleware")
const {register_user,login,get_me} = require("../controllers/user_controller")
const route = express.Router()

route.post("/register-user", register_user)
route.post("/login", login)
route.get("/me", authMiddleware,get_me)

module.exports = route