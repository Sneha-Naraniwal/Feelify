import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB=async()=>{
  try{
    const conn=await mongoose.connect(ENV.DB_URL);
    console.log("Database connected successfully");
  }
  catch(err){
    console.log("Error in connecting to database", err);
    process.exit(1); /// 1 means failure 
  }
};