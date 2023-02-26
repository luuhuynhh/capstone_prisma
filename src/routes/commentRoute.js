const express = require("express");
const { postComment, getCommentsByImageId } = require("../controllers/commentCotroller");

const commentRoute = express.Router();

commentRoute.post("/", postComment);
commentRoute.get("/:image_id", getCommentsByImageId);

module.exports = {
    commentRoute
}