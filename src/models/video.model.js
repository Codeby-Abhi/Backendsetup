import mongoose , { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema({
    videoFile: {
        type: String,//cloudnary url
        required: true,
    },
    thumbnail: {
        type: String,//cloudnary url
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },


},{timestamps: true})

//what is the purpose of this plugin?
//mongoose-aggregate-paginate-v2 is a plugin for Mongoose that adds pagination support to MongoDB aggregation queries. It allows you to easily paginate the results of an aggregation pipeline, making it easier to work with large datasets in a more efficient way.
 
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)  
