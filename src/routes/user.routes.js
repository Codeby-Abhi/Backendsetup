import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middelwears/multer.middelwear.js";

const router = Router();

router.route("/register").post(
    //upload is a middleware that will handle the file upload
    //upload.fields is used to upload multiple files with different field names
    //the first argument is an array of objects, each object contains the name of the field and the maxCount of files to be uploaded
    //in this case, we are uploading two files, one with the name "avtar" and the other with the name "cover"
    upload.fields([{
        name : "avatar",
        maxCount : 1
    },{
        name : "cover",
        maxCount : 1
    }
    ]),
    registerUser)

export default router