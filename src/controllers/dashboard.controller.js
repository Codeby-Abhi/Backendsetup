import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    // Total videos
    const totalVideos = await Video.countDocuments({ user: channelId });

    // Total views (assuming each video has a 'views' field)
    const videos = await Video.find({ user: channelId }, "views");
    const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total likes (sum likes on all videos)
    const videoIds = videos.map(v => v._id);
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

    return res.status(200).json(
        new ApiResponse(true, "Channel stats fetched successfully", {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        })
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Video.countDocuments({ user: channelId });
    const videos = await Video.find({ user: channelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    return res.status(200).json(
        new ApiResponse(true, "Channel videos fetched successfully", {
            videos,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            total
        })
    );
});

export {
    getChannelStats,
    getChannelVideos
}