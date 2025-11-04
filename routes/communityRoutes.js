const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const Post = require("../model/post")


// 🟢 GET all posts (public or authenticated)
router.get("/posts", verifyToken ,async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name").sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    console.error("Fetch posts error:", err);
    res.status(500).json({ success: false, message: "Failed to load posts" });
  }
});

// 🟢 POST a new community post
router.post("/posts", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const newPost = new Post({
      userId: req.user.id,
      title,
      content,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, post: savedPost });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

// 🟢 PUT: update a post (only by owner)
router.put("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();
    res.json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("Update post error:", err);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
});

// 🟢 DELETE: delete a post (only by owner)
router.delete("/posts/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.userId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Not authorized" });

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
});

// 🟢 POST: like a post
router.post("/posts/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.likes += 1;
    await post.save();
    res.json({ success: true, likes: post.likes });
  } catch (err) {
    console.error("Like post error:", err);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
});

// 🟢 POST: add comment
router.post("/posts/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    res.json({ success: true, comments: post.comments });
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
});

module.exports = router;
