import mongoose , {Schema} from "mongoose";

const likeSchema = new Schema({
    videos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    tweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

},{timestamps: true});

export const Like = mongoose.model("Like",likeSchema)