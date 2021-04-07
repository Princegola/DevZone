import express from "express";
import expressValidator from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleWare from "../../libs/routes/authMiddleWare.js";
import User from "../../models/UserModel.js";
const authRoute = express.Router();
const { check, validationResult } = expressValidator;

/* @route   GET api/auth
   @desc    Get Users by token
   @access  Public */

authRoute.get("/", authMiddleWare, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

authRoute.post(
  "/",
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const secretKey = 'mysecrettoken';

      jwt.sign(
        payload,
        secretKey,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default authRoute;
