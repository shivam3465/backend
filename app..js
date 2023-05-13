import express from 'express'
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/',{dbName: 'backend'}).then(()=> console.log("database connected"));

const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User=mongoose.model('userDetails',userSchema);


const app = express(),portNo=4000;
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("working")
})

app.get('/users/all',async (req,res)=>{
    const users=await User.find({});  

    res.json({
        succcess: true,
        users
    });
})

app.get('/users/find',async (req,res)=>{
    const {id}=req.query;
    let user;
    try{
        user = await User.findById(id);    
        res.status(200).json({
            succcess: true,
            message: 'user found', 
            user: user,       
        });
    }
    catch{
        console.log(console.error)
        res.status(404).json({succcess:false, message: 'user not found'})
    }

    console.log(user);    
})

app.post('/users/new', async (req,res)=>{
    const {name,email,password}=req.body;
    console.log(name,email,password);
    await User.create({name,email,password});

    res.status(201).json({
        succcess: true,
        message : " user created successfully"
    })
})

app.listen(portNo,()=>{
    console.log("server listening on port ",portNo)
})