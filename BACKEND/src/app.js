let express = require("express")
const cors = require('cors')
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('../src/routes/post.routes')
const cookieParser = require("cookie-parser");
const path = require('path')



let app = express()
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,               // required for cookies/auth
  }));
  app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)

app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../publicindex.html'))
})

module.exports = app