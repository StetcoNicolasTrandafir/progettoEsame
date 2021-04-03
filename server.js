const express= require('express');
const bcrypt=require('bcrypt');
const https=require('https');
const ERRORS= require('errors');
const bodyParser= require('body-parser');
const fs= require('fs');
const app= express();


const port= 1337;
const privateKey= fs.readFileSync("keys/private.key", "utf8");
const certificate= fs.readFileSync("keys/certificate.crt", "utf8");
const credentials ={"key": privateKey, "cert": certificate};

var httpsServer= https.createServer(credentials, app);
httpsServer.listen(port, '127.0.0.1', function(){
    console.log("Server running on port: "+port);
});


app.use("/", bodyParser.json());
app.use("/", bodyParser.urlencoded({extended:true}));

app.post("/prova",function(req, res){
    console.log("abbateeee");
    res.send("gino");
});
