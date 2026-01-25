const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")


async function authMiddleware(req, res, next){
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message:"Unauthorized access, please login first"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({
            id: decode._id
        })

        //jo aage se req aayegi(createPostController) se usme user ki demand aayegi usme user ki detail jayegi
        req.user = user
        next()
    }
    catch(err){
        res.status(401).json({
            message:"Invalid credentials, please login again"
        })
    }
}

module.exports = {authMiddleware}