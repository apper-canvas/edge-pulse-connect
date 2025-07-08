import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import { cn } from '@/utils/cn';

const SearchBar = ({ onSearch, onUserSelect, placeholder = "Search users and posts..." }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim() && onSearch) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        onSearch(query.trim()).then(results => {
          setResults(results || []);
          setIsLoading(false);
        });
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, onSearch]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsExpanded(true);
  };

  const handleUserSelect = (user) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setQuery('');
    setIsExpanded(false);
  };

  const handleBlur = () => {
    // Delay closing to allow for clicks on results
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsExpanded(true)}
          onBlur={handleBlur}
          className="pl-10 bg-surface border-gray-200 focus:bg-white"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name="Loader2" size={16} className="animate-spin text-gray-400" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (query.trim() || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <ApperIcon name="Loader2" size={20} className="animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((user) => (
                  <button
                    key={user.Id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.displayName}
                      size="sm"
                      fallback={user.displayName?.[0]}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {user.followersCount} followers
                    </div>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center text-gray-500">
                <ApperIcon name="Search" size={20} className="mx-auto mb-2" />
                No results found
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;