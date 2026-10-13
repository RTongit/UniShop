import Chat from "../models/ChatModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Item from "../models/ItemModel.js";
import { isValidObjectId } from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { Socket } from "socket.io";

async function postChat(req, res) {
  const { seller, item } = req.body;
  const buyer = req.AuthUser.userId;

  try {
    if (!seller)
      return res.status(400).json({ message: "SellerId is not defined" });
    if (!item)
      return res.status(400).json({ message: "ItemId is not defined" });

    // check if same buyer wants to buy from himself/herself
    if (buyer == seller)
      return res
        .status(400)
        .json({ message: "User cannot buy from himself/herself" });

    // Check for valid object Id
    if (!isValidObjectId(buyer))
      return res.status(400).json({ message: "Invalid objectId format" });
    if (!isValidObjectId(seller))
      return res.status(400).json({ message: "Invalid objectId format" });
    if (!isValidObjectId(item))
      return res.status(400).json({ message: "Invalid objectId format" });

    // Check if the buyer exist(Already will be handled by ProtectRoute)

    // Check if the seller exist
    let existingUser = await User.findOne({ _id: seller });
    if (!existingUser)
      return res.status(404).json({ message: "Seller not found" });

    // Check if the item exist
    const existingItem = await Item.findOne({ _id: item, seller: seller });
    if (!existingItem)
      return res.status(404).json({ message: "Item not found" });

    // Check if the Chat already exist :
    const existingChat = await Chat.findOne({
      buyer: buyer,
      seller: seller,
      item: item,
    })
      .populate("buyer", "name profilePic")
      .populate("seller", "name profilePic")
      .populate("item", "title");

    if (existingChat) return res.status(200).json(existingChat);
    const newChat = new Chat({
      buyer: buyer,
      seller: seller,
      item: item,
    });
    await newChat.save();

    // Populating the new created chat
    await newChat.populate([
      { path: "buyer", select: "name profilePic" },
      { path: "seller", select: "name profilePic" },
      { path: "item", select: "title" },
    ]);

    return res.status(201).json(newChat);
  } catch (error) {
    console.log(`Error in postChat controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getChats(req, res) {
  const LoggedUser = req.AuthUser.userId;
  try {
    let chats = await Chat.find({
      $or: [{ buyer: LoggedUser }, { seller: LoggedUser }],
    })
      .populate("buyer", "name profilePic")
      .populate("seller", "name profilePic")
      .populate("item", "title")
      .lean();

    await Promise.all(
      chats.map(async (chat) => {
        async function fetchData() {
          try {
            const newMessage = await Message.findOne({
              chat: chat._id,
              sender: { $ne: LoggedUser },
            }).sort({ createdAt: -1 });

            chat.newMessageTime = newMessage ? newMessage.createdAt : "";
            // console.log(chat.newMessageTime)
          } catch (error) {
            console.log(`Error in getChats controller : ${error.message}`);
            return res.status(500).json({ message: "Internal Server Error" });
          }
        }
        return await fetchData();
      }),
    );

    return res.status(200).json(chats);
    // Note frontend will say "Chat is empty if chats is empty array"
  } catch (error) {
    console.log(`Error in getChats controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function postChatMessage(req, res) {
  try {
    const { chatId, text, image } = req.body;
    const sender = req.AuthUser.userId;

    if (!chatId)
      return res.status(400).json({ message: "ChatId is not defined" });
    if (!text || text.trim() === "")
      return res.status(400).json({ message: "Message cannot be empty" });

    // check the format of id :
    if (!isValidObjectId(chatId))
      return res.status(400).json({ message: "Invalid objectId format" });

    // check if the chat exist or not:
    const existingChat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyer: sender }, { seller: sender }],
    });
    if (!existingChat)
      return res.status(404).json({ message: "Chat does not exist" });

    const newReceiver =
      existingChat.buyer.toString() !== sender
        ? existingChat.buyer
        : existingChat.seller;

    // Uploading the base64url to cloudinary and storing the image in cloudinary and getting an obj as return value
    let imageUrl = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url;
    }

    const newChatMessage = new Message({
      chat: chatId,
      sender: sender,
      receiver: newReceiver,
      text: text,
      image: imageUrl,
    });
    await newChatMessage.save();

    await newChatMessage.populate([
      { path: "receiver", select: "name profilePic" },
      { path: "sender", select: "name profilePic" },
    ]);

    const io = req.app.get("io");
    io.to(chatId).emit("newMessage", newChatMessage);

    // Check whether the receiver is currently viewing this chat; only send a global notification if they are not.
    const sockets = await io.in(chatId).fetchSockets();
    let receiverIsInChat = false;
    for (let i = 0; i < sockets.length; i++) {
      if (sockets[i].userId.toString() === newReceiver.toString())
        receiverIsInChat = true;
    }

    if (receiverIsInChat == false) {
      // If receiver is buyer :
      if (newReceiver == existingChat.buyer) {
        if (existingChat.buyerHasUnreadMessage == false) {
          const user = await User.findByIdAndUpdate(
            newReceiver,
            { $inc: { unreadChatCount: 1 } },
            { returnDocument: "after" },
          );
          await Chat.findByIdAndUpdate(existingChat._id, {
            $set: { buyerHasUnreadMessage: true },
          });
          io.to(newReceiver.toString()).emit("newGlobalNotification", {
            unreadChatCount: user.unreadChatCount,
          });

          io.to(newReceiver.toString()).emit("newChatNotification", {
            chat : existingChat
          });
        }
        
      }

      // If receiver is seller :
      else if (newReceiver == existingChat.seller) {
        if (existingChat.sellerHasUnreadMessage == false) {
          const user = await User.findByIdAndUpdate(
            newReceiver,
            { $inc: { unreadChatCount: 1 } },
            { returnDocument: "after" },
          );
          await Chat.findByIdAndUpdate(existingChat._id, {
            $set: { sellerHasUnreadMessage: true },
          });
          io.to(newReceiver.toString()).emit("newGlobalNotification", {
            unreadChatCount: user.unreadChatCount,
          });
          
          io.to(newReceiver.toString()).emit("newChatNotification", {
            chat : existingChat
          });
        }
      }
    }


    return res.status(201).json(newChatMessage);
  } catch (error) {
    console.log(`Error in postChatMessage controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getChatMessages(req, res) {
  const authUserId = req.AuthUser.userId;
  const chatId = req.params.chatId;
  try {
    if (!chatId)
      return res.status(400).json({ message: "ChatId is not defined" });

    // check the format of id :
    if (!isValidObjectId(chatId))
      return res.status(400).json({ message: "Invalid objectId format" });

    // check if the chat exist or not:
    const existingChat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyer: authUserId }, { seller: authUserId }],
    });
    if (!existingChat)
      return res.status(404).json({ message: "Chat does not exist" });

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 })
      .populate("sender", "name profilePic")
      .populate("receiver", "name profilePic");
    return res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in getChatMessages controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getGlobalNotificationStatus(req, res) {
  const LoggedUser = req.AuthUser.userId;
  try {
    const user = await User.findOne({ _id: LoggedUser }).select({
      unreadChatCount: 1,
    });
    return res.status(200).json({ unreadChatCount: user.unreadChatCount });
  } catch (error) {
    console.log(`Error in getNotificationStatus controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function markChatAsRead(req, res) {
  const LoggedUser = req.AuthUser.userId;
  const chatId = req.params.chatId;
  try {
    if (!chatId)
      return res.status(400).json({ message: "ChatId is not defined" });

    // check the format of id :
    if (!isValidObjectId(chatId))
      return res.status(400).json({ message: "Invalid objectId format" });

    // check if the chat exist or not:
    const existingChat = await Chat.findOne({
      _id: chatId,
      $or: [{ buyer: LoggedUser }, { seller: LoggedUser }],
    });
    if (!existingChat) {
      return res.status(404).json({ message: "Chat does not exist" });
    }

    // If loggedUser is buyer:
    if (LoggedUser == existingChat.buyer) {
      let updatedUser;

      if (existingChat.buyerHasUnreadMessage == true) {
        let updatedChat = await Chat.findOneAndUpdate(
          {
            _id: existingChat._id,
            buyerHasUnreadMessage: true,
          },
          { $set: { buyerHasUnreadMessage: false } },
          { returnDocument: "after" },
        );

        if (updatedChat) {
          updatedUser = await User.findByIdAndUpdate(
            LoggedUser,
            { $inc: { unreadChatCount: -1 } },
            { returnDocument: "after" },
          ).select("unreadChatCount");
        } else {
          updatedUser =
            await User.findById(LoggedUser).select("unreadChatCount");
        }
      } else {
        updatedUser = await User.findById(LoggedUser).select("unreadChatCount");
      }

      return res.status(200).json({
        unreadChatCount: updatedUser?.unreadChatCount ?? 0,
      });
    }

    // If loggedUser is seller :
    else if (LoggedUser == existingChat.seller) {
      let updatedUser;
      // If it has unreadMessage
      if (existingChat.sellerHasUnreadMessage == true) {
        let updatedChat = await Chat.findByIdAndUpdate(
          { _id: existingChat._id, sellerHasUnreadMessage: true },
          { $set: { sellerHasUnreadMessage: false } },
        );

        if (updatedChat) {
          updatedUser = await User.findByIdAndUpdate(
            LoggedUser,
            { $inc: { unreadChatCount: -1 } },
            { returnDocument: "after" },
          );
        } else
          updatedUser =
            await User.findById(LoggedUser).select("unreadChatCount");
      } else
        updatedUser = await User.findById(LoggedUser).select("unreadChatCount");
      return res.status(200).json({
        unreadChatCount: updatedUser?.unreadChatCount ?? 0,
      });
    }
    
  } catch (error) {
    console.log(`Error in markChatAsRead controller : ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export {
  getChats,
  getChatMessages,
  postChat,
  postChatMessage,
  getGlobalNotificationStatus,
  markChatAsRead,
};
