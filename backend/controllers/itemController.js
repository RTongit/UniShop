import cloudinary from "../lib/cloudinary.js";
import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";
import { isValidObjectId } from "mongoose";

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
        
        // console.log(title)
        // will get items from database :
        const items = await Item.find(
        {$and : 
            [
               { 
                 seller : {$ne : authUserId}
               },
               {$or : 
                  [
                  {title:{$regex : title , $options : "i"}},
                  {category:{$regex : title , $options : "i"}}
                  ]
                },
                {isDeleted : false}
            ]
        }  
        );
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
        isSold : item.isSold,
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
    const {title : newTitle, category : newCategory, brand : newBrand, description : newDescription, price : newPrice, pickupLocation : newPickuplocation, photos : newPhotos,isSold : newIsSold} = req.body

    const itemId = req.params.id
    try {

        // we check if id is in valid format : 
        if(!isValidObjectId(itemId)) return res.status(400).json({message : "Invalid objectId"})

        // if the item does not exist :
        const item = await Item.findOne({_id:itemId});
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
        
        // Need to check thoroughly
        if (newIsSold!=item.isSold) updatedData.isSold = newIsSold;

        // If nothing is provided :
        if(Object.keys(updatedData).length==0) return res.status(400).json({message : "Cannot update empty fields"});

        const updatedItem = await Item.findByIdAndUpdate({_id:itemId},{$set : updatedData},
            {returnDocument : "after"})
        return res.status(200).json(updatedItem);
    }

    catch(error) {
        console.log(`Error in editItem Controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

async function deleteItem(req,res) {
    const itemId = req.params.id;
    try{
        // we check if id is in valid format : 
        if(!isValidObjectId(itemId)) return res.status(400).json({message : "Invalid objectId"});

        // Check if item exist or not: 
        const item = await Item.findByIdAndUpdate({_id : itemId},{$set : {isDeleted : true}},{returnDocument : "after"});
        if(!item) return res.status(404).json({message : "Cannot delete! Item does not exist"});

        return res.status(200).json({message : "Item successfully deleted"});
    }
    catch(error) {
        console.log(`Error in deleteItem controller : ${error.message}`);
        return res.status(500).json({message : "Internal Server Error"});
    }
}

export {postItem,searchItems,deleteItem,getSingleItem,getMyItems,editItem}