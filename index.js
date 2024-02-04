const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const AuthenticationRoute = require("./src/router/userRoutes");

const app = express();

const port = process.env.PORT || 9696;

app.use(bodyParser.json());

app.use(
  "/api/uploads/profile/",
  express.static(path.join(__dirname, "../database/uploads/profilePictures"))
);

app.use("/api/user", AuthenticationRoute);

app.get("/api", (req, res) => {
  res.json({
    mesage: "Hello Jii",
  })
});

const link = process.env.PRODUCTION_Link || 'http://localhost'

app.listen(port, () => {
  console.log(`Server is running at ${link}:${port}/api`);
});
