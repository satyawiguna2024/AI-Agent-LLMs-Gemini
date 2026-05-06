import { usePromptHook } from "../../hooks/usePromptHook";
import ReactMarkdown from "react-markdown";
import { MdPausePresentation } from "react-icons/md";

export default function Prompt() {
  const { messages, isPending, bottomRef, input, setInput, handleSubmit } = usePromptHook();
  const isDisable = input === "" || isPending;


  return (
    <div className="flex flex-col h-screen">
      {/* ---CHAT AREA--- */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 space-y-6">
        {messages.map((msg, index) => {
          if (msg.role === "user") {
            return (
              <div key={index} className="flex justify-end">
                <div className="bg-gray-800 text-white font-poppins leading-relaxed px-4 py-2 rounded-2xl max-w-[80%] sm:max-w-lg">
                  {msg.content}
                </div>
              </div>
            )
          }

          // AI message
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                AI
              </div>
              <div className="bg-white px-4 py-2 font-poppins leading-relaxed rounded-2xl max-w-[80%] sm:max-w-lg">
                <ReactMarkdown>
                  {String(msg.content || "")}
                </ReactMarkdown>
              </div>
            </div>
          )
        })}

        {/* ---Loading--- */}
        {isPending && (
          <div className="flex items-start gap-3">
            <div className="size-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
              AI
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl animate-bounce">
              typing...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>


      {/* ---INPUT AREA (STICKY BAWAH)--- */}
      <div className="sticky bottom-0 mb-4.5 border-t p-3 bg-gray-100">
        <div className="w-full max-w-3xl mx-auto flex items-end gap-2 bg-white px-3 py-2 rounded-2xl shadow-sm border">

          {/* LEFT: Model Info */}
          <div className="font-ghal text-xs text-gray-500 whitespace-nowrap px-2 pb-1">
            Gemini-2.5-flash-lite
          </div>

          {/* TEXTAREA */}
          <textarea
            rows={1}
            value={input}
            disabled={isPending}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything"
            required
            className="flex-1 resize-none bg-transparent outline-none text-md font-poppins max-h-32 overflow-y-auto"
            onInput={(e) => {
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* RIGHT: BUTTON */}
          <button
            disabled={isDisable}
            className={`px-4 py-1.5 rounded-full text-sm font-ghal tracking-wider transition ${isDisable ? "text-gray-500 cursor-not-allowed bg-gray-100" : "text-white cursor-pointer bg-gray-800 hover:bg-gray-700"}`}
          >
            {isPending ? <MdPausePresentation size={23} className="animate-pulse" /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}