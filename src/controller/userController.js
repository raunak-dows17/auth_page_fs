const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const cloudinary = require("../config/cloudinary");

function generateRandomHexColorCode() {
  const randomHexNumber = Math.floor(Math.random() * 16777215);

  const randomHexColorCode = randomHexNumber.toString(16);

  return randomHexColorCode;
}

const UserController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, phoneNo } = req.body;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          message: `User with ${email} already exists`,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser;

      if (req.file) {
        const result = await cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "profilePictures",
            public_id: `${phoneNo}`,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              console.error(error);
              return res.status(500).json({
                message: "Internal server error",
              });
            }
          }
        );

        req.file.stream.pipe(result);

        newUser = new User({
          profileImage: result.secure_url,
          name,
          email,
          password: hashedPassword,
          phoneNo,
        });
      } else {
        newUser = new User({
          profileImage: `https://dummyimage.com/600x400/${generateRandomHexColorCode()}/fff.jpg&text=${name
            .charAt(0)
            .toUpperCase()}`,
          name,
          email,
          password: hashedPassword,
          phoneNo,
        });
      }

      await newUser.save();

      const payload = {
        user: {
          id: newUser._id,
        },
      };

      jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;

        res.status(201).json({
          message: `Hey ${name} welcome, thank you for joining us`,
          id: newUser._id,
          token: token,
        });
      });
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

      const user = await User.findOne({ email });

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
        message: "Internal Server Error",
      });
    }
  },

  userProfile: async (req, res) => {
    try {
      const id = req.params.id;

      const user = await User.findById(id);

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
