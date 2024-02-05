const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017");

const conn = mongoose.connection;

conn.on("error", (error) => {
    console.log(error);
});

conn.once("open", () => {
    console.log('Connected to mongoDB successfully');
})
