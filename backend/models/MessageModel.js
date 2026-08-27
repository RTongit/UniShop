import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text : {
        type : String,
        required : true,
        trim : true
    },
    image : {
      type : String,
      default : "",
    },
    seen : {
        type : Boolean,
        default : false
    }
  },

  {
    timestamps: true,
  },
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;
