const postModel = require('../models/post.model');
const { generateCaption } = require('../services/ai.service');
const uploadFile = require('../services/storage.service');
const { v4: uuidv4 } = require('uuid'); 

async function createPostController(req, res) {
    try {
        const file = req.file;
        const captionType = req.body.captionType || 'descriptive';
        console.log("file received: ", file);
        console.log("caption type: ", captionType);
    
    
        if (!file) {
        return res.status(400).json({ message: 'Image is required' });
        }
    
    
        const base64Image = Buffer.from(file.buffer).toString('base64');
    
    
        const [caption, uploadResult] = await Promise.all([
            generateCaption(base64Image, captionType),
            uploadFile(file.buffer, `${uuidv4()}`),
        ]);
    
    
        const post = await postModel.create({
            caption,
            image: uploadResult.url,
            user: req.user?._id ?? null,
        });

        res.status(201).json({
            message: 'Post created successfully',
            post,
            caption,
        });
    } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create post' });
        }
}


module.exports = {
    createPostController
}