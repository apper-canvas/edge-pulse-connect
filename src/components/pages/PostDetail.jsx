import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import CommentCard from "@/components/molecules/CommentCard";
import CommentForm from "@/components/molecules/CommentForm";
import PostCard from "@/components/molecules/PostCard";
import commentsData from "@/services/mockData/comments.json";
import postsData from "@/services/mockData/posts.json";
import usersData from "@/services/mockData/users.json";
import followsData from "@/services/mockData/follows.json";
import { postService } from "@/services/api/postService";
import { commentService } from "@/services/api/commentService";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const postData = await postService.getById(parseInt(id));
      if (!postData) {
        setError('Post not found');
        return;
      }
      
      setPost(postData);
    } catch (err) {
      setError(err.message || 'Failed to load post');
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const commentsData = await commentService.getByPostId(parseInt(id));
      setComments(commentsData);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
  }, [id]);

  const handleLike = async (postId, isLiked) => {
    try {
      const newLikes = isLiked ? 
        await postService.like(postId, 1) : 
        await postService.unlike(postId, 1);
      
      setPost(prev => ({ ...prev, likes: newLikes }));
      return newLikes;
    } catch (err) {
      console.error('Error liking post:', err);
      toast.error('Failed to like post');
      return post?.likes || 0;
    }
  };

  const handleComment = (postId) => {
    // Already on post detail page, just scroll to comments
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = (postId) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post on Pulse Connect',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (content) => {
    try {
      const newComment = await commentService.create({
        postId: parseInt(id),
        authorId: 1, // Current user ID
        content,
        parentId: null
      });
      
      setComments(prev => [...prev, newComment]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      toast.success('Comment posted successfully!');
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await commentService.delete(commentId);
      setComments(prev => prev.filter(comment => comment.Id !== commentId));
      setPost(prev => ({ ...prev, comments: Math.max(0, prev.comments - 1) }));
      toast.success('Comment deleted successfully!');
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Loading variant="posts" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Error
          title="Post not found"
          message={error}
          onRetry={loadPost}
        />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" size={20} />
        <span>Back</span>
      </motion.button>

      {/* Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <PostCard
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6"
      >
        <CommentForm
          onSubmit={handleCommentSubmit}
          placeholder="Write a comment..."
        />
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        id="comments-section"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({comments.length})
        </h3>
        
        {commentsLoading ? (
          <Loading variant="comments" />
        ) : comments.length === 0 ? (
          <Empty
            title="No comments yet"
            message="Be the first to share your thoughts!"
            variant="comments"
          />
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard
                key={comment.Id}
                comment={comment}
                onDelete={handleCommentDelete}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};