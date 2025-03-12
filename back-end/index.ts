import express from "express";

const app = express();

app.get("/", (req, res)=>{
    res.send("tes");
})

app.listen(3000, (err) => {
    console.log("server started");
});