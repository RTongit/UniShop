import cloudinary from "../lib/cloudinary.js";
import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";
import { isValidObjectId } from "mongoose";
import Chat from "../models/ChatModel.js";
import Purchase from "../models/Purchase.js";
import { randomInt } from "node:crypto";
import { sendReservationCodeEmail } from "../lib/emailService.js";
import bcrypt from "bcryptjs"
import Message from "../models/MessageModel.js";

async function postItem(req,res) {
    const {title,category,brand,description,price,pickupLocation,photos} = req.body
    const seller = req.AuthUser.userId
    try{
        if(!title || !category || !description || !price || !pickupLocation || !photos) {
            return res.status(400).json({message : "Mandatory fields are not filled"});
        }
        if(title=="" || category=="" || description=="" || price=="" || pickupLocation=="" || (photos.length==0)) {
            return res.status(400).json({message : "Mandatory fields are not filled"});
        }
        // We check for the format of mongoDB id : (todo : need upgrade)
        if(!isValidObjectId(seller)) return res.status(400).json({message : "Invalid objectId format"}) 

        // Cloudinary upload of images : 
        let newPhotos = [];
        for(let i = 0;i<photos.length;i++) {
            const result = await cloudinary.uploader.upload(photos[i]);
            newPhotos.push(result.secure_url)
        }

        const newItem = new Item({
            seller : seller,
            title : title,
            category : category,
            brand : brand,
            description : description,
            price : price,
            pickupLocation : pickupLocation,
            photos : newPhotos
        })

        await newItem.save();
        return res.status(201).json({message : "Item added successfully"});
    }

    catch(error) {
        console.log(`Error in postItem Controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function searchItems(req,res) {
    try{
        let {title} = req.query;
        const authUserId = req.AuthUser.userId
        if(!title) return res.status(404).json({message : "Sorry! No items found"});
        // We trim the query
        title = title.trim();
        // We check if it is empty or not : 
        if(title.length==0) {return res.status(404).json({message : "Sorry! No items found"})};

        const verifiedSellers = await User.find({
          role: "student",
          verificationStatus: "verified",
        }).select("_id");

        const verifiedSellerIds = verifiedSellers.map((user) => user._id);
        
        // will get items from database :
        const items = await Item.find(
        {$and : 
            [
               { 
                 seller : {$ne : authUserId, $in :verifiedSellerIds }
               },
               {$or : 
                  [
                  {title:{$regex : title , $options : "i"}},
                  {category:{$regex : title , $options : "i"}}
                  ]
                },
                {isDeleted : false},
                {status : "available"}
            ]
        }
        ).sort({createdAt :-1});
        
        if(items.length==0) {
            return res.status(404).json({message : "Sorry! No items found"});
        }
        // return as response :
        return res.status(200).json(items);
    }

    catch(error) {
        console.log(`Error in search controller : ${error.message}`)
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function getSingleItem(req,res) {
    const itemid = req.params.id;
    try {
        // we check if objectId is valid or not 
        if(!isValidObjectId(itemid)) return res.status(400).json({message : "Invalid ObjectId"});
        const item = await Item.findOne({_id : itemid,isDeleted : false})
        if(!item) return res.status(404).json({message : "Item not found"})

        // We need name of the seller : 
        const seller = await User.findOne({_id : item.seller},{password : 0});
        if(!seller) return res.status(404).json({message : "Seller not found"})
        return res.status(200).json(
    {
        id : item._id,
        title : item.title,
        category : item.category,
        brand : item.brand,
        description : item.description,
        price : item.price,
        photos : item.photos,
        status : item.status,
        createdAt : item.createdAt,
        profilePic : seller.profilePic,
        sellerInfo : {
                sellerId : seller._id,
                sellerName : seller.name,
                verificationStatus : seller.verificationStatus,
                department : seller.department,
                graduationYear : seller.graduationYear,
                phoneNumber : seller.phoneNumber,
                joinedAt : seller.createdAt
        }
    });
    }

    catch(error) {
        console.log(`Error in getSingleItem controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function getMyItems(req,res) {
    const authUserId = req.AuthUser.userId
    try {
        const myItems = await Item.find({seller : authUserId, isDeleted : false});
        return res.status(200).json(myItems);
    }
    catch(error) {
        console.log(`Error in getMyItems controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }


}

async function editItem(req,res) {
    const {title : newTitle, category : newCategory, brand : newBrand, description : newDescription, price : newPrice, pickupLocation : newPickuplocation, photos : newPhotos, status : newStatus} = req.body

    const itemId = req.params.id
    const authUserId = req.AuthUser.userId
    try {

        // we check if id is in valid format : 
        if(!isValidObjectId(itemId)) return res.status(400).json({message : "Invalid objectId"})

        // Only the seller who owns this active item can edit it.
        const item = await Item.findOne({_id:itemId, seller:authUserId, isDeleted:false});
        if(!item) return res.status(404).json({message : "Cannot edit! Item does not exist"});

        let updatedData = {}
        if(newTitle && newTitle.trim()!="") updatedData.title = newTitle.trim();
        if (newCategory && newCategory.trim()!="") updatedData.category = newCategory.trim();
        if (newBrand && newBrand.trim()!="") updatedData.brand = newBrand.trim();
        if (newDescription && newDescription.trim()!="") updatedData.description = newDescription.trim();
        if (newPrice && newPrice.trim()!="") updatedData.price = newPrice.trim();
        if (newPickuplocation && newPickuplocation.trim()!="") updatedData.pickupLocation = newPickuplocation.trim();
        
        if (newPhotos && newPhotos.length>0) {
            let dummyPhotos = []
            for(let i = 0;i<newPhotos.length;i++) {
                const result = await cloudinary.uploader.upload(newPhotos[i]);
                dummyPhotos.push(result.secure_url)
            }
            updatedData.photos = dummyPhotos;
        }
        
        if (newStatus !== undefined) {
            if (!['available', 'sold'].includes(newStatus)) {
                return res.status(400).json({message : "Invalid item status"});
            }
            if (item.status === "reserved") {
                return res.status(409).json({message : "A reserved item cannot be manually restocked or marked sold"});
            }
            if (newStatus !== item.status) updatedData.status = newStatus;
        }

        // If nothing is provided :
        if(Object.keys(updatedData).length==0) return res.status(400).json({message : "Cannot update empty fields"});

        const updatedItem = await Item.findOneAndUpdate(
            {_id:itemId, seller:authUserId, isDeleted:false},
            {$set : updatedData},
            {returnDocument : "after"})
        if(!updatedItem) return res.status(404).json({message : "Cannot edit! Item does not exist"});
        return res.status(200).json(updatedItem);
    }

    catch(error) {
        console.log(`Error in editItem Controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function deleteItem(req,res) {
    const itemId = req.params.id;
    const authUserId = req.AuthUser.userId;
    try{
        // we check if id is in valid format : 
        if(!isValidObjectId(itemId)) return res.status(400).json({message : "Invalid objectId"});

        // Only the seller who owns this active item can soft-delete it.
        const item = await Item.findOneAndUpdate(
            {_id : itemId, seller : authUserId, isDeleted : false, status : {$in : ['available','sold']}},
            {$set : {isDeleted : true}},
            {returnDocument : "after"}
        );
        if (!item) {
            return res.status(404).json({message: "Item not found or currently reserved. Reserved items cannot be deleted.",});
        }

        return res.status(200).json({message : "Item successfully deleted"});
    }
    catch(error) {
        console.log(`Error in deleteItem controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function reserveItem(req,res) {
    const itemId = req.params.id;
    const authUserId = req.AuthUser.userId
    try {
        // we check if id is in valid format : 
        if(!isValidObjectId(itemId)) return res.status(400).json({message : "Invalid objectId"});

        // check if the Authuser is buyer or not  : 
        const existingChat = await Chat.findOne({buyer : authUserId,item :itemId})
        if(!existingChat) return res.status(404).json({message : "Start a chat with the seller before reserving this item."});

        // check for the item validity and it is available or not : 
        const existingItem = await Item.findOne({_id : itemId,seller : {$ne : authUserId}, status : "available"})
        if(!existingItem) return res.status(409).json({message : "Item is no longer available."});

        // Atomically claim the item. Only one concurrent request can succeed preventing race condition.
        const reservedItem = await Item.findOneAndUpdate(
            {
                _id: itemId,
                seller: { $ne: authUserId  },
                status: "available",
            },
            { $set: { status: "reserved" } },
            {returnDocument : "after"}
        )
        if(!reservedItem) return res.status(409).json({message: "Item is no longer available."});

        // generate the random 6 digit code : 
        const code = randomInt(100000, 1_000_000).toString();

        // Hash the code
        const salt = await bcrypt.genSalt(10);
        const hashedCode = await bcrypt.hash(code,salt);

        // generate the purchase item and save to db: 
        const newPurchase =  new Purchase({
            item : reservedItem._id,
            buyer : authUserId,
            seller : reservedItem.seller,
            pickupLocation : reservedItem.pickupLocation,
            status : "reserved",
            verificationCodeHash : hashedCode,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            completedAt : null
        })

        try {
            await newPurchase.save();
        }
        catch(saveError) {
            // Undo the item status change if saving the purchase failed.
            await Item.findOneAndUpdate(
                {
                   _id: itemId,
                   seller: { $ne: authUserId  },
                   status: "reserved",
                },
                { $set: { status: "available" } },
            )
            throw saveError
        }

        // Save the reservation message in the existing chat.
        const newChatMessage = new Message({
            chat: existingChat._id,
            sender: authUserId,
            receiver: reservedItem.seller,
            text: "Item successfully reserved",
        });
        try {
            await newChatMessage.save();
        }
        catch(error) {
            // Roll back if the reservation message could not be saved.
            await Purchase.findOneAndUpdate(
                {_id : newPurchase._id,status : "reserved"}, 
                {$set : {status :"cancelled"}},
            )

            // Undo the item status change if saving the purchase failed.
            await Item.findOneAndUpdate(
                {
                   _id: itemId,
                   seller: { $ne: authUserId  },
                   status: "reserved",
                },
                { $set: { status: "available" } },
            )
            throw error
        }

        // Realtime delivery and unread notifications are best-effort; they
        // must not undo a reservation/message already saved to the database.
        const io = req.app.get("io");
        if (io) {
            try {
                await newChatMessage.populate([
                    { path: "receiver", select: "name profilePic" },
                    { path: "sender", select: "name profilePic" },
                ]);

                const chatRoomId = existingChat._id.toString();
                const sellerId = reservedItem.seller.toString();
                io.to(chatRoomId).emit("newMessage", newChatMessage);

                const chatSockets = await io.in(chatRoomId).fetchSockets();
                const sellerIsInChat = chatSockets.some(
                    (socket) => socket.userId?.toString() === sellerId
                );

                if (!sellerIsInChat) {
                    // Increment the global unread count only when this chat
                    // transitions from read to unread.
                    const updatedChat = await Chat.findOneAndUpdate(
                        { _id: existingChat._id, sellerHasUnreadMessage: false },
                        { $set: { sellerHasUnreadMessage: true } },
                        { returnDocument: "after" }
                    );

                    if (updatedChat) {
                        const updatedUser = await User.findByIdAndUpdate(
                            sellerId,
                            { $inc: { unreadChatCount: 1 } },
                            { returnDocument: "after" }
                        ).select("unreadChatCount");

                        if (updatedUser) {
                            io.to(sellerId).emit("newGlobalNotification", {
                                unreadChatCount: updatedUser.unreadChatCount,
                            });
                        }

                        io.to(sellerId).emit("newChatNotification", {
                            chat: updatedChat,
                        });
                    }
                }
            }
            catch(notificationError) {
                console.error(`Reservation notification failed: ${notificationError.message}`);
            }
        }

        // Email delivery is separate from reservation success. If it fails,
        // keep the item and purchase reserved so the buyer can retry later.
        let codeEmailSent = true;
        try {
            const [buyer, seller] = await Promise.all([
                User.findById(authUserId).select("email"),
                User.findById(reservedItem.seller).select("name"),
            ]);
            if (!buyer?.email) {
                throw new Error("Could not find the buyer's email address.");
            }

            await sendReservationCodeEmail(
                buyer.email,
                code,
                reservedItem.title,
                reservedItem.pickupLocation,
                reservedItem.price,
                seller?.name || "UniShop seller",
            );
        }
        catch(emailError) {
            codeEmailSent = false;
            console.error(`Reservation code email failed: ${emailError.message}`);
        }

        // The reservation succeeded even if email delivery needs to be retried.
        return res.status(201).json({
            message : codeEmailSent
                ? "Item reserved successfully."
                : "Item reserved successfully, but the verification code email could not be sent. Please try resending the code.",
            itemName : reservedItem.title,
            pickupLocation : reservedItem.pickupLocation
        })

    }

    catch(error) {
        console.log(`Error in reserveItem controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function undoReserve(req,res) {
    const itemId = req.params.id;
    const authUserId = req.AuthUser.userId;

    if (!isValidObjectId(itemId)) {
        return res.status(400).json({ message: "Invalid objectId" });
    }

    let session;
    let cancellationMessage;
    let cancelledSellerId;
    let cancellationChatId;
    try {
        session = await Purchase.startSession();

        await session.withTransaction(async () => {
            // Cancel only this buyer's active reservation.
            const cancelledPurchase = await Purchase.findOneAndUpdate(
                { item: itemId, buyer: authUserId, status: "reserved" },
                { $set: { status: "cancelled" } },
                { returnDocument: "after", session }
            );

            if (!cancelledPurchase) {
                const error = new Error("No active reservation found for this item.");
                error.statusCode = 404;
                throw error;
            }
            cancelledSellerId = cancelledPurchase.seller;

            // Release the listing as part of the same transaction.
            const availableItem = await Item.findOneAndUpdate(
                {
                    _id: itemId,
                    seller: cancelledPurchase.seller,
                    status: "reserved",
                },
                { $set: { status: "available" } },
                { returnDocument: "after", session }
            );

            if (!availableItem) {
                // The item may already be available while its purchase still says
                // reserved. Treat that as an already-completed release.
                const currentItem = await Item.findOne({
                    _id: itemId,
                    seller: cancelledPurchase.seller,
                }).select("status").session(session);

                if (!currentItem || currentItem.status !== "available") {
                    const error = new Error("This reservation can no longer be cancelled because the item is not available.");
                    error.statusCode = 409;
                    throw error;
                }
            }

            const existingChat = await Chat.findOne({
                buyer: authUserId,
                seller: cancelledPurchase.seller,
                item: itemId,
            }).session(session);

            if (!existingChat) {
                throw new Error("Chat for this reservation does not exist.");
            }

            // Save the cancellation message with the purchase and item changes.
            cancellationChatId = existingChat._id;
            cancellationMessage = new Message({
                chat: existingChat._id,
                sender: authUserId,
                receiver: cancelledPurchase.seller,
                text: "Reservation cancelled",
            });
            await cancellationMessage.save({ session });
        });

        // Emit only after the transaction commits so clients aren't told about
        // a cancellation that later rolls back.
        const io = req.app.get("io");
        if (io) {
            try {
                await cancellationMessage.populate([
                    { path: "receiver", select: "name profilePic" },
                    { path: "sender", select: "name profilePic" },
                ]);

                const chatRoomId = cancellationChatId.toString();
                const sellerId = cancelledSellerId.toString();
                io.to(chatRoomId).emit("newMessage", cancellationMessage);

                const chatSockets = await io.in(chatRoomId).fetchSockets();
                const sellerIsInChat = chatSockets.some(
                    (socket) => socket.userId?.toString() === sellerId
                );

                if (!sellerIsInChat) {
                    const updatedChat = await Chat.findOneAndUpdate(
                        { _id: cancellationChatId, sellerHasUnreadMessage: false },
                        { $set: { sellerHasUnreadMessage: true } },
                        { returnDocument: "after" }
                    );

                    if (updatedChat) {
                        const updatedUser = await User.findByIdAndUpdate(
                            sellerId,
                            { $inc: { unreadChatCount: 1 } },
                            { returnDocument: "after" }
                        ).select("unreadChatCount");

                        if (updatedUser) {
                            io.to(sellerId).emit("newGlobalNotification", {
                                unreadChatCount: updatedUser.unreadChatCount,
                            });
                        }

                        io.to(sellerId).emit("newChatNotification", {
                            chat: updatedChat,
                        });
                    }
                }
            }
            catch(notificationError) {
                console.error(`Cancellation notification failed: ${notificationError.message}`);
            }
        }

        return res.status(200).json({
            message: "Reservation cancelled successfully.",
            itemId,
            itemStatus: "available",
            purchaseStatus: "cancelled",
        });
    }
    catch(error) {
        console.log(`Error in undoReserve controller : ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    finally {
        if (session) await session.endSession();
    }
}

async function releaseReservation(req, res) {
    const itemId = req.params.id;
    const sellerId = req.AuthUser.userId;

    if (!isValidObjectId(itemId)) {
        return res.status(400).json({ message: "Invalid objectId" });
    }

    let releasedPurchase;
    let buyerNotified = false;

    try {
        // Claim the active reservation so only one release request can proceed.
        releasedPurchase = await Purchase.findOneAndUpdate(
            { item: itemId, seller: sellerId, status: "reserved" },
            { $set: { status: "cancelled" } },
            { returnDocument: "after" }
        );

        if (!releasedPurchase) {
            return res.status(409).json({
                message: "No active reservation was found for this item.",
            });
        }

        // Reopen only this seller's item while it is still reserved.
        const availableItem = await Item.findOneAndUpdate(
            { _id: itemId, seller: sellerId, status: "reserved" },
            { $set: { status: "available" } },
            { returnDocument: "after" }
        );

        if (!availableItem) {
            // If the item could not be released, restore the purchase state.
            await Purchase.findOneAndUpdate(
                { _id: releasedPurchase._id, status: "cancelled" },
                { $set: { status: "reserved" } }
            );

            return res.status(409).json({
                message: "The item is no longer reserved, so it could not be released.",
            });
        }

        // The release is committed. A chat notification failure should not
        // reverse the seller's successful release.
        try {
            const existingChat = await Chat.findOne({
                buyer: releasedPurchase.buyer,
                seller: sellerId,
                item: itemId,
            });

            if (!existingChat) {
                throw new Error("Chat for this reservation does not exist.");
            }

            // creating and saving the message 
            const releaseMessage = new Message({
                chat: existingChat._id,
                sender: sellerId,
                receiver: releasedPurchase.buyer,
                text: "Seller released the reservation. The item is available again.",
            });
            await releaseMessage.save();
            buyerNotified = true;

            const io = req.app.get("io");
            let buyerIsInChat = false;
            // checks if the buyer is in chat or not 
            if (io) {
                try {
                    const chatRoomId = existingChat._id.toString();
                    const buyerRoomId = releasedPurchase.buyer.toString();
                    const chatSockets = await io.in(chatRoomId).fetchSockets();
                    for (const socket of chatSockets) {
                        if (socket.userId?.toString() === buyerRoomId) {
                            buyerIsInChat = true;
                            break;
                        }
                    }
                } catch (socketError) {
                    console.error(`Could not check buyer chat presence: ${socketError.message}`);
                }
            }

            // Keep unread counts correct even if Socket.IO is temporarily unavailable.
            // if buyer is not in chat , then buyerHasUnreadMessage and unreadChat count updates
            if (!buyerIsInChat) {
                const updatedChat = await Chat.findOneAndUpdate(
                    { _id: existingChat._id, buyerHasUnreadMessage: false },
                    { $set: { buyerHasUnreadMessage: true } },
                    { returnDocument: "after" }
                );

                if (updatedChat) {
                    const buyerRoomId = releasedPurchase.buyer.toString();
                    const updatedUser = await User.findByIdAndUpdate(
                        buyerRoomId,
                        { $inc: { unreadChatCount: 1 } },
                        { returnDocument: "after" }
                    ).select("unreadChatCount");

                    if (io && updatedUser) {
                        io.to(buyerRoomId).emit("newGlobalNotification", {
                            unreadChatCount: updatedUser.unreadChatCount,
                        });
                    }

                    if (io) io.to(buyerRoomId).emit("newChatNotification", { chat: updatedChat });
                }
            }
            
            // If Socket.IO is available, send the saved release message and updated item status
            // to everyone currently connected to this chat room.
            if (io) {
                try {
                    await releaseMessage.populate([
                        { path: "receiver", select: "name profilePic" },
                        { path: "sender", select: "name profilePic" },
                    ]);
                    const chatRoomId = existingChat._id.toString();
                    io.to(chatRoomId).emit("newMessage", releaseMessage);
                    io.to(chatRoomId).emit("reservationReleased", { itemId, itemStatus: "available" });
                } 

                catch (socketError) {
                    console.error(`Release realtime notification failed: ${socketError.message}`);
                }
            }

        } 
        
        catch (notificationError) {
            console.error(`Release chat notification failed: ${notificationError.message}`);
        }

        return res.status(200).json({
            message: buyerNotified
                ? "Reservation released. The item is available again and the buyer was notified in chat."
                : "Reservation released and the item is available again, but the buyer could not be notified in chat.",
            itemId,
            itemStatus: "available",
            purchaseStatus: "cancelled",
            buyerNotified,
        });
    } 

    catch (error) {
        console.error(`Error in releaseReservation controller: ${error.message}`);
        return res.status(error.statusCode || 500).json({
            message: error.statusCode ? error.message : "Internal Server Error",
        });
    }
}

async function markItemSold(req,res) {
    const itemId = req.params.itemId;
    const authUserId = req.AuthUser.userId;
    const {code} = req.body

    if (!isValidObjectId(itemId)) {
        return res.status(400).json({ message: "Invalid objectId" });
    }

    try {
       
        // check the code : 
        if(!code) return res.status(400).json({message : "Invalid code"});

        // Reject codes that aren't strings containing exactly six digits.
        if (typeof code !== "string" || code.length !== 6 || !/^\d+$/.test(code)) {
           return res.status(400).json({ message: "Enter a valid 6-digit code." });
        }
        const purchase = await Purchase.findOne({item: itemId, status : "reserved", seller : authUserId})
        if(!purchase) return res.status(404).json({message : "No active reservation found for this item"})
        
        const isMatched = await bcrypt.compare(code,purchase.verificationCodeHash);
        if(!isMatched) return res.status(400).json({message : "Invalid code"});

        // update the item : 
        const itemSold = await Item.findOneAndUpdate(
            {_id : itemId, seller : authUserId, status : "reserved"},
            {$set : {status : "sold"}},
            {returnDocument : "after"}
        )
        if(!itemSold) return res.status(409).json({message: "This item is not reserved or you do not own it."});

        // update the purchase :
        let purchaseCompleted
        try {
            purchaseCompleted =  await Purchase.findOneAndUpdate(
                {item: itemId, status : "reserved", seller : authUserId},
                {$set : {status : "completed",completedAt: new Date() }},
                {returnDocument : "after"}
            )
        }
        catch(error) {

            // revert back the changes made to the item : 
            await Item.findOneAndUpdate(
                {_id : itemId, seller : authUserId, status : "sold"},
                {$set : {status : "reserved"}},
            )
            throw error
        } 

        // revert back the changes made to the item : 
        if(!purchaseCompleted) {
            await Item.findOneAndUpdate(
                {_id : itemId, seller : authUserId, status : "sold"},
                {$set : {status : "reserved"}},
            )
            return res.status(409).json({
              message: "No active reservation was found for this item.",
            });
        }

        return res.status(200).json({
           message: "Item marked as sold successfully.",
           itemStatus: itemSold.status,
           purchaseStatus: purchaseCompleted.status,
        });

    }
    catch(error) {
        console.log(`Error in markItemSold controller : ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

async function resendReservationCode(req,res) {
    const itemId = req.params.itemId;
    const authUserId = req.AuthUser.userId;

    if (!isValidObjectId(itemId)) {
        return res.status(400).json({ message: "Invalid objectId" });
    }

    try {
        // Only the buyer who owns the active reservation can request a new code.
        const purchase = await Purchase.findOne({
            item: itemId,
            buyer: authUserId,
            status: "reserved",
        });

        if (!purchase) {
            return res.status(404).json({
                message: "No active reservation found for this item.",
            });
        }

        const [item, buyer, seller] = await Promise.all([
            Item.findOne({ _id: itemId, status: "reserved" }).select("title price pickupLocation"),
            User.findById(authUserId).select("email"),
            User.findById(purchase.seller).select("name"),
        ]);

        if (!item) {
            return res.status(409).json({
                message: "This item is no longer reserved.",
            });
        }

        if (!buyer?.email) {
            return res.status(400).json({
                message: "A valid email address is not available for your account.",
            });
        }

        // Store only the hash. A resend creates a new code and invalidates the previous one.
        const code = randomInt(100000, 1_000_000).toString();
        const verificationCodeHash = await bcrypt.hash(code, 10);

        const updatedPurchase = await Purchase.findOneAndUpdate(
            { _id: purchase._id, buyer: authUserId, status: "reserved" },
            { $set: { verificationCodeHash } },
            { returnDocument: "after" }
        );

        if (!updatedPurchase) {
            return res.status(409).json({
                message: "The reservation is no longer active. Refresh and try again.",
            });
        }

        try {
            await sendReservationCodeEmail(
                buyer.email,
                code,
                item.title,
                purchase.pickupLocation || item.pickupLocation,
                item.price,
                seller?.name || "UniShop seller",
            );
        } catch (emailError) {
            console.error(`Reservation code resend failed: ${emailError.message}`);
            // Keep the previous code valid when the replacement email could not be sent.
            try {
                await Purchase.findOneAndUpdate(
                    {
                        _id: purchase._id,
                        buyer: authUserId,
                        status: "reserved",
                        verificationCodeHash,
                    },
                    { $set: { verificationCodeHash: purchase.verificationCodeHash } }
                );
            } catch (rollbackError) {
                console.error(`Reservation code rollback failed: ${rollbackError.message}`);
            }

            return res.status(502).json({
                message: "The code email could not be sent. Please try resending it again.",
            });
        }

        return res.status(200).json({
            message: "A new reservation code has been sent to your email.",
        });
    } catch (error) {
        console.error(`Error in resendReservationCode controller: ${error.message}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {postItem,searchItems,deleteItem,getSingleItem,getMyItems,editItem,reserveItem,undoReserve,releaseReservation,markItemSold,resendReservationCode}
