import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { text } = req.body

    if (!text || text.trim() === "") {
        throw new ApiError(400, "Tweet text is required")
    }

    const tweet = await Tweet.create({
        text,
        user: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(true, "Tweet created successfully", tweet)
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const tweets = await Tweet.find({ user: userId })
        .populate("user", "name email")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(true, "User tweets fetched successfully", tweets)
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { text } = req.body

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }
    if (!text || text.trim() === "") {
        throw new ApiError(400, "Tweet text is required")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    if (tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet")
    }

    tweet.text = text
    await tweet.save()

    return res.status(200).json(
        new ApiResponse(true, "Tweet updated successfully", tweet)
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    if (tweet.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new ApiResponse(true, "Tweet deleted successfully", null)
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}