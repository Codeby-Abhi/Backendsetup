import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String,//cloudnary url
        required: true,
    },
    coverImage: {
        type: String,//cloudnary url
    },
    watchHitory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    },

}, {
    timestamps: true,
})

//per hook to hash password before saving  
userSchema.pre("save", async function (next) {
    //if password is not modified then skip hashing
    if(!this.isModified("password")) {
        return next()
    }

    //hash is function to encrypt password it took 2 arguments 1st is password and 2nd is salt rounds
    //salt rounds is the cost of hashing the password. The higher the number, the more secure the password will be.
    this.password = bcrypt.hash(this.password, 10)
    next()
})

export const User = mongoose.model("User", userSchema) 