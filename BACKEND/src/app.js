const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true // required for cookies/auth
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

module.exports = app;