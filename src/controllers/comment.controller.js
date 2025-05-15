import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const total = await Comment.countDocuments({ video: videoId })
    const comments = await Comment.find({ video: videoId })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))

    return res.status(200).json(
        new ApiResponse(true, "Comments fetched successfully", {
            comments,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            total
        })
    )
})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { text } = req.body

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required")
    }

    const comment = await Comment.create({
        video: videoId,
        user: req.user._id,
        text
    })

    return res.status(201).json(
        new ApiResponse(true, "Comment added successfully", comment)
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { text } = req.body

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    if (!text || text.trim() === "") {
        throw new ApiError(400, "Comment text is required")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    comment.text = text
    await comment.save()

    return res.status(200).json(
        new ApiResponse(true, "Comment updated successfully", comment)
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }

    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }
    if (comment.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(
        new ApiResponse(true, "Comment deleted successfully", null)
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}