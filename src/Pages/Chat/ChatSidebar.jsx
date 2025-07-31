import React, { useState } from "react";
import moment from "moment";
import { useGetAllConversations } from "../../Hooks/chat.queries";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const ChatSidebar = ({ setChatId }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: allConversation, isLoading } = useGetAllConversations();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <section className="w-80 border-r border-gray-200 bg-white">
      {isLoading ? (
        [1, 2, 3, 4].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg animate-pulse bg-gray-100"
          >
            <div className="size-12 rounded-full bg-gray-300" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))
      ) : (
        <>
          <div className="mx-3 mb-4 space-y-2">
            <div className="my-5 flex justify-between items-center">
              <p className="text-xl text-gray-700 font-medium">Message</p>

              {/* Back btn */}
              <button
                onClick={handleBack}
                className="flex group gap-[2px] justify-self-end items-center justify-end text-sm cursor-pointer font-medium border rounded-full px-2.5 py-1 text-blue-500 bg-gray-100"
              >
                <IoArrowBackOutline className="group-hover:-translate-x-[3px] duration-300 transition-transform" />
                <span>Go back</span>
              </button>
            </div>

            {/* Search bar */}
            <p className="flex gap-1.5 items-center bg-gray-100 px-2 py-2 rounded">
              <CiSearch className="text-xl" />
              <input
                type="text"
                placeholder="Search here..."
                onChange={e => setSearch(e.target.value)}
                className="border-none outline-none w-full"
              />
            </p>
          </div>

          {/* Chat List */}
          {allConversation?.conversations?.data?.map(item =>
            item?.participants?.map((data, idx) => (
              <div
                key={idx}
                onClick={() => setChatId(data?.participant_id)}
                className={`flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer transition`}
              >
                {/* Left - Avatar */}
                {data?.participant?.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_SITE_URL}/${
                      data?.participant?.avatar
                    }`}
                    alt="avatar"
                    className="size-12 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <p className="size-12 text-lg rounded-full bg-gray-400 grid place-items-center font-medium shrink-0">
                    {data?.participant?.name.at(0)}
                  </p>
                )}

                {/* Center */}
                <div className="grow">
                  {/* Participant Name */}
                  <p className="font-medium truncate">
                    {data?.participant?.name}
                  </p>

                  {/* Last Message */}
                  <p className={`text-sm truncate max-w-[130px] text-gray-500`}>
                    {item?.last_message?.message}
                  </p>
                </div>

                {/* Right Side */}
                <div className="shrink-0">
                  {item?.unread_messages_count > 0 ? (
                    // Unreal Message Count
                    <p className="text-xs font-medium grid place-items-center size-5 rounded-full bg-red-400 text-white">
                      {item?.unread_messages_count}
                    </p>
                  ) : (
                    // Time
                    <p className="text-xs text-gray-400">
                      {moment(item?.last_message?.created_at).fromNow()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </section>
  );
};

export default ChatSidebar;
