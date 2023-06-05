const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
const PF=require("../utils/PF");
//registration
router.post("/register", async(req,res)=>{
    try{
        const salt=await bcrypt.genSalt(5);
        const hashedpass=await bcrypt.hash(req.body.password,salt);
        const newUser= new User({
            username:req.body.username,
            email:req.body.email,
            profilePic:PF()+"no_avatar.jpg",
            password:hashedpass
        });
        
        //handle and validate the data provided by the user
        try{
            const user =await newUser.save();
            res.status(200).json(user);
        }catch(er){
            console.error(er)
            return res.status(409).json(er);
        }
    }catch(err){
        res.status(500).json(err);
        console.error(err);
    }
});



//login
router.post("/login", async (req,res)=>{
    try{
        const user=await User.findOne({username: req.body.username});
        if(!user) return  res.status(400).json("User not found!");
        const validate = await bcrypt.compare(req.body.password,user.password);
        if(!validate)return res.status(400).json("wrong password!");

        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }

})

module.exports=router;


