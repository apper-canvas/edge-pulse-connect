import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import { userService } from '@/services/api/userService';
import { cn } from '@/utils/cn';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = async (query) => {
    try {
      const results = await userService.searchUsers(query);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  };

  const handleUserSelect = (user) => {
    // Navigate to user profile
    window.location.href = `/profile/${user.Id}`;
  };

const navItems = [
    { icon: 'Home', label: 'Home', path: '/' },
    { icon: 'Compass', label: 'Explore', path: '/explore' },
    { icon: 'MessageCircle', label: 'Messages', path: '/messages' },
    { icon: 'Bell', label: 'Notifications', path: '/notifications' },
    { icon: 'User', label: 'Profile', path: '/profile/1' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Pulse Connect</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {navItems.slice(0, 2).map((item) => (
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
            {navItems.slice(2).map((item) => (
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
                  {navItems.map((item) => (
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
            {navItems.map((item) => (
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