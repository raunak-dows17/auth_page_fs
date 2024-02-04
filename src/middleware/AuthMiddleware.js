const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

      const token = authHeader && authHeader.split(" ")[1];
      
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        res.status(403).json({
          message: "UnAuthorized",
        });
        }
        next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = authenticateUser;
