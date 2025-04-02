import express from "express";
import app from "./app"
import 'dotenv/config';


//Tes koneksi db


//Health chck
app.get("/", (req, res)=>{
    res.send("tes");
})



app.listen(3000, (err) => {
    console.log("server started");
});