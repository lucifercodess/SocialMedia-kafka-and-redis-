import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { connectDb } from "./database/db.js";
import { connectRedis } from "./database/redis.js";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
const app = express();
dotenv.config();

// middllewares app.use
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use('/api/auth',authRoute);
app.use('/api/post',postRoute);
app.use('/api/user',userRoute);

const PORT = process.env.PORT;

app.listen(PORT,()=>{
  connectDb();
  connectRedis();
  console.log(`server listening on port ${PORT}`);
})