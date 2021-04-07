import express from "express";
import expressValidator from "express-validator";
import configuration from '../../config/configuration.js';
import authMiddleWare from "../../libs/routes/authMiddleWare.js";
import Profile from "../../models/ProfileModel.js";
import User from "../../models/UserModel.js";
const profileRoute = express.Router();
const { check, validationResult } = expressValidator;
const { request } = express;

// @route   GET api/profile/me
// @desc    Get Current User Profile
// @access  Private

profileRoute.get("/me", authMiddleWare, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile for this User" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or Update user Profile
// @access  Private

profileRoute.post(
  "/",
  [
    authMiddleWare,
    [
      check("status", "Status is Required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile Object

    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    GET all profile
// @access  Public

profileRoute.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    GET profile by userID
// @access  Public

profileRoute.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({ msg: "There is no Profile for this user" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    DELETE profile by userID
// @access  Public

profileRoute.delete('/', authMiddleWare, async (req, res) => {
    try {
        // Post.deleteMany({ user: req.user.id }),
        await Profile.findOneAndRemove({ user: req.user.id }),
        await User.findOneAndRemove({ _id: req.user.id })
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route   PUT api/profile/experience
// @desc   Add Profile Experience
// @access  Private

profileRoute.put(
    '/experience',
    authMiddleWare,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
          title,
          company,
          location,
          from,
          to,
          current,
          description
      } = req.body;

      const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

profileRoute.delete('/experience/:exp_id', authMiddleWare, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      // GEt remove index

      const removeIndex = foundProfile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        foundProfile.experience.splice(removeIndex, 1);
  
      await foundProfile.save();

      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  
// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
profileRoute.put(
    '/education',
    authMiddleWare,
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(newEdu);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

profileRoute.delete('/education/:edu_id', authMiddleWare, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      // GEt remove index

      const removeIndex = foundProfile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
        foundProfile.education.splice(removeIndex, 1);
  
      await foundProfile.save();

      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public

profileRoute.get('/github/:username ', async(req, res) => {
    const clientId = "84dd6c2c10224a34973f";
    const secret = "360e1f3df2a26a5d778522f918ad9cbe74e87b93";
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${clientId}&client_secret=${secret}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'No Github profile found' });
    }
})

export default profileRoute;
