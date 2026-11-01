"use client";

import { Cross, LoaderCircle, Paperclip, Send, X } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

// dummy data :
const MessageColor = {
  gray: "bg-stone-200",
  blue: "bg-[#1F79FF]",
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
  const { authUser, socket } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const router = useRouter()

  const isInitialLoad = useRef(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const otherUserId = selectedChat
    ? (authUser.userId === selectedChat.buyer._id.toString() ? selectedChat.seller._id : selectedChat.buyer._id).toString()
    : null;

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

  useEffect(() => {
    if (!socket) return;
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const requestOnlineUsers = () => socket.emit("getOnlineUsers");
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("connect", requestOnlineUsers);
    if (socket.connected) requestOnlineUsers();
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("connect", requestOnlineUsers);
    };
  }, [socket]);

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
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
      setImage(reader.result);
      setImageFile(file);
      e.target.value = "";
    });
  }

  function removePhoto() {
    setImage("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      
      {/* Header containing userToChat name and its profilePic and cross*/}
      <div className="flex h-15 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2 sm:px-6">
        
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
            {otherUserId && onlineUsers.includes(otherUserId) && (
              <span title="Online" className="absolute bottom-2 right-0.5 size-3 rounded-full bg-green-600" />
            )}
          </div>

          <div className="flex flex-col gap-y-1">
            <h2 className="text-base font-semibold text-gray-900">
              {authUser.userId == selectedChat.buyer._id.toString()
                ? selectedChat.seller.name
                : selectedChat.buyer.name}
            </h2>
            <span>
              {authUser.userId == selectedChat.buyer._id.toString()
                ? "Seller"
                : "Buyer"
              }
            </span>
          </div>
        </div>

        {/* Cross or return button */}
        <button 
          onClick={()=>{
            if(setSelectedChat) setSelectedChat(null)
            router.replace("/chat")
          }}
        >
          <X/>
        </button>

        {/* Actions todo need to implement three dots feature later */}

      </div>

      {/*Messages logs section*/}
      <div className="min-h-0 flex-1 overflow-y-auto">
          {myMessages.map((message,i)=>(
          <div key={i} className="flex flex-col gap-y-1 p-2">
            {message.sender._id.toString()==authUser.userId ? 
              (
                <div className="flex justify-end" >
                  <Message 
                  text={message.text} 
                  textColor = "text-gray-800"
                  user={message.sender} image = {message.image} 
                  color = {MessageColor.gray}
                  pos = "justify-end"
                  createdAt={message.createdAt}
                  />
                </div>
              ) 
              :
              (
                <div className="flex justify-start">
                  <Message 
                  text={message.text} 
                  textColor = "text-white"
                  user={message.sender} image = {message.image}
                  color = {MessageColor.blue}
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

      {image && (
        <div className="mx-3 mt-2 flex w-full max-w-[360px] shrink-0 self-start items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 sm:mx-5 sm:gap-4 sm:p-3">
          <img src={image} alt="Selected image preview" className="size-14 shrink-0 rounded-lg object-cover sm:size-16" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{imageFile?.name || "Selected image"}</p>
            {imageFile && <p className="mt-1 text-xs text-slate-500">{imageFile.size >= 1024 * 1024 ? `${(imageFile.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(imageFile.size / 1024))} KB`} <span className="px-1">·</span> {imageFile.type.split("/")[1]?.toUpperCase()} image</p>}
            <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 text-xs font-medium text-slate-700 underline underline-offset-2 hover:text-black">
              Choose another image
            </button>
          </div>
          <button type="button" onClick={removePhoto} aria-label="Remove selected image" className="grid size-8 shrink-0 place-items-center self-start rounded-full text-slate-500 hover:bg-slate-100 hover:text-black">
            <X size={17} />
          </button>
        </div>
      )}

      {/* Send Text and files section */}
      <form
        className="mx-2 my-2 flex h-14 shrink-0 box-border rounded-md bg-stone-200 sm:mx-5 sm:my-5 sm:h-20"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label className="flex items-center px-4 hover:cursor-pointer">
          <Paperclip className="size-5 md:size-6"/>
          <input
            ref={fileInputRef}
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
            className="flex items-center px-4 text-gray-400"
            disabled
          >
            <LoaderCircle className="size-5  md:size-6 animate-spin" />
          </button>
        ) : (
          <button
            className="flex px-4 items-center hover:cursor-pointer text-gray-900 disabled:text-gray-400"
            type="submit"
            disabled={text.trim() == "" && image.trim() == "" ? true : false}
          >
            <Send className="size-5 md:size-6"/>
          </button>
        )}
      </form>

    </div>
  );
};

export default MessageContainer;
