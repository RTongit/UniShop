"use client";

import { LoaderCircle, Paperclip, Send } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";

// dummy data :
const MessageColor = {
  white: "bg-[#eef0f8]",
  purple: "bg-purple-500",
};

const myMessagesDummy = [
  {
    _id: "66a100000000000000000001",
    chat: "6a7c34ea4a5c687211f2ff20",

    sender: {
      _id: "6a6ece2f3337b86b7fab8dbe",
      name: "Pritam",
      profilePic: "/profilepic1.png",
    },
    receiver: {
      _id: "6a704e635e4aff3d971e3094",
      name: "Jamal Steel",
      profilePic: "/profilepic2.jpg",
    },

    text: "Hey! Is this Asus gaming laptop still available?",
    image: "/emptyChat2.png",
    seen: true,

    createdAt: "2026-08-14T09:15:00.000Z",
    updatedAt: "2026-08-14T09:15:00.000Z",
  },

  {
    _id: "66a100000000000000000002",
    chat: "6a7c34ea4a5c687211f2ff20",

    sender: {
      _id: "6a704e635e4aff3d971e3094",
      name: "Jamal Steel",
      profilePic: "/profilepic2.jpg",
    },
    receiver: {
      _id: "6a6ece2f3337b86b7fab8dbe",
      name: "Pritam",
      profilePic: "/profilepic1.png",
    },

    text: "Yes, it is still available.",
    image: "",
    seen: true,

    createdAt: "2026-08-14T09:16:00.000Z",
    updatedAt: "2026-08-14T09:16:00.000Z",
  },

  {
    _id: "66a100000000000000000003",
    chat: "6a7c34ea4a5c687211f2ff20",

    sender: {
      _id: "6a6ece2f3337b86b7fab8dbe",
      name: "Pritam",
      profilePic: "/profilepic1.png",
    },
    receiver: {
      _id: "6a704e635e4aff3d971e3094",
      name: "Jamal Steel",
      profilePic: "/profilepic2.jpg",
    },

    text: "What is the lowest price you can offer?",
    image: "",
    seen: true,

    createdAt: "2026-08-14T09:18:00.000Z",
    updatedAt: "2026-08-14T09:18:00.000Z",
  },

  {
    _id: "66a100000000000000000004",
    chat: "6a7c34ea4a5c687211f2ff20",

    sender: {
      _id: "6a704e635e4aff3d971e3094",
      name: "Jamal Steel",
      profilePic: "/profilepic2.jpg",
    },
    receiver: {
      _id: "6a6ece2f3337b86b7fab8dbe",
      name: "Pritam",
      profilePic: "/profilepic1.png",
    },

    text: "I can do ₹42,000.So interested or not tell me as it will be limited and lot are asking",
    image: "",
    seen: false,

    createdAt: "2026-08-14T09:20:00.000Z",
    updatedAt: "2026-08-14T09:20:00.000Z",
  },

  {
    _id: "66a100000000000000000005",
    chat: "6a7c34ea4a5c687211f2ff20",

    sender: {
      _id: "6a6ece2f3337b86b7fab8dbe",
      name: "Pritam",
      profilePic: "/profilepic1.png",
    },
    receiver: {
      _id: "6a704e635e4aff3d971e3094",
      name: "Jamal Steel",
      profilePic: "/profilepic2.jpg",
    },

    text: "Okay, that works for me. Where can we meet?",
    image: "",
    seen: false,

    createdAt: "2026-08-14T09:22:00.000Z",
    updatedAt: "2026-08-14T09:22:00.000Z",
  },
];

const MessageContainer = ({ chatId }) => {
  const {
    selectedChat,
    setSelectedChat,
    postChatMessage,
    isPostingChatMessage,
    myMessages,
    subscribeToMessage,
    unsubscribeFromMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const isInitialLoad = useRef(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Auto scroll new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: (isInitialLoad.current===false) ? "smooth" : "auto",
        block: "end",
      });
    }
    isInitialLoad.current=false
  }, [myMessages]);

  useEffect(() => {
    subscribeToMessage();
    return () => {
      unsubscribeFromMessage();
    };
  }, [subscribeToMessage, unsubscribeFromMessage]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!chatId || chatId.trim() == "") {
      toast.error("ChatId does not exist");
      return;
    }
    // Verifying text and image:
    if (text.trim() == "" && image.trim() == "") {
      toast.error("Cannot send empty message! Atleast send text or image");
      return;
    }

    postChatMessage({
      chatId,
      text,
      image,
    });
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    // Async so others task will runs as well
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      setImage(reader.result);
    });
  }

  function removePhoto() {}

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header containing userToChat name and its profilePic */}
      <div className="flex h-15 items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
        {/* Profile */}
        <div className="flex items-center gap-3 ">
          <div className="relative">
            <img
              src={`${
                authUser.userId === selectedChat.buyer._id.toString()
                  ? selectedChat.seller.profilePic || "/defaultProfilePic.jpg"
                  : selectedChat.buyer.profilePic || "/defaultProfilePic.jpg"
              }`}
              alt="photo"
              className="md:size-12 size-11 rounded-full object-cover"
            />
            <span className="size-3 rounded-full bg-green-600 bottom-2 right-0.5 absolute" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {authUser.userId == selectedChat.buyer._id.toString()
                ? selectedChat.seller.name
                : selectedChat.buyer.name}
            </h2>
          </div>
        </div>

        {/* Actions todo need to implement three dots feature later */}
      </div>

      {/*Message logs section*/}

      <div className="overflow-y-scroll h-full" >
          {myMessages.map((message,i)=>(
          <div key={i} className="flex flex-col gap-y-1 p-2">
            {message.sender._id.toString()==authUser.userId ? 
              (
                <div className="flex justify-end" >
                  <Message text={message.text} 
                  user={message.sender} image = {message.image} 
                  color = {MessageColor.white}
                  pos = "justify-end"
                  createdAt={message.createdAt}
                  />
                </div>
              ) 
              :
              (
                <div className="flex justify-start">
                  <Message text={message.text} 
                  user={message.sender} image = {message.image}
                  color = {MessageColor.purple}
                  pos = "justify-start"
                  createdAt={message.createdAt}
                  />
                </div>
              )
            }
          </div>
        )
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Send Text and files section */}
      <form
        className="bg-stone-200 h-20 my-5 mx-5 rounded-md flex box-border"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label className="flex items-center px-4 hover:cursor-pointer">
          <Paperclip />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handlePhotoUpload(e)}
          />
        </label>
        <input
          type="text"
          className="w-[85%] h-full mx-auto focus:outline-none"
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
          placeholder="Type a message"
        ></input>

        {isPostingChatMessage ? (
          <button
            className="flex items-center justify-center size-10 m-auto text-gray-400"
            disabled
          >
            <LoaderCircle className="size-5 animate-spin" />
          </button>
        ) : (
          <button
            className="flex items-center justify-center hover:cursor-pointer size-10 m-auto text-gray-900 disabled:text-gray-400"
            type="submit"
            disabled={text.trim() == "" && image.trim() == "" ? true : false}
          >
            <Send className="" />
          </button>
        )}
      </form>
    </div>
  );
};

export default MessageContainer;
