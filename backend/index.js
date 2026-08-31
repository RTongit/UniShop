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
import Chat from './models/ChatModel.js';
import User from './models/UserModel.js';
import jwt from "jsonwebtoken"


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

// IO start from here and goes yo io.on using next
io.use(async (socket,next)=>{
    // Socket obj is coming from frontend
    // The client sends an HTTP handshake request to 
    // establish the Socket.IO connection, and the browser can attach the 
    // existing cookie to that request.
    // So that how we can access the cookie in socket backend as well 
    // Now we can authenticate a user from cookie info
    try {
        const rawCookie = socket.handshake.headers.cookie;
        if(!rawCookie) {
            throw new Error("No cookie found");
        }
        // Parse cookie manually — no package needed
       const token = rawCookie
        .split(";")
        .find(c => c.trim().startsWith("authCookie="))
        ?.split("=")[1]

        if(!token) throw new Error("No token found")

        const payloadObj = jwt.verify(token,process.env.SECRET_KEY)
        const existingUser = await User.findById({_id:payloadObj.userId},{password : 0})
        if(!existingUser) throw new Error("User does not exist")

        socket.userId = payloadObj.userId
        next();
    }

    catch(error) {
        console.log(error)
        // Here it stops the execution of the callback function 
        // Then next(err) stops the execution of the upcoming middleware
        // Because the Express knows that an error has occurred
        return next(new Error("Unauthorized"))
    }

})

// io object listens for event name connection from frontend socket
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    // Connected User joins Chat/Room :
    socket.on("JoinChat",async (chatId)=>{

        // Verify that finally that userId belongs to the chatId
        try {
            const existingChat = await Chat.findOne({
                _id : chatId,
                $or : [
                    {seller : socket.userId},
                    {buyer : socket.userId}
                ]
            })
            if(!existingChat) throw new Error("You are not authorized to join this chat");
            socket.join(chatId)
            console.log(`SocketId = ${socket.id} joined the chatId = ${chatId}`)
        }

        catch(error) {
            console.log(error);
        }

    })
    socket.on("LeaveChat",(chatId)=>{
        socket.leave(chatId);
        console.log(`SocketId = ${socket.id} leaved the chatId = ${chatId}`)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected:", socket.id);
    })
});


httpServer.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
    connectDB();
})