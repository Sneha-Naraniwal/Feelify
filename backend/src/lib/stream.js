import {StreamChat} from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import {ENV} from "./env.js";

const apiKey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    throw new Error("Stream API key and secret are required");
}

export const chatClient=StreamChat.getInstance(apiKey, apiSecret);
export const streamClient = new StreamClient(apiKey, apiSecret); 

export const upsertStreamUser=async(userData)=>{
  try{
    await chatClient.upsertUser(userData);
    console.log(`Stream user with ID ${userData.id} upserted successfully.`);
  } catch (error) {
    throw new Error("Failed to upsert Stream user: " + error.message);
  }
};

export const deleteStreamUser=async(userId)=>{
  try{
    await chatClient.deleteUser(userId);  
    console.log(`Stream user with ID ${userId} deleted successfully.`);
  } catch (error) {
    throw new Error("Failed to delete Stream user: " + error.message);
  }
};