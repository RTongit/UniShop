import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
    {
        buyer : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        seller : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        item : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Item",
            required : true
        }
    },

    {
        timestamps : true
    }
);

const Chat = mongoose.model("Chat",ChatSchema);
export default Chat;