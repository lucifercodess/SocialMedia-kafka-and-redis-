
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";

export const createPost = async (req, res) => {
  try {
   
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ code: 0, error: 'Content is required' });
    }
    const post = await new Post({
      content,
      author: req.user.userId, 
    }).save(); 
    return res.status(201).json({ code: 1, message: 'Post created successfully', post });

  } catch (error) {
    console.error('Error in createPost controller:', error);
    return res.status(500).json({ code: 0, error: 'Error in creating post' });
  }
};

export const editPost = async (req, res) => {
  const { id } = req.params; 

  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ code: 0, error: 'Content is required' });
    }
    const updatedPost = await Post.findByIdAndUpdate(id, { content }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ code: 0, error: 'Post not found' });
    }
    return res.status(200).json({ code: 1, message: 'Post updated successfully', post: updatedPost });

  } catch (error) {
    console.error('Error in editPost controller:', error);
    return res.status(500).json({ code: 0, error: 'Error in editing post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ code: 0, error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ code: 0, error: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();

    return res.status(200).json({ code: 1, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost controller:', error);
    return res.status(500).json({ code: 0, error: 'Error in deleting post' });
  }
};

export const viewPosts = async (req, res) => {
  try {
    const id = req.user.userId;
    const user = await User.findById(id).populate('following');
    if (!user) {
      return res.status(404).json({ code: 0, error: 'User not found' });
    }
    const followedUserIds = user.following.map(user => user._id);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;


    const cacheKey = `posts:${id}:page=${page}:limit=${limit}`;
    const cachedPosts = await redis.get(cacheKey);
    if (cachedPosts) {
      return res.status(200).json({ code: 1, message: 'Posts retrieved from cache', posts: JSON.parse(cachedPosts) });
    }
    const posts = await Post.find({ author: { $in: followedUserIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

  
    await redis.set(cacheKey, JSON.stringify(posts), 'EX', 3600);

    return res.status(200).json({ code: 1, message: 'Posts retrieved successfully', posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in retrieving posts' });
  }
};


export const likeUnlikePost = async (req, res) => {
  try {
    const postToLikeId = req.params.id; 
    const userId = req.user.userId;    
    const post = await Post.findById(postToLikeId);
    if (!post) {
      return res.status(404).json({ code: 0, error: 'Post not found' });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
      await post.save();
      return res.status(200).json({ code: 1, message: 'Post unliked successfully', post });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ code: 1, message: 'Post liked successfully', post });
    }

  } catch (error) {
    console.error('Error in toggleLikePost controller:', error);
    return res.status(500).json({ code: 0, error: 'Error in toggling like on post' });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const postId = req.params;
    
      const {content} = req.body;
      if(!content){
        return res.status(400).json({ code: 0, error: 'Content is required' });
      }
      const post = await Post.findByIdAndUpdate(postId, { $push: { comments: content } }, { new: true });
      if(!post){
        return res.status(404).json({ code: 0, error: 'Post not found' });
      }
      await post.save();
      return res.status(201).json({ code: 1, message: 'Comment added successfully', post });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in commenting on post' });
  }
}

