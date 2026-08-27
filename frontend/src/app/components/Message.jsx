"use client";

import formatDate from "../constant/formatDate";
import { useAuthStore } from "../store/authStore";

export default function Message({ text, user, image, color, pos, createdAt }) {
  const { authUser } = useAuthStore();
  return (
    <div className={`flex items-end gap-x-4 ${pos}`}>
      {/* Profile */}
      <div>
        {!user.profilePic || user.profilePic.trim() === "" ? (
          <img
            src="/defaultProfilePic.jpg"
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <img
            src={user.profilePic}
            alt={user.name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        )}
      </div>

      {/* Right Section */}
      <div className="flex max-w-[70%] min-w-0 flex-col">
        <p className="mb-1 text-xs font-semibold text-gray-600">
          {user.name === authUser.name ? "You" : user.name}
        </p>

        {/* Text */}
        <div
          className={`w-fit max-w-full rounded-2xl rounded-bl-md ${color} px-4 py-3`}
        >
          <p className="break-words whitespace-pre-wrap text-sm leading-5 text-gray-800">
            {text}
          </p>
        </div>

        {/* Image */}
        {image && (
          <img
            src={image}
            alt="Shared image"
            className="mb-2 mt-1 max-h-35 max-w-full rounded-2xl object-cover"
          />
        )}

        {/* Time */}
        <div className="mt-1 text-[11px] text-gray-400">
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}
