import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Build filter object
    const filter = {};
    if (query) {
        filter.title = { $regex: query, $options: "i" }; // case-insensitive search on title
    }
    if (userId && isValidObjectId(userId)) {
        filter.user = userId;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // Get total count for pagination
    const total = await Video.countDocuments(filter);

    // Fetch videos with pagination, sorting, and user population
    const videos = await Video.find(filter)
        .populate("user", "name email")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(
        new ApiResponse(true, "Videos fetched successfully", {
            videos,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            total
        })
    );
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // Check if file is present
    if (!req.file) {
        throw new ApiError(400, "No video file uploaded");
    }

    // Upload video to Cloudinary
    let uploadResult;
    try {
        uploadResult = await uploadOnCloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "videos"
        });
    } catch (err) {
        throw new ApiError(500, "Failed to upload video to Cloudinary");
    }

    // Create video document in DB
    const video = await Video.create({
        title,
        description,
        user: req.user._id,
        videoUrl: uploadResult.secure_url,
        cloudinaryPublicId: uploadResult.public_id,
        isPublished: true
    });

    return res.status(201).json(
        new ApiResponse(true, "Video published successfully", video)
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //check if videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    //check if video exists in DB or not
    const video = await Video.findById(videoId).populate("user", "name email")

    //if video not found, return 404
    if (!video) {
        return res.status(404).json(new ApiResponse(false, "Video not found", null))
    }

    //return video details
    return res.status(200).json(new ApiResponse(true, "Video found", video))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    //check if videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }
    //check if video exists in DB or not
    const video = await Video.findById(videoId).populate("user", "name email")
    //if video not found, return 404
    if (!video) {
        return res.status(404).json(new ApiResponse(false, "Video not found", null))
    }
    //check if user is authorized to update the video
    if (video.user.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(false, "You are not authorized to update this video", null))
    }

    //get title and desc from video
    const { title, description } = req.body

    //update a video
    const updatedVideo = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true })

    //return updated video
    return res.status(200).json(new ApiResponse(true, "Video updated successfully", updatedVideo))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    //check if videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }
    //check if video exists in DB or not
    const video = await Video.findById(videoId).populate("user", "name email")
    //if video not found, return 404
    if (!video) {
        return res.status(404).json(new ApiResponse(false, "Video not found", null))
    }
    //check if user is authorized to delete the video
    if (video.user.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(false, "You are not authorized to delete this video", null))
    }
    //delete video from cloudinary
    try {
        if (video.cloudinaryPublicId) {
            await uploadOnCloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: "video" });
        }
    } catch (cloudErr) {
        return res.status(500).json(new ApiResponse(false, "Failed to delete video from Cloudinary", null));
    }

    // delete video from database
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(new ApiResponse(true, "Video deleted successfully", null));

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    //write me code for togglePublicStatus true or false
    //check if videoId is valid or not
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id")
    }
    //check if video exists in DB or not
    const video = await Video.findById(videoId).populate("user", "name email")
    //if video not found, return 404
    if (!video) {
        return res.status(404).json(new ApiResponse(false, "Video not found", null))
    }
    //check if user is authorized to update the video
    if (video.user.toString() !== req.user._id.toString()) {
        return res.status(403).json(new ApiResponse(false, "You are not authorized to update this video", null))
    }
    //toggle publish status
    const updatedVideo = await Video.findByIdAndUpdate(videoId, { isPublished: !video.isPublished }, { new: true })
    //return updated video
    return res.status(200).json(new ApiResponse(true, "Video publish status updated successfully", updatedVideo))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}