import express from 'express';
const userRoute = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
userRoute.get('/', (req, res) => res.send('User Route'));

export default userRoute;