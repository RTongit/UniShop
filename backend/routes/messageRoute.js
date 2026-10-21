import express from "express"
import { getChatMessages, getChats, getGlobalNotificationStatus, postChat, postChatMessage, markChatAsRead } from "../controllers/messageController.js";
import protectRoute from "../middleware/protectRoute.js";
import isVerified from "../middleware/isVerified.js";

const messageRouter = express.Router();

// post chat document api(todo : need to modify) : 
messageRouter.post('/',protectRoute,isVerified,postChat);

// get chats api : 
messageRouter.get('/chats',protectRoute,isVerified,getChats)

// post specific chat message api : 
messageRouter.post('/message',protectRoute,isVerified,postChatMessage)

// get specific chat messages(i.e convo between two users) api
messageRouter.get('/:chatId/messages',protectRoute,isVerified,getChatMessages)

// get Notification in the navbar message icon : 
messageRouter.get('/users/global-notification-status',protectRoute,getGlobalNotificationStatus)

// marks an unread chat as read 
messageRouter.patch('/users/update-chat-notification-status/:chatId', protectRoute, isVerified,markChatAsRead);


export default messageRouter;