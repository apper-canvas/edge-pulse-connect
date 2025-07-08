import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "@/components/organisms/Navigation";
import Profile from "@/components/pages/Profile";
import PostDetail from "@/components/pages/PostDetail";
import CreatePost from "@/components/pages/CreatePost";
import Explore from "@/components/pages/Explore";
import Notifications from "@/components/pages/Notifications";
import Home from "@/components/pages/Home";
import Settings from "@/components/pages/Settings";
import Messages from "@/components/pages/Messages";
import Chat from "@/components/pages/Chat";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mobile-padding">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/post/:id" element={<PostDetail />} />
<Route path="/create" element={<CreatePost />} />
<Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/chat/:userId" element={<Chat />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
/>
      </div>
    </BrowserRouter>
  );
}
export default App;