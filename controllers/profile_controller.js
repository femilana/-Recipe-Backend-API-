const mongoose = require("mongoose")
const user_model = require("../models/user_model")
const profile_model = require("../models/profile_model")
const cloudinary = require("cloudinary").v2
const fs = require("fs/promises")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const create_profile = async (req, res,next) => {
    try {
        const file = req.file
        const { bio, location } = req.body
        const { id } = req.user

        if (!id) {
            return res.status(401).json({ message: 'Kindly Login' })
        }

        // find existing profile for this user
        let profile = await profile_model.findOne({ user: id })

        let uploaded_avatar = null

        // ===== Upload single image to Cloudinary =====
        if (file) {
            const upload = await cloudinary.uploader.upload(file.path)
            uploaded_avatar = upload.secure_url
            // unlink the local file after upload
            await fs.unlink(file.path)
        }

        if (profile) {
            // update profile if exists
            profile.bio = bio || profile.bio
            profile.avatar = uploaded_avatar || profile.avatar
            profile.location = location || profile.location

            await profile.save()
            return res.json({ profile })
        }

        // create new profile if none exists
        profile = new profile_model({
            user: id,
            bio,
            avatar:uploaded_avatar,
            location
        })
        await profile.save()

        return res.status(201).json(profile)

    } catch (error) {
        next(error)
    }
}

const get_profile = async (req, res,next) => {
    try {
        const { id } = req.user
        if (!id) {
            return res.status(401).json({ message: 'Kindly Login' }) 
        }

        const get_profile = await profile_model
            .findOne({ user: id })
            .populate('user', ['username', 'email'])

        if (!get_profile) {
            return res.status(401).json({ message: 'No Profile, Kindly Create your profile' })
        }

        return res.status(201).json(get_profile)
    } catch (error) {
        next(error)
    }
}



module.exports = { create_profile, get_profile }
