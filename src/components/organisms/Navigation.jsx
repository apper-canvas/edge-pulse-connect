import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Navigation = () => {
const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  
  // Get current user from Redux
  const userState = useSelector((state) => state.user);
  const currentUser = userState?.user;
const menuItems = [
    { icon: 'Compass', label: 'Explore', path: '/explore' },
    { icon: 'MessageCircle', label: 'Messages', path: '/messages' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications' },
    { icon: 'Settings', label: 'Settings', path: '/settings' },
    { icon: 'User', label: 'Profile', path: '/profile/1' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = menuItems;
  
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const handleUserSelect = (user) => {
    navigate(`/profile/${user.id}`);
  };
  
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">Pulse Connect</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {menuItems.slice(0, 2).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar 
            onSearch={handleSearch}
            onUserSelect={handleUserSelect}
          />
          
          <div className="flex items-center gap-2">
            {menuItems.slice(2).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  isActive(item.path) 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          
          {currentUser && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/profile/1')}
                className="flex items-center gap-2"
              >
                <Avatar 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  size="sm"
                  fallback={currentUser.name?.[0]}
                />
                <span className="font-medium text-sm hidden md:inline">
                  {currentUser.name}
                </span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="LogOut" size={16} />
                <span className="text-sm hidden md:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile Navigation */}
      <nav className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Pulse Connect</span>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-40"
            >
              <div className="p-4 space-y-4">
                <SearchBar 
                  onSearch={handleSearch}
                  onUserSelect={handleUserSelect}
                />
<div className="grid grid-cols-2 gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200',
                        isActive(item.path) 
                          ? 'bg-primary text-white shadow-lg' 
                          : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                      )}
                    >
                      <ApperIcon name={item.icon} size={24} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50">
<div className="flex items-center justify-around px-4 py-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200',
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-gray-600 hover:text-primary'
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Floating Create Button */}
      <Link to="/create" className="floating-btn">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full w-14 h-14 shadow-xl hover:shadow-2xl"
        >
          <ApperIcon name="Plus" size={24} />
        </Button>
      </Link>
    </>
  );
};

export default Navigation;