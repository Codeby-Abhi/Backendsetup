import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Toggle subscription: subscribe/unsubscribe a user to a channel
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscriberId = req.user._id

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }
    if (channelId === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself")
    }

    const existing = await Subscription.findOne({ channel: channelId, subscriber: subscriberId })
    if (existing) {
        await Subscription.deleteOne({ _id: existing._id })
        return res.status(200).json(
            new ApiResponse(true, "Unsubscribed from channel", null)
        )
    } else {
        await Subscription.create({ channel: channelId, subscriber: subscriberId })
        return res.status(200).json(
            new ApiResponse(true, "Subscribed to channel", null)
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id")
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "name email avatar")

    return res.status(200).json(
        new ApiResponse(true, "Channel subscribers fetched successfully", subscribers)
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "name email avatar")

    return res.status(200).json(
        new ApiResponse(true, "Subscribed channels fetched successfully", channels)
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}