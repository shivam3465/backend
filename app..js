import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

mongoose.connect('mongodb://localhost:27017/',{dbName:'backend'}).then(()=> console.log("database connected"))

const userSchema=new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User=mongoose.model('users',userSchema);


const app=express();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const authenticator=(req,res,next)=>{    
    if(req.cookies.token){
        next();
    }
    else{
        res.redirect('/login');
    }
}

app.get('/',authenticator,(req,res)=>{    
    res.sendFile(path.join(path.resolve(),'/index.html'));
})
app.get('/register',(req,res)=>{
    res.sendFile(path.join(path.resolve(),'/register.html'));
})
app.get('/login',(req,res)=>{
    res.sendFile(path.join(path.resolve(),'/login.html'));
})
app.get('/logout',(req,res)=>{
    res.cookie('token',"none",{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.redirect('/')
})



app.post('/register',async (req,res)=>{
    const {name,email,password}=req.body;
    const prevUser=await User.findOne({email});
    
    // console.log(prevUser);
    if(!prevUser){
        const hashedPassword=await bcrypt.hash(password,10);        
        const user=await User.create({name,email,password:hashedPassword});   
    }    
    res.redirect('/')
})

app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    const user=await User.findOne({email});    
    if(!user){        
        res.redirect('/register');
    }
    else{
        const id=jwt.sign(user.id,"adlfkkiowesoiviowod")
        const isMatch= bcrypt.compare(password,user.password);
        if(isMatch){
            res.cookie('token',id,{
                expires: new Date(Date.now()+ 1000*60*60),
                httpOnly:true,
            })
            res.redirect('/');
        }
        else{
            res.redirect('/login');
        }
    }
})

app.listen(5000,()=>{
    console.log("server listening on port 5000")
})