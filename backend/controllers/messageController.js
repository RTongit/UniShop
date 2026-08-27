import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Item from "../models/ItemModel.js";
import { isValidObjectId } from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { Socket } from "socket.io";

async function postChat(req, res) {
  const { seller, item } = req.body;
  const buyer = req.AuthUser.userId

  try {

    if(!seller) return res.status(400).json({ message: "SellerId is not defined" });
    if(!item) return res.status(400).json({ message: "ItemId is not defined" });

    // check if same buyer wants to buy from himself/herself
    if(buyer==seller) return res.status(400).json({message : "User cannot buy from himself/herself"})

    // Check for valid object Id
    if (!isValidObjectId(buyer)) return res.status(400).json({ message: "Invalid objectId format" });
    if (!isValidObjectId(seller)) return res.status(400).json({ message: "Invalid objectId format" });
    if (!isValidObjectId(item)) return res.status(400).json({ message: "Invalid objectId format" });

    // Check if the buyer exist(Already will be handled by ProtectRoute)

    // Check if the seller exist
    let existingUser = await User.findOne({ _id: seller });
    if (!existingUser) return res.status(404).json({ message: "Seller not found" });

    // Check if the item exist
    const existingItem = await Item.findOne({ _id: item, seller : seller });
    if (!existingItem) return res.status(404).json({ message: "Item not found" });

    // Check if the Chat already exist :
    const existingChat = await Chat.findOne({
      buyer: buyer,
      seller: seller,
      item: item,
    }).populate("buyer","name profilePic").populate("seller","name profilePic").
    populate("item","title");

    if (existingChat) return res.status(200).json(existingChat);
    const newChat = new Chat({
        buyer: buyer,
        seller: seller,
        item: item,
    });
    await newChat.save();
    
    // Populating the new created chat 
    await newChat.populate(
      [
        {path :"buyer", select : "name profilePic"},
        {path :"seller", select : "name profilePic"},
        {path :"item", select : "title"},
      ]
    )

    return res.status(201).json(newChat);

  } catch (error) {
    console.log(`Error in postChat controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server Error"});
  }
}

async function getChats(req, res) {
  const LoggedUser = req.AuthUser.userId
  try {
    let chats = await Chat.find({$or : [{buyer : LoggedUser},{seller : LoggedUser}]})
    .populate("buyer","name profilePic").populate("seller","name profilePic").
    populate("item","title")
    // console.log(chats)

    return res.status(200).json(chats);
    // Note frontend will say "Chat is empty if chats is empty array"

  }
  catch(error) {
    console.log(`Error in getChats controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server Error"});
  }
}

async function postChatMessage(req, res) {
     
  try {
    const {chatId,text,image} = req.body
    const sender = req.AuthUser.userId

    if(!chatId) return res.status(400).json({message : "ChatId is not defined"})
    if(!text || text.trim()==="") return res.status(400).json({message : "Message cannot be empty"})

    // check the format of id : 
    if (!isValidObjectId(chatId)) return res.status(400).json({ message: "Invalid objectId format" });

    // check if the chat exist or not: 
    const existingChat = await Chat.findOne(
      {_id : chatId,
       $or : [{buyer : sender},{seller : sender}]
      }
    )
    if(!existingChat) return res.status(404).json({ message: "Chat does not exist" });

    const newReceiver = (existingChat.buyer.toString()!==sender) ? 
    existingChat.buyer : existingChat.seller

    // Uploading the base64url to cloudinary and storing the image in cloudinary and getting an obj as return value
    let imageUrl = ""
    if(image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url
    }

    const newChatMessage = new Message({
      chat : chatId,
      sender : sender,
      receiver : newReceiver,
      text : text,
      image : imageUrl,
    })
    await newChatMessage.save();

    await newChatMessage.populate([
      {path : "receiver", select : "name profilePic"},
      {path : "sender", select : "name profilePic"}
    ])

    const io = req.app.get("io");
    io.to(chatId).emit("newMessage",newChatMessage)

    return res.status(201).json(newChatMessage)

  }
  catch(error) {
    console.log(`Error in postChatMessage controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server Error"});
  }

}

async function getChatMessages(req, res) {

  const authUserId = req.AuthUser.userId
  const chatId = req.params.chatId
  try {
    if(!chatId) return res.status(400).json({message : "ChatId is not defined"})

    // check the format of id : 
    if (!isValidObjectId(chatId)) return res.status(400).json({ message: "Invalid objectId format" });

    // check if the chat exist or not: 
    const existingChat = await Chat.findOne(
      {_id : chatId,
       $or : [{buyer : authUserId},{seller : authUserId}]
      }
    )
    if(!existingChat) return res.status(404).json({ message: "Chat does not exist" });
    
    const messages = await Message.find({chat : chatId}).sort({createdAt : 1}).populate("sender","name profilePic")
    .populate("receiver","name profilePic")
    return res.status(200).json(messages)

  }
  catch(error) {
    console.log(`Error in getChatMessages controller : ${error.message}`);
    return res.status(500).json({message : "Internal Server Error"});
  }
}

export { getChats, getChatMessages, postChat, postChatMessage };
