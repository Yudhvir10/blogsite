const router=require('express').Router();
const User=require('../models/User');
const Post= require('../models/Post');
const fs=require("fs");
//create new post
router.post("/",async(req,res)=>{
    const newPost=new Post(req.body);
    try{
        const savedPost=await newPost.save();
        res.status(200).json(savedPost);
        
    }catch(err){
        res.status(500).json(err);

    }

});


//update existing post
router.put("/:id",async(req, res)=>{
    try{
        const post=await Post.findById(req.params.id);
        console.log(post.username);
        if(req.body.username==post.username){
            
        try{
            const updatedPost=await Post.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{
                new:true
            });
            return res.status(200).json(updatedPost);
        }catch(err){
            res.status(501).json(err);
        }
        }else{
            res.status(401).json("You can update only your posts");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

//deleting prev image when updating post
router.post("/deletePhoto",async (req,res)=>{
    const filename=req.body.filename;
    console.log("deleteing photo "+filename);
    try{
    fs.unlink("images/"+filename,err=>{
        if(err){
            console.log(err);
            res.status(500).send("something went wrong");
        }else{
            res.status(200).send("file deleted successfully!");
        }
    })
    }catch(err){
        console.log(err);
        res.status(503).send("something went wrong");
        
    }
})



//delete existing post
router.delete("/:id",async(req, res)=>{
    try{
        const post=await Post.findById(req.params.id);
        
        if(req.body.username===post.username){
            try{
                await Post.findByIdAndDelete(req.params.id);
                return res.status(200).json("post has been deleted!");
            }catch(err){
                res.status(501).json(err);
            }
        }else{
            res.status(401).json("You can delete only your posts");
        }
    }catch(err){
        res.status(500).json(err);
    }
});


//get single post
router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post._doc);
    }catch(err){
        res.status(500).json(err);
    }
});

//get all posts
router.get("/",async(req,res)=>{
    const username=req.query.user;
    const catName=req.query.cat;
    try{
        let posts;
        if(username){
            posts=await Post.find({username});
        }else if(catName){
            posts=await Post.find({
                categories:{
                    $in: [catName]
                }
            });
        }else{
            posts=await Post.find();
        }
        res.status(200).json(posts);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports=router;