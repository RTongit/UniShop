"use client";

import { Cross, Image as ImageIcon, LoaderCircle, Paperclip, Send, X } from "lucide-react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { useItemStore } from "../store/itemStore";

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
  const {reserveItem,isReserving} = useItemStore()

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
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-1 sm:h-15 sm:px-6 sm:py-2">
        
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
              className="size-10 rounded-full object-cover sm:size-11 md:size-12"
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

      {/* UI-only reservation bar; wire its controls to the Purchase flow later. */}
      <div className="flex h-[60px] min-h-[60px] shrink-0 flex-nowrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-2 py-2 sm:h-auto sm:min-h-[68px] sm:gap-3 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 text-slate-400 sm:size-12">
            {selectedChat.item?.photos?.[0] ? (
              <img
                src={selectedChat.item.photos[0]}
                alt=""
                className="size-full rounded-lg object-cover"
              />
            ) : (
              <ImageIcon size={21} />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-900 sm:text-base">
              {selectedChat.item?.title || "Listing"}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[11px] text-slate-500 sm:gap-1.5 sm:text-sm">
              {selectedChat.item?.price != null && (
                <span>₹{Number(selectedChat.item.price).toLocaleString("en-IN")}</span>
              )}
              {selectedChat.item?.price != null && selectedChat.item?.status==="reserved" ? 
                (<span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">Reserved</span>)
                :
                (selectedChat.item?.price != null && selectedChat.item?.status==="sold" ? 
                  (<span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">Sold</span>) 
                  :
                  null
                )
              }
              
            </div>
          </div>
        </div>

        {authUser.userId === selectedChat.buyer._id.toString() && 
        (
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Only an available item be reserved*/}
            {(selectedChat.item?.status === "available") ? 
              (<button type="button" 
                className="whitespace-nowrap rounded-md bg-black px-2 py-1.5 text-[10px] font-semibold text-white disabled:bg-gray-400 disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm"
                disabled = {isReserving}
                onClick={async ()=>{
                const result = await reserveItem(selectedChat.item._id);
                if(result==false) return;

                // below code will only run if it is reserved in backend
                if(result==true) {
                  setSelectedChat(
                    {...selectedChat,
                      item : {...selectedChat.item,status : "reserved"}
                    })
                }
              }}
              >
                {isReserving ? "Reserving..." : "Reserve"}
              </button>)
              : 
              (selectedChat.item?.status === "reserved") ? (<button type="button" className="whitespace-nowrap rounded-md bg-black px-2 py-1.5 text-[10px] font-semibold text-white sm:px-4 sm:py-2 sm:text-sm">Undo</button>) : null
            }
            
            {(selectedChat.item?.status === "reserved") ? 
             (<button type="button" className="whitespace-nowrap rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-800 sm:px-4 sm:py-2 sm:text-sm">Resend code</button>) 
             :
             null
            }

          </div>
        )}
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
        className="mx-2 mb-2 mt-auto flex h-14 shrink-0 box-border rounded-md bg-stone-200 sm:mx-5 sm:my-3 sm:h-16"
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
