import express from 'express'
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import itemRouter from "./routes/itemRoute.js";
import cors from "cors"
import messageRouter from './routes/messageRoute.js';
import {createServer} from "http"
import {Server} from "socket.io"


dotenv.config();
const port = process.env.PORT;
const app = express();
const httpServer = createServer(app)

app.use(cors(
    {
        origin:["http://localhost:3000",process.env.FRONTEND_URL],
        credentials : true
    }
))
app.use(express.json({limit : "10MB"}))
app.use(cookieParser())
app.use('/api/auth',authRouter);
app.use('/api/items',itemRouter)
app.use('/api/chat',messageRouter)

app.get('/',(req,res)=>{
    res.status(200).json({"message" : "Welcome to Unishop HomePage"});
})

// Creating the socket-backend connection : 
const io = new Server(httpServer,{
    cors : {
        origin:["http://localhost:3000",process.env.FRONTEND_URL],
        credentials : true
    }
})
app.set("io", io);

// io object listens for event name connection from frontend socket
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Connected User joins Chat/Room :
    socket.on("JoinChat",(ChatId)=>{
        socket.join(ChatId)
        console.log(`SocketId = ${socket.id} joined the chatId = ${ChatId}`)
    })
    socket.on("LeaveChat",(ChatId)=>{
        socket.leave(ChatId);
        console.log(`SocketId = ${socket.id} leaved the chatId = ${ChatId}`)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected:", socket.id);
    })
});


httpServer.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
    connectDB();
})