import express from "express"
import { deleteItem, searchItems, postItem, getSingleItem, getMyItems, editItem } from "../controllers/itemController.js";
import protectRoute from "../middleware/protectRoute.js";
import isVerified from "../middleware/isVerified.js";

const itemRouter = express.Router();

itemRouter.post('/post',protectRoute,isVerified,postItem);
//query parameters are NOT written in route path
itemRouter.get('/search',protectRoute,searchItems);
itemRouter.get('/item/:id',getSingleItem);

// listing api 
itemRouter.get('/myItems',protectRoute,isVerified,getMyItems)

// edit api 
itemRouter.patch('/item/:id/edit',protectRoute,isVerified,editItem);
itemRouter.delete('/delete/:id',protectRoute,isVerified,deleteItem);

export default itemRouter;