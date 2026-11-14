import express from "express"
import { deleteItem, searchItems, postItem, getSingleItem, getMyItems, editItem, reserveItem, undoReserve, releaseReservation, markItemSold, resendReservationCode } from "../controllers/itemController.js";
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

// delete api
itemRouter.delete('/delete/:id',protectRoute,isVerified,deleteItem);

// reserve item api : 
itemRouter.post('/reserve/:id',protectRoute,isVerified,reserveItem);

// undo reserve item api 
itemRouter.patch('/undoReserve/:id',protectRoute,isVerified,undoReserve);

// seller releases a reserved item back to the marketplace
itemRouter.patch('/release-reservation/:id',protectRoute,isVerified,releaseReservation);

// markItemSold api
itemRouter.patch("/:itemId/mark-sold", protectRoute, isVerified, markItemSold);

// resend VerificationCode api : 
itemRouter.post( "/resend-reservation-code/:itemId", protectRoute, isVerified, resendReservationCode);


export default itemRouter;
