import express from 'express';
const profileRoute = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public
profileRoute.get('/', (req, res) => res.send('Profile Route'));

export default profileRoute;