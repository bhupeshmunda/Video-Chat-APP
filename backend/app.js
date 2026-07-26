import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import {connectSocket} from './controllers/socketManager.js';
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const server = createServer(app);
const io = connectSocket(server);

dotenv.config();

await connectDB();

app.use(cookieParser());

app.use(cors({
  origin: config.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/users", userRoutes);
app.get("/home", (req,res)=> {
    res.json({message: "hello world"}); 
})

server.listen(8080, ()=>{
    console.log("app running at 8080");
})
