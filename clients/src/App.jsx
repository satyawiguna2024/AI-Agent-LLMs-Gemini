import { Routes, Route, Navigate } from "react-router";
import SidebarLayout from "./layouts/SidebarLayout";
import Prompt from "./pages/prompt/Prompt";
import { ChatProvider } from "./context/ChatContext";

export default function App() {
  return (
    <>
      <ChatProvider>
        <Routes>
          <Route element={<SidebarLayout />}>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Prompt />} />
          </Route>
        </Routes>
      </ChatProvider>
    </>
  );
}