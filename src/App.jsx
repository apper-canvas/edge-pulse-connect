import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navigation from "@/components/organisms/Navigation";
import Profile from "@/components/pages/Profile";
import PostDetail from "@/components/pages/PostDetail";
import CreatePost from "@/components/pages/CreatePost";
import Explore from "@/components/pages/Explore";
import Notifications from "@/components/pages/Notifications";
import Home from "@/components/pages/Home";

function App() {
  return (
    <Router>
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
            <Route path="/messages" element={<div className="max-w-4xl mx-auto px-4 py-6"><div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 text-center"><h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2><p className="text-gray-600 mb-4">Your message inbox will appear here.</p><p className="text-sm text-gray-500">You'll be able to see all your conversations and start new chats.</p></div></div>} />
            <Route path="/chat/:userId" element={<div className="max-w-4xl mx-auto px-4 py-6"><div className="bg-white rounded-xl border border-gray-200 shadow-card p-6 text-center"><h2 className="text-xl font-bold text-gray-900 mb-4">Chat Interface</h2><p className="text-gray-600 mb-4">Direct messaging feature is being implemented.</p><p className="text-sm text-gray-500">You'll be able to send messages, see typing indicators, and view message history here.</p></div></div>} />
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
    </Router>
  );
}

export default App;