require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();


app.use(express.json());


const corsOptions = {
    origin: ['http://localhost:8000'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const commentRoutes = require("./routes/comment");
const postRoutes = require("./routes/post");


mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => 
    console.log("Now connected to MongoDB Atlas")
);

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);



if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API running on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
