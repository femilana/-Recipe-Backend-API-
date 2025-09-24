const recipe_model = require("../models/recipe_model")

const like_recipe = async (req,res,next) => {
    try{
        const {id} = req.user
        const {ref} = req.params

        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }
        
        const recipe = recipe_model.findById(ref)

        if(!recipe){
            return res.status(404).json({ message: "Recipe not found" })
        }

        // Check if user already liked the recipe
        const liked = recipe.likes.includes(id)

        if(liked){
            // Unlike: remove user from likes array
            recipe.likes.pull(id)
            await recipe.save()
            return res.status(200).json({ message: "Recipe unliked successfully", recipe })
        }
        else{
            recipe.liked.push(id)
            await recipe.save()
            return res.status(200).json({ message: "Recipe liked successfully", recipe })
        }
    }
    catch(error){
        next(error)
    }
}


module.exports = {like_recipe}