import express from "express";
import path from "path";
import {ENV} from "./lib/env.js"
import { connectDB } from "./lib/db.js"; 
import cors from "cors";
import {serve} from "inngest/express";
import {clerkMiddleware} from '@clerk/express'
import {inngest, functions} from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
const app=express();
 
const __dirname=path.resolve();

/// middleware
app.use(express.json())
// here true means server alows a browser to send cookies to the server, and also allows the browser to read cookies from the server.
app.use(cors({origin:ENV.CLIENT_URL, credentials:true}))
app.use(clerkMiddleware()) /// this will add the user object to the request if the user is authenticated same as req.auuth()

app.use("/api/inngest", serve({client:inngest , functions}))
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);




app.get("/health", (req, res)=>{
  res.status(200).json({msg:" Success from api"})
})
////f app for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend/dist/index.html")
    );
  });
}
else {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
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
