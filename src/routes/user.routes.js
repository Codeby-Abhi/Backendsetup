import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    UpdateDetailes,
    getWatchHistory,
    updateUserAvatar,
    updateUserCover
} from "../controllers/user.controller.js";
import { upload } from "../middelwears/multer.middelwear.js";
import { verifyJWT } from "../middelwears/auth.middlewear.js";

const router = Router();

router.route("/register").post(
    //upload is a middleware that will handle the file upload
    //upload.fields is used to upload multiple files with different field names
    //the first argument is an array of objects, each object contains the name of the field and the maxCount of files to be uploaded
    //in this case, we are uploading two files, one with the name "avtar" and the other with the name "cover"
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "cover",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured router
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh").post(refreshAccessToken)
router.route("/chanege-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

//patch is used to update only resources
router.route("/updateAccDetails").patch(verifyJWT, UpdateDetailes)
router.route("/avatarUpdate").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/coverUpdate").patch(verifyJWT, upload.single("cover"), updateUserCover)
router.route("/c/:userName").get(verifyJWT, getCurrentUser)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)
export default router