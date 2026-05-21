const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {

  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
       console.log(req.body.name, req.body.email, req.body.password);
      return res.status(400).json({
        message: "Please provide name, email and password"
      });
    }

    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists"
      });
    }
 const hashedPassword = await bcrypt.hash(password, 10);
    //const salt = await bcrypt.genSalt(10);

   // user.password = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
      console.log(name, email, password);
      console.log(err);
    res.status(500).json({
      error: err.message
    });

  }

});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {

        res.json({
          token
        });

      }
    );

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;