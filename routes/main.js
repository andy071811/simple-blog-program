const express = require('express');
const router = express.Router();
const Post = require('./../models/postModel');

// Routes:

// GET method for the home route:
router.get("", async (req, res) => {

    try {

        const locals = {
            title: "nodeJS Blog",
            description: "Simple blog with node mongo and express"
        };

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: 1 } } ]).skip(perPage * page - perPage).limit(perPage).exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch(err) {
        console.log(err)
    }
        
});

// GET method for getting each blog post:
router.get('/post/:id', async (req, res) => {

    try {

        const locals = {
            title: "nodeJS Blog",
            description: "Simple blog with node mongo and express"
        };

        slug = req.params.id;

        const data = await Post.findById({ _id: slug });

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });

    } catch(err) {
        console.log(err);
    }
});

// POST route for search blog site:
router.post('/search', async (req, res) => {

    try {

        const locals = {
            title: "nodeJS Blog",
            description: "Simple blog with node mongo and express"
        };

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        })

        res.render("search", {
            data,
            locals
        })

    } catch(err) {
        console.log(err);
    }
})



// Exporting router:
module.exports = router;