import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import PostCard from "@/components/molecules/PostCard";
import commentsData from "@/services/mockData/comments.json";
import postsData from "@/services/mockData/posts.json";
import usersData from "@/services/mockData/users.json";
import followsData from "@/services/mockData/follows.json";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";

const PostList = ({ userId, variant = 'feed', className }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      switch (variant) {
        case 'feed':
          data = await postService.getFeed(userId || 1);
          break;
        case 'user':
          data = await postService.getByUserId(userId);
          break;
        case 'trending':
          data = await postService.getTrending();
          break;
        default:
          data = await postService.getAll();
      }
      
      // Filter posts based on privacy settings and blocked users
      const filteredPosts = await filterPostsByPrivacy(data);
      setPosts(filteredPosts);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPostsByPrivacy = async (posts) => {
    if (!posts || posts.length === 0) return posts;
    
    try {
      const currentUserId = 1; // This would come from auth context
      const filteredPosts = [];
      
      for (const post of posts) {
        // Skip own posts
        if (post.userId === currentUserId) {
          filteredPosts.push(post);
          continue;
        }
        
        // Check if user is blocked
        const isBlocked = await userService.isBlocked(currentUserId, post.userId);
        if (isBlocked) continue;
        
        // Check user's privacy settings
        const privacySettings = await userService.getPrivacySettings(post.userId);
        
        // Check post visibility
        if (privacySettings?.allowPostVisibility === 'nobody') {
          continue;
        }
        
        if (privacySettings?.allowPostVisibility === 'followers') {
          const isFollowing = await userService.isFollowing(currentUserId, post.userId);
          if (!isFollowing) continue;
        }
        
        filteredPosts.push(post);
      }
      
      return filteredPosts;
    } catch (error) {
      console.error('Error filtering posts by privacy:', error);
      return posts; // Return original posts if filtering fails
    }
  };

  useEffect(() => {
    loadPosts();
  }, [userId, variant]);

  const handleLike = async (postId, isLiked) => {
    try {
      const newLikes = isLiked ? 
        await postService.like(postId, 1) : 
        await postService.unlike(postId, 1);
      
      setPosts(prev => prev.map(post => 
        post.Id === postId ? { ...post, likes: newLikes } : post
      ));
      
      return newLikes;
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error('Failed to like post');
      return posts.find(p => p.Id === postId)?.likes || 0;
    }
  };

  const handleComment = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleShare = (postId) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Pulse Connect',
        url: `${window.location.origin}/post/${postId}`
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return <Loading variant="posts" className={className} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load posts"
        message={error}
        onRetry={loadPosts}
        className={className}
      />
    );
  }

  if (posts.length === 0) {
    const emptyConfig = {
      feed: {
        title: "Your feed is empty",
        message: "Follow some users to see their posts here!",
        actionLabel: "Explore Users",
        onAction: () => navigate('/explore')
      },
      user: {
        title: "No posts yet",
        message: "This user hasn't shared anything yet.",
        variant: 'posts'
      },
      trending: {
        title: "No trending posts",
        message: "Check back later for trending content!",
        variant: 'posts'
      }
    };

    const config = emptyConfig[variant] || emptyConfig.feed;

    return (
      <Empty
        title={config.title}
        message={config.message}
        actionLabel={config.actionLabel}
        onAction={config.onAction}
        variant={config.variant || 'posts'}
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {posts.map((post) => (
        <PostCard
          key={post.Id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}
    </div>
  );
};

export default PostList;