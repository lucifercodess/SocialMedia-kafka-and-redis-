import mongoose from "mongoose";

 export const connectDb = async(req,res)=>{
  const db = await mongoose.connect(process.env.MONGO_URI);
  if(db){
    console.log('mongodb connected');
  }
  else{
    console.log("error connecting to mongodb ")
  }
}

