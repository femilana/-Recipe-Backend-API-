const recipe_model = require("../models/recipe_model")
const user_model = require("../models/user_model")
const cloudinary = require("cloudinary").v2
const fs = require("fs/promises")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET})

const create_recipe = async(req,res,next) =>{
    try{
        const { title, ingredients, instructions, image} = req.body
        const {id} = req.user
        const files = req.files

        //Validating user
        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }

       let uploaded_image = []

       if(files && files.image && files.image.length > 0){
        for(let i = 0; i < files.image.length; i++){
            const upload = await cloudinary.uploader.upload(files.image[i].path)
            uploaded_image.push(upload.secure_url)
            fs.unlink(files.image[i].path)
        }
       }


        //// create recipe and link to logged-in user
        const recipe = new recipe_model(
            {
               title,
               ingredients,
               instructions,
               image: uploaded_image,
               createdBy:id
            }
        )
        // save recipe
        const saved_recipe = await recipe.save()

        // also push recipe ID into user's recipes array
        await user_model.findByIdAndUpdate(id,
            {$push:{recipe:saved_recipe._id}}
        )
        return res.status(201).json({
            message: "Recipe created successfully",
            recipe: saved_recipe
        })
    }
    catch(error){
        next(error)
    }
}

//Getting all Recipe from database
const get_all_recipes = async(req,res,next) =>{
    try{
        const {id} = req.user

        //Validating user
        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }
        
        //getting all the recipes
        const get_recipes = await recipe_model.find()
        .populate("createdBy","username email")
        .populate("likes", "username email")
        .populate("comments.createdBy", "username email")
        return res.status(201).json({
            message:"All recipes fetched successfully",
            count:get_recipes.length,
            get_recipes
        })
    }
    catch(error){
        next(error)
    }
}

//Getting a Particular Recipe from the database
const get_recipe = async(req,res,next) => {
    try{
        const {ref} = req.params
        const{id} = req.user

        //Validating user
        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }

        //Getting specific recipe
        const get_recipe = await recipe_model.findById(ref)
        .populate("createdBy","username email")
        .populate("likes", "username email")
        .populate("comments.createdBy", "username email")

        if(!get_recipe){
            return res.status(401).json({ message: "Recipe not found" })
        }
        return res.status(201).json({
            message:"fetch successful",
            count:get_recipe.length,
            get_recipe})
    }
    catch(error){
        next(error)

    }
}

const update_recipe = async(req,res,next) =>{
    try{
        const { title, ingredients, instructions, image} = req.body
        const {id} = req.user
        const {ref} = req.params
        const files = req.files

        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }

        const update = await recipe_model.findById(ref)
 

        if(!update){
            return res.status(404).json({ message: 'Recipe not found'})
        }

        // check ownership
        if(update.createdBy.toString() !== id){
            return res.status(403).json({ message: "Not authorized to update this recipe" })
        }

        let updated_image = []

        if(files && files.image && files.image.length > 0){
            for(let i = 0; i < files.image.length;i++){
                const upload = await cloudinary.uploader.upload(files.image[i].path)
                updated_image.push(upload.secure_url)
                await fs.unlink(files.image[i].path)

            }
        }

        update.title = title || update.title
        update.ingredients = ingredients || update.ingredients
        update.instructions = instructions || update.instructions
        update.image = updated_image || update.image

        const saved_update = await update.save()
        return res.status(200).json({message:"update successful",saved_update})

    }
    catch(error){
        next(error)
    }

}

const delete_recipe = async(req,res,next) =>{
    try{
        const {ref} = req.params
        const {id} = req.user

        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }
        
        const check_recipe = await recipe_model.findById(ref)

        if(!check_recipe){
            return res.status(404).json({ message: 'Recipe not found'})
        }

        if(check_recipe.createdBy.toString() !== id){
            return res.status(403).json({ message: "Not authorized to delete this recipe" })
        }

        await recipe_model.findByIdAndDelete(ref)
        await user_model.findByIdAndUpdate(id,{$pull:{recipe:check_recipe._id}})

        return res.status(200).json({message:"recipe deleted successfully"})
    }
    catch(error){
        next(error)


    }
}

const get_all_recipes_by_user = async(req,res,next) =>{
    try{
        const {id} = req.user

        if(!id){
            return res.status(401).json({ message: 'Kindly Login' })
        }
        const all_user_recipes = await recipe_model.find({createdBy:id})
        .populate("createdBy","username email")
        .populate("likes", "username email")
        .populate("comments.createdBy", "username email")

        if(all_user_recipes.length === 0){
            return res.status(404).json({ message: 'No recipes found for this user'})
        }
        return res.status(200).json(all_user_recipes)
    }
    catch(error){
        next(error)
}
}


module.exports = {
    create_recipe,
    get_all_recipes,
    get_recipe,
    update_recipe,
    delete_recipe,
    get_all_recipes_by_user}