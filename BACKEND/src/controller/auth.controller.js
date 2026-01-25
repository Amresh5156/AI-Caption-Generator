const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


async function registerController(req, res){
    const {username, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({username});

    if(isUserAlreadyExists) {
        return res.status(400).json({message:"user already exists"})
    }

    const user = await userModel.create({
        username,
        password: await bcrypt.hash(password, 10)
    })

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

    res.cookie("token", token, { sameSite: 'lax', httpOnly: false })
    const safe = { _id: user._id, username: user.username };
    return res.status(201).json({message:"user register successfully", user: safe})
}

async function loginController(req, res){
    const {username, password} = req.body;

    const isUser = await userModel.findOne({username})

    if(!isUser) {
        return res.status(400).json({message:"user not found"})
    }

    const isPasswordValid = await bcrypt.compare(password, isUser.password);

    if(!isPasswordValid ){
        return res.status(400).json({message:"incorrect password"})
    }

    const token = jwt.sign({id:isUser._id}, process.env.JWT_SECRET);

    res.cookie("token", token, { sameSite: 'lax', httpOnly: false })
    const safe = { _id: isUser._id, username: isUser.username };
    res.status(200).json({
        message:"user login successfully",
        isUser: safe
    })
}

async function userController(req, res){
    const {token} = req.body

    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findOne({
            _id:decoded.id
        })
        res.status(200).json({
            message:"user data fetch successfully",
            user
        })  
    }
    catch(err){
        return res.status(401).json({
            message:"invalid token"
        })
    }
}


async function logoutController(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

async function meController(req, res) {
    const u = req.user?.toObject ? req.user.toObject() : req.user;
    if (u && u.password) delete u.password;
    res.status(200).json({ user: u });
}

module.exports = { registerController, loginController, userController, logoutController, meController }