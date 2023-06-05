const express=require("express");
const cors=require("cors")
// const followingRoute = require("./routes/following");
const app=express();
const dotenv=require("dotenv");


dotenv.config();
const mongoose=require("mongoose");
const authRoute=require("./routes/auth");
const usersRoute=require("./routes/users");
const postsRoute=require("./routes/posts");
const categoriesRoute=require("./routes/categories");

const multer=require("multer");
const path = require("path");

// app.use("/api/follow", followingRoute);
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({
    // origin:"https://z-blog.netlify.app"
    origin:"http://localhost:3000"
}));
mongoose.connect("mongodb+srv://yudhvirthakurr:zGLUY350e3P4IMOq@cluster0.wauewqd.mongodb.net/?retryWrites=true&w=majority")
.then(console.log("db connected"))
.catch((err)=>console.log(err));

const storage=multer.diskStorage({
     destination:(req,file,cb)=>{ 
        cb(null,"images");
     },
     filename:(req,file,cb)=>{
        cb(null,req.body.name);
     }
});

const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("file has been uploaded");
})

app.use("/z",(req,res)=>{
    console.log("i am listening");
    res.send("hello");
});




app.use("/api/auth",authRoute);
app.use("/api/users",usersRoute);
app.use("/api/posts",postsRoute);
app.use("/api/categories",categoriesRoute);
app.listen(5000,()=>{
    console.log("backend is running on 5000 --");
});