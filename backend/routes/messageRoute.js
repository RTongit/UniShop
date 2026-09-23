import express from "express"
import { getChatMessages, getChats, getNotificationStatus, postChat, postChatMessage } from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";

const messageRouter = express.Router();

// post chat document api(todo : need to modify) : 
messageRouter.post('/',protectRoute, postChat);

// get chats api : 
messageRouter.get('/chats',protectRoute,getChats)

// post specific chat message api : 
messageRouter.post('/message',protectRoute,postChatMessage)

// get specific chat messages(i.e convo between two users) api
messageRouter.get('/:chatId/messages',protectRoute,getChatMessages)

// get Notification in the navbar message icon : 
messageRouter.get('/users/notification-status',protectRoute,getNotificationStatus)


export default messageRouter;