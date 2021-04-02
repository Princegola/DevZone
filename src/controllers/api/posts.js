import express from 'express';
const postRoute = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public
postRoute.get('/', (req, res) => res.send('Posts Route'));

export default postRoute;