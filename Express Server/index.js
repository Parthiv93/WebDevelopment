import express from "express";
const app=express();
const port=3000;

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>");
});

app.get("/about",(req,res)=>{
    res.send("<h1>About Page</h1><p>My name is Parthiv Manoj</p>");
});

app.get("/contact",(req,res)=>{
    res.send("<h1>Contact Details</h1><p>Email : parthivmanoj15@gmail.com</p>");
});

app.listen(port,()=>{
    console.log(`Server running at port ${port}.`);
})