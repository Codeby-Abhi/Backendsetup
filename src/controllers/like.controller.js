import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Check if the videoId is a valid ObjectId
    if (!isValidObjectId(videoId)) {
        return res.status(400).json(new ApiError("Invalid video ID", 400))
    }

    // Check if the video exists in the database
    const video = await videoId.findById(videoId)

    if (!video) {
        return res.status(404).json(new ApiError("Video not found", 404))
    }

    // Check if the user has already liked the video
    const likedVideo = await Like.findOne({ videoId, userId: req.user._id })

    if (likedVideo) {
        // If the user has already liked the video, remove the like
        await Like.deleteOne({ videoId, userId: req.user._id })
        return res.status(200).json(new ApiResponse("Like removed", 200))
    } else {
        // If the user has not liked the video, add a like
        const newLike = new Like({ videoId, userId: req.user._id })
        await newLike.save()
        return res.status(201).json(new ApiResponse("Video liked", 201))
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    // Check if the commentId is a valid ObjectId
    if (!isValidObjectId(commentId)) {
        return res.status(400).json(new ApiError("Invalid comment ID", 400))
    }

    // Check if the comment exists in the database
    const comment = await Comment.findById(commentId)
    if (!comment) {
        return res.status(404).json(new ApiError("Comment not found", 404))
    }

    // Check if the user has already liked the comment
    const likedComment = await Like.findOne({ commentId, userId: req.user._id })
    if (likedComment) {
        // If the user has already liked the comment, remove the like
        await Like.deleteOne({ commentId, userId: req.user._id })
        return res.status(200).json(new ApiResponse("Like removed", 200))
    }else {
        // If the user has not liked the comment, add a like
        const newLike = new Like({ commentId, userId: req.user._id })
        await newLike.save()
        return res.status(201).json(new ApiResponse("Comment liked", 201))
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet

    // Check if the tweetId is a valid ObjectId
    if (!isValidObjectId(tweetId)) {
        return res.status(400).json(new ApiError("Invalid tweet ID", 400))
    }

    // Check if the tweet exists in the database
    const tweet = await tweet.findById(tweetId)
    if (!tweet) {
        return res.status(404).json(new ApiError("Tweet not found", 404))
    }

    // Check if the user has already liked the tweet
    const likedTweet = await Like.findOne({ tweetId, userId: req.user._id })
    if (likedTweet) {
        // If the user has already liked the tweet, remove the like
        await  Like.deleteOne({ tweetId, userId: req.user._id })
        return res.status(200).json(new ApiResponse("Like removed", 200))
    } else {
        // If the user has not liked the tweet, add a like
        const newLike = new Like({ tweetId, userId: req.user._id })
        await newLike.save()
        return res.status(201).json(new ApiResponse("Tweet liked", 201))
    }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const { userId } = req.params
    // Check if the userId is a valid ObjectId
    if (!isValidObjectId(userId)) {
        return res.status(400).json(new ApiError("Invalid user ID", 400))
    }
    // Check if the user exists in the database
    const user = await user.findById(userId)
    if (!user) {
        return res.status(404).json(new ApiError("User not found", 404))
    }
    // Get all liked videos for the user
    const likedVideos = await Like.find({ userId }).populate("videoId")
    if (!likedVideos || likedVideos.length === 0) {
        return res.status(404).json(new ApiError("No liked videos found", 404))
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}