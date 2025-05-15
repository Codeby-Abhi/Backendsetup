import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    UpdateDetailes,
    getWatchHistory,
    updateUserAvatar,
    updateUserCover
} from "../controllers/user.controller.js";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo
} from "../controllers/videos.controller.js";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controller.js";
import {
    getChannelStats,
    getChannelVideos
} from "../controllers/dashboard.controller.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js";
import { upload } from "../middelwears/multer.middelwear.js";
import { verifyJWT } from "../middelwears/auth.middlewear.js";

const router = Router();

// User routes
router.route("/register").post(
    //upload is a middleware that will handle the file upload
    //upload.fields is used to upload multiple files with different field names
    //the first argument is an array of objects, each object contains the name of the field and the maxCount of files to be uploaded
    //in this case, we are uploading two files, one with the name "avtar" and the other with the name "cover"
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, {
            name: "cover",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secured router
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh").post(refreshAccessToken)
router.route("/chanege-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

//patch is used to update only resources
router.route("/updateAccDetails").patch(verifyJWT, UpdateDetailes)
router.route("/avatarUpdate").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/coverUpdate").patch(verifyJWT, upload.single("cover"), updateUserCover)
router.route("/c/:userName").get(verifyJWT, getCurrentUser)
router.route("/watchHistory").get(verifyJWT, getWatchHistory)

// Video routes
router.route("/videos").get(getAllVideos);
router.route("/videos").post(verifyJWT, upload.single("video"), publishAVideo);
router.route("/videos/:videoId").get(getVideoById);
router.route("/videos/:videoId").patch(verifyJWT, updateVideo);
router.route("/videos/:videoId").delete(verifyJWT, deleteVideo);

// Comment routes
router.route("/videos/:videoId/comments").get(getVideoComments);
router.route("/videos/:videoId/comments").post(verifyJWT, addComment);
router.route("/comments/:commentId").patch(verifyJWT, updateComment);
router.route("/comments/:commentId").delete(verifyJWT, deleteComment);

// Dashboard routes
router.route("/dashboard/stats").get(verifyJWT, getChannelStats);
router.route("/dashboard/videos").get(verifyJWT, getChannelVideos);

// Playlist routes
router.route("/playlists").post(verifyJWT, createPlaylist);
router.route("/playlists/user/:userId").get(getUserPlaylists);
router.route("/playlists/:playlistId").get(getPlaylistById);
router.route("/playlists/:playlistId").patch(verifyJWT, updatePlaylist);
router.route("/playlists/:playlistId").delete(verifyJWT, deletePlaylist);
router.route("/playlists/:playlistId/videos/:videoId").post(verifyJWT, addVideoToPlaylist);
router.route("/playlists/:playlistId/videos/:videoId").delete(verifyJWT, removeVideoFromPlaylist);

// Subscription routes
router.route("/subscribe/:channelId").post(verifyJWT, toggleSubscription);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/subscriptions/:subscriberId").get(getSubscribedChannels);

// Tweet routes
router.route("/tweets").post(verifyJWT, createTweet);
router.route("/tweets/user/:userId").get(getUserTweets);
router.route("/tweets/:tweetId").patch(verifyJWT, updateTweet);
router.route("/tweets/:tweetId").delete(verifyJWT, deleteTweet);

export default router;