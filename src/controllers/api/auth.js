import express from 'express';
const authRoute = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
authRoute.get('/', (req, res) => res.send('Auth Route'));

export default authRoute;