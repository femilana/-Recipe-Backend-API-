const recipe_model = require("../models/recipe_model")

// Add Comment Controller
const add_comment = async (req, res,next) => {
    try {
        const { id } = req.user; // logged in user
        const { ref } = req.params; // recipe id
        const { text } = req.body; // comment text

        if (!id) {
            return res.status(401).json({ message: "Kindly login" });
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        // Find recipe
        const recipe = await recipe_model.findById(ref);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Add new comment
        recipe.comments.push({
            text,
            createdBy: id
        });

        await recipe.save();

        // Populate the comment author details for user-friendly response
        await recipe.populate("comments.createdBy", "username email");

        return res.status(201).json({
            message: "Comment added successfully",
            recipe
        });
    } catch (error) {
        next(error)
    }
}



// Get all comments for a specific recipe
const get_comments = async (req, res,next) => {
  try {
    const { ref } = req.params // recipe ID from the URL
    const { id } = req.user; // logged in user

    if(!id){
        return res.status(401).json({ message: "Kindly login" })
    }

    // Find recipe and populate the 'createdBy' field inside comments
    const recipe = await recipe_model
      .findById(ref)
      .populate("comments.createdBy", "username email")

    // If recipe not found
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // If recipe has no comments
    if (recipe.comments.length === 0) {
      return res.status(200).json({ message: "No comments yet for this recipe" })
    }

    // Return all comments
    return res.status(200).json({
      message: "Comments fetched successfully",
      comments: recipe.comments
    })
  } catch (error) {
    next(error)
  }
}



// Delete a comment from a recipe
const delete_comment = async (req, res, next) => {
  try {
    const { ref, commentId } = req.params  // recipe ID + comment ID
    const { id } = req.user                // logged-in user ID

    // Find the recipe
    const recipe = await recipe_model.findById(ref)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // Find the comment
    const comment = recipe.comments.id(commentId)
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if logged-in user is the owner of the comment
    if (comment.createdBy.toString() !== id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" })
    }

    // Remove the comment
    comment.deleteOne()
    await recipe.save()
    

    return res.status(200).json({ message: "Comment deleted successfully" })
  } catch (error) {
    next(error)
  }
}

const update_comment = async (req, res, next) => {
  try {
    const { ref, commentId } = req.params   // recipe ID + comment ID
    const { id } = req.user                 // logged-in user ID
    const { text } = req.body               // new comment text

    // Validate text
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text cannot be empty" })
    }

    // Find the recipe
    const recipe = await recipe_model.findById(ref)
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    // Find the comment
    const comment = recipe.comments.id(commentId)
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check ownership
    if (comment.createdBy.toString() !== id) {
      return res.status(403).json({ message: "Not authorized to update this comment" })
    }

    // Update text
    comment.text = text
    await recipe.save()

    return res.status(200).json({
      message: "Comment updated successfully",
      comment
    })
  } catch (error) {
    next(error)
  }
}






module.exports = {add_comment,get_comments,delete_comment,update_comment}
