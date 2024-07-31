const commentRouter = require("express").Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const { response } = require("express");

commentRouter.get('/:id/comments', async (req, res) => {
    const comments = await Comment.find({ blog: req.params.id})
    res.json(comments);
});

commentRouter.post("/:id/comments", async (req, res) => {

    const body = req.body;
    const blog = await Blog.findById(req.params.id);

    console.log("BLOG: ", blog)
    console.log("ID: ", body)

    const comment = new Comment({
        content: body.comment,
        blog: blog._id
    })

    if (body.comment === undefined) {
        res.status(400).end();
    } else {
        const saved = comment.save();
        res.status(201).json(saved);
    }
});


module.exports = commentRouter;