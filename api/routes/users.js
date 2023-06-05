const router=require("express").Router();
const User=require("../models/User");
const Post=require("../models/Post");
const bcrypt=require("bcrypt");

//update
router.put("/:id", async (req,res)=>{
    
    if(req.body.updatedUser.userId===req.params.id){
        const user=await User.findById(req.params.id);
        const oPassword=await bcrypt.hash(req.body.oldPassword,await bcrypt.genSalt(5));
        console.log(req.body.updatedUser);
        console.log(req.body.oldPassword);
        console.log(oPassword);
        console.log(user._doc.password);
        if( !await bcrypt.compare(req.body.oldPassword,user.password)){
            return res.status(503).json("wrong password");
        }
        else if(req.body.updatedUser.password){
            req.body.updatedUser.password=await bcrypt.hash(req.body.updatedUser.password,await bcrypt.genSalt(5));
        }
        try{
            const updateUser=await User.findByIdAndUpdate(req.params.id,{
                $set:req.body.updatedUser
            },{new:true});
            return  res.status(200).json(updateUser);
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(401).json("You cannot update this account.");
    }

});

//delete user
router.delete("/:id", async (req,res)=>{
    if(req.body.userId===req.params.id){
        try{
            const user= await User.findById(req.params.id);
            try{
                await Post.deleteMany({username:user.username});    //deleting all post by the user
                await User.findByIdAndDelete(req.params.id);        //deleting the user
                return  res.status(200).json("User has been deleted...");
            }catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            return res.status(404).json("User not found!");
        }
    }else{
        return res.status(401).json("You cannot delete this account."); 
    }

});


//get user
router.get("/:id",async(req,res)=>{
    try{
        const user=await User.findById(req.params.id);
        const {password,...others}=user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err);
    }

});






module.exports=router;