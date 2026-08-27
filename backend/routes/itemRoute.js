import express from "express"
import { deleteItem, searchItems, postItem, getSingleItem, getMyItems, editItem } from "../controllers/itemController.js";
import protectRoute from "../middleware/protectRoute.js";

const itemRouter = express.Router();

itemRouter.post('/post',protectRoute,postItem);
//query parameters are NOT written in route path
itemRouter.get('/search',protectRoute,searchItems);
itemRouter.get('/item/:id',getSingleItem);

// listing api 
itemRouter.get('/myItems',protectRoute,getMyItems)

// edit api 
itemRouter.patch('/item/:id/edit',protectRoute,editItem);

itemRouter.delete('/delete/:id',protectRoute,deleteItem);

export default itemRouter;