const express = require("express");
const { postComment, getCommentsByImageId, updateComment, deleteComment } = require("../controllers/commentCotroller");

const commentRoute = express.Router();

commentRoute.post("/", postComment);
commentRoute.put("/:comment_id", updateComment);
commentRoute.delete("/:comment_id", deleteComment)
commentRoute.get("/:image_id", getCommentsByImageId);

module.exports = {
    commentRoute
}