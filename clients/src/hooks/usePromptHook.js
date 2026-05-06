import { useRef, useState, useEffect, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { generatePrompt } from "../services/llm";
import { ChatContext } from "../context/ChatContext";

export function usePromptHook() {
  const { chats, setChats, activeChatId, createNewChat } = useContext(ChatContext);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const activeChat = chats.find(c => c.thread_id === activeChatId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages = activeChat?.messages ?? [];

  const { mutate, isPending } = useMutation({
    mutationFn: generatePrompt
  });

  const handleSubmit = () => {
    if (!input.trim()) return;

    let currentChatId = activeChatId;

    // 🔥 auto create chat
    if (!currentChatId) {
      currentChatId = createNewChat(input.slice(0, 30));
    }

    const userMessage = {
      role: "user",
      content: input
    };

    // push user
    setChats(prev =>
      prev.map(chat =>
        chat.thread_id === currentChatId
          ? {
            ...chat,
            // 🔥 update title kalau masih default
            title:
              chat.messages.length === 0
                ? input.slice(0, 30)
                : chat.title,
            messages: [...(chat.messages || []), userMessage]
          }
          : chat
      )
    );

    setInput("");

    mutate(
      {
        prompt: input,
        thread_id: currentChatId
      },
      {
        onSuccess: (data) => {
          const aiMessage = {
            role: "assistant",
            content: data.data
          };

          setChats(prev =>
            prev.map(chat =>
              chat.thread_id === currentChatId
                ? {
                  ...chat,
                  messages: [...(chat.messages || []), aiMessage]
                }
                : chat
            )
          );
        }
      }
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return { messages, isPending, bottomRef, input, setInput, handleSubmit };
}