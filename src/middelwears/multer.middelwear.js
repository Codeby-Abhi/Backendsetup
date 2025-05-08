import multer from "multer";

//storage will be used as middleware to store the file in the local storage
//multer is a middleware for handling multipart/form-data, which is used for uploading files
//multer.diskStorage is used to store the file in the local storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

export const upload = multer({ storage })