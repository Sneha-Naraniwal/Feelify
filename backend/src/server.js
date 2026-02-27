import express from "express";
import path from "path";
import {ENV} from "./lib/env.js"
import { connectDB } from "./lib/db.js"; 
import cors from "cors";
const app=express();

/// middleware
app.use(express.json())
// here true means server alows a browser to send cookies to the server, and also allows the browser to read cookies from the server.
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))

const __dirname=path.resolve();
app.get("/",(req, res)=>{
  res.status(200).json({msg:" Success from api"})
})
////f app for deployment
if(ENV.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
app.get("/*any", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend", "dist", "index.html")
  );
});

}

const startServer=async()=>{
  try{
    await connectDB(); 
    app.listen(ENV.PORT, ()=>{console.log("Server is reachable on port", ENV.PORT)

});
  }  catch(err){
    console.log("Error in starting server", err);
    process.exit(1); /// 1 means failure 
  }};
startServer();