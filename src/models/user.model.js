import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


//this is a user model for the user collection in the database
//it is used to create a user schema and model for the user collection in the database
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

//pre hook to hash password before saving  
//explain me code in detail
//pre hook is a middleware that is called before saving the document to the database
//it is used to hash the password before saving it to the database
//it takes 2 arguments 1st is the hook name and 2nd is the function to be called
//in this case, the hook name is "save" and the function is an async function that takes next as an argument
//next is a function that is called to move to the next middleware in the stack
//if there is no next middleware, it will save the document to the database
//if there is an error, it will call the next function with the error as an argument
//if there is no error, it will call the next function without any arguments

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

//method to check if the password is correct
userSchema.methods.ispasswordCorrect = async function (password) {
    //compare the password with the hashed password using bcrypt.compare method
    //it takes 2 arguments 1st is password and 2nd is hashed password
    //make it async because it takes time to compare the password
    return await bcrypt.compare(password, this.password)
}

//generate a token using jwt.sign method
//generateAccessToken is custom method name created to generate a token
//it takes 2 arguments 1st is the payload and 2nd is the secret key it also takes 3rd argument which is the expiration time
//the payload is the data that we want to store in the token
//the secret key is used to sign the token and the expiration time is the time after which the token will expire
//the token is used to authenticate the user and to verify the user
//the token is sent to the client and the client sends it back to the server in the authorization header
//the server verifies the token and if it is valid, it allows the user to access the protected routes
//if the token is not valid, it sends an error response to the client


userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username, 
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
    )
}

//generate a refresh token using jwt.sign method
//refresh token is used to generate a new access token when the access token expires
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        },
    )
}


export const User = mongoose.model("User", userSchema) 