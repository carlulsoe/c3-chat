
import NotFound from "@/frontend/not-found";
import Home from "@/frontend/page";
import Settings from "@/frontend/settings/page";
import { BrowserRouter, Route, Routes } from "react-router";
import Chat from "@/frontend/chat";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}