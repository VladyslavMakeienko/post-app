const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET
router.get("/", async (request, response) => {
  const posts = await Post.find({});
  response.status(200).json(posts);
});

// POST
router.post("/", async (request, response) => {
  const postData = {
    name: request.body.name,
    text: request.body.text,
    tags: request.body.tags,
  };

  const post = new Post(postData);

  await post.save();
  response.status(201).json(post);
});

// DELETE
router.delete("/:postId", async (request, response) => {
  await Post.remove({ _id: request.params.postId });
  response.status(200).json({
    message: "Deleted",
  });
});

module.exports = router;
