import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation that its not empty
    // check if the user already exists in the database
    // check for image,avatar
    // upload the image to cloudinary
    // create the user object because we are using mongoose a nosql database
    // remove pass and refresh token from response
    // check for user creation
    // send the response to the frontend

    const {fullName, email, useName, password} = req.body
    console.log("email : ", email);
})

export { registerUser };