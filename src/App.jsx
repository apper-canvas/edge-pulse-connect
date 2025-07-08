import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navigation from '@/components/organisms/Navigation';
import Home from '@/components/pages/Home';
import Explore from '@/components/pages/Explore';
import Profile from '@/components/pages/Profile';
import PostDetail from '@/components/pages/PostDetail';
import CreatePost from '@/components/pages/CreatePost';
import Notifications from '@/components/pages/Notifications';

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