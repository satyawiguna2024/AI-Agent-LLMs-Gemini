import { useContext, useState } from "react";
import { Outlet } from "react-router";
import { ChatContext } from "../context/ChatContext";
import { RxHamburgerMenu } from "react-icons/rx";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdOutlineFolderDelete } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";

export default function SidebarLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { chats, setActiveChatId, createNewChat, activeChatId, clearAllChats } = useContext(ChatContext);

  return (
    <>
      <div className="flex h-screen">
        <aside className={`fixed lg:static top-0 left-0 z-40 w-64 h-full bg-white border-r transform transition-transform duration-300 ${openSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
          <div className="flex flex-col h-full">
            {/* ---TOP MENU--- */}
            <div className="mt-20 lg:mt-10 space-y-5 px-2 border-b pb-3">
              <button onClick={() => createNewChat()} className="w-full flex gap-x-2 font-ghal text-gray-800 px-2 py-1 hover:bg-gray-100 rounded-full">
                <AiOutlineFileAdd size={23} />
                New chat
              </button>

              <button onClick={clearAllChats} className="w-full flex gap-x-2 font-ghal text-gray-800 px-2 py-1 hover:bg-gray-100 rounded-full">
                <MdOutlineFolderDelete size={23} />
                Clear all chat
              </button>
            </div>

            {/* ---SCROLL AREA--- */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-3">
              {chats.map(c => (
              <div
                key={c.thread_id}
                onClick={() => setActiveChatId(c.thread_id)}
                className={`cursor-pointer px-3 py-1 rounded-full text-gray-800 font-poppins line-clamp-1 ${
                  activeChatId === c.thread_id ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                {c.title}
              </div>
            ))}
            </div>

            {/* ---BOTTOM PROFILE--- */}
            <div className="flex items-center gap-x-2 px-4 py-4 border-t">
              <button className="size-8 bg-gray-200 rounded-full">DM</button>
              <div>
                <p className="font-ghal text-gray-800">Demo Account</p>
                <p className="text-sm text-green-400">Free</p>
              </div>
            </div>
          </div>
        </aside>

        {/* OVERLAY (mobile only) */}
        {openSidebar && (
          <div onClick={() => setOpenSidebar(false)}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden" />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">
          {/* NAVBAR */}
          <nav className="fixed lg:static top-0 z-50 w-full bg-white border">
            <div className="p-3 flex items-center gap-2">
              <button
                onClick={() => setOpenSidebar(!openSidebar)}
                className="lg:hidden p-2"
              >
                {openSidebar ? <IoCloseOutline size={20} /> : <RxHamburgerMenu size={20} />}
              </button>
              <h1 className="text-lg font-semibold font-ghal">
                AI-Magang
              </h1>
            </div>
          </nav>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto p-4 mt-14 lg:mt-0">
            <div className="max-w-4xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
