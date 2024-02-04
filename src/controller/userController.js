const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

function random_hex_color_code() {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return n.slice(0, 6);
}

const userFile = path.join(__dirname, "../../database/user.json");

const userData = fs.readFileSync(userFile, "utf8");

const jsonData = JSON.parse(userData);

const date = Date.now().toString();

const deployedUrl = "http://localhost:6969" || process.env.PRODUCTION_Link;


const UserController = {
  registerUser: async (req, res) => {
    try {

      const { name, email, password, phoneNo } = req.body;

      if (!fs.existsSync(userFile)) {
        fs.writeFileSync(userFile, "[]", "utf8");
      }

      const existingUser = jsonData.find((user) => user.email === email);

      if (!email) {
        res.status(401).json({
          mesage: "Email is required to signup!",
        });
      } else if (!name) {
        res.status(401).json({
          message: "Username is required to singup!",
        });
      } else if (!password) {
        res.status(401).json({
          message: "Please enter your password to proceed!",
        });
      } else if (!phoneNo) {
        res.status(401).json({
          message: "Please enter your phone No. to proceed!",
        });
      } else if (existingUser) {
        return res.status(400).json({
          message: "User with this email already exists",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
          id: date,
          profileImage: req.file
            ? `${deployedUrl}/api/user/profileImage/${req.file.filename}`
            : `https://dummyimage.com/600x400/${random_hex_color_code()}/fff.png&text=${name
                .charAt(0)
                .toUpperCase()}`,
          name,
          email,
          password: hashedPassword,
          phoneNo,
        });

        jsonData.push(newUser);

        fs.writeFileSync(userFile, JSON.stringify(jsonData), "utf8");

        const payload = {
          user: {
            id: newUser._id,
          },
        };

        jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
          if (err) throw err;

          res.status(201).json({
            message: `Hey ${name} welcome, thankyou to join us`,
            id: newUser._id,
            token: token,
          });
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = jsonData.find((user) => user.email === email);

      if (!user) {
        res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        res.status(201).json({
          message: `Welcome back ${user.name}`,
          id: user._id,
          token: token,
        });
      });
    } catch (error) {
      console.log({ error });
      res.status(500).json({
        mesage: "Internal Server Error",
      });
    }
  },

  userProfile: (req, res) => {
    try {
      const id = req.params.id;

      const user = jsonData.find((user) => user._id === id);

      if (!user) {
        res.status(404).json({
          message: "User not found",
        });
      }

      const userProfile = {
        _id: user._id,
        profileImage: user.profileImage,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
      };

      res.status(200).json(userProfile);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

module.exports = UserController;
