const express=require('express')
const app = express();
const portNo=5000;
const bodyparser = require('body-parser');

app.get('/',(req,res)=>{
    res.send("working")
})

app.get('/movies/:id',(req,res)=>{
    res.send("about page")
    console.log(req.body)
    })

app.listen(portNo,()=>{
    console.log("server listening on port ",portNo)
})