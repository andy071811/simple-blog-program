const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Post = require('./../models/postModel');
const User = require('./../models/userModel');

const adminLayout = './../views/admin';

// AUTH MIDDLEWARE:

// Check login:
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    };

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch(err) {
        res.status(401).json({
            message: 'Unauthorized'
        });
    };
};

// Routers:

// GET method for the admin/login page:
router.get('/admin', async (req, res) => {

    try {

        const locals = {
            title: "Admin",
            description: "Simple blog with node mongo and express"
        };

        


        res.render('admin/index', {
            locals,
            layout: adminLayout
        });

    } catch(err) {
        console.log(err)
    }
        
});

// POST method for login (admin):
router.post('/admin', async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!user || !isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        };

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard')

    } catch(err) {
        console.log(err)
    }
        
});

// GET method for dashboard:
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {

        const locals = {
            title: "Dashboard",
            description: "Simple blog with node mongo and express"
        };

        const data = await Post.find();

        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });

    } catch(err) {

        console.log(err)

    };
});

// GET method admin create new post:
router.get('/add-post', authMiddleware, async (req, res) => {

    try {

        const locals = {
            title: 'Add Post',
            description: 'Simple blog with node mongo and express'
          };
      
          const data = await Post.find();
          res.render('admin/add-post', {
            locals,
            layout: adminLayout
          });
      
        } catch (error) {
          console.log(error);
        };
});

// POST method admin create new post:
router.post('/add-post', authMiddleware, async (req, res) => {

    try {

        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        });

        await Post.create(newPost);
        res.redirect('/dashboard');

    } catch(err) {

        console.log(err)

    };
});

// PUT method admin create new post:
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {

        const post = await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
      
        } catch (error) {
          console.log(error);
        };
});

// GET method admin create new post:
router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {

        const locals = {
            title: 'Edit Post',
            description: 'Simple blog with node mongo and express'
          };

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });
      
        } catch (error) {
          console.log(error);
        };
});

// DELETE posts:
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard')
    } catch(err) {
        console.log(err);
    }
});

// GET admin logout:
router.get('/logout', (req, res) => {
    res.clearCookie(token);
    res.redirect('/')
})


// POST method for registering (admin):
router.post('/register', async (req, res) => {

    try {

        const { username, password } = req.body;
        
        const hashPassword = await bcrypt.hash(password, 10);

        try {

            const user = await User.create({ username, password:hashPassword });

            res.status(201).json({
                status: 'success',
                message: 'User created',
                user
            });

        } catch(err) {

            if (err.code === 11000) {
                res.status(409).json({
                    status: 'fail',
                    message: 'User already exists'
                });
            };

            res.status(500).json({
                status: 'fail',
                message: 'Internal server error'
            });
        }
        

    } catch(err) {
        console.log(err)
    }
        
});


module.exports = router;