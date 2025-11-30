let express = require("express")
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('../src/routes/post.routes')
const cookieParser = require("cookie-parser");



let app = express()
app.use(express.json());
app.use(cookieParser())

app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)

module.exports = app