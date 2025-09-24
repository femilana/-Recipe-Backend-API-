const {create_recipe,get_all_recipes,get_recipe,update_recipe,delete_recipe,get_all_recipes_by_user} = require("../controllers/recipe_controller")
const {authMiddleware} = require("../middleware/authMiddleware")
const {like_recipe} = require("../controllers/like_and_unlike controller")
const {add_comment,get_comments,delete_comment,update_comment} = require("../controllers/comment_controller")
const express = require("express")
const route = express.Router()
const multer = require("multer") 
const upload = multer({dest:"uploads/"})
const upload_middleware = upload.fields([{name:"image",maxCount:3}])


route.post("/create-recipe",authMiddleware,upload_middleware,create_recipe)
route.get("/get-all-recipe",authMiddleware,get_all_recipes)
route.get("/get-recipe/:ref",authMiddleware,get_recipe)
route.put("/update-recipe/:ref",authMiddleware,upload_middleware,update_recipe)
route.delete("/delete-recipe/:ref",authMiddleware,delete_recipe)
route.get("/get-all-recipes-by-user",authMiddleware,get_all_recipes_by_user)
route.post("/like/:ref",authMiddleware,like_recipe)
route.post("/create-comments/:ref",authMiddleware,add_comment)
route.post("/get-comments/:ref",authMiddleware,get_comments)
route.delete("/delete-comment/:ref/:commentId",authMiddleware,delete_comment)
route.put("/update-comment/:ref/:commentId",authMiddleware,update_comment)


module.exports = route