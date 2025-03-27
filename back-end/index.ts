import express from "express";
import { Sequelize } from "sequelize";
import 'dotenv/config';

const app = express();

//Tes koneksi db


//Hea
app.get("/", (req, res)=>{
    res.send("tes");
})

app.listen(3000, (err) => {
    console.log("server started");
});