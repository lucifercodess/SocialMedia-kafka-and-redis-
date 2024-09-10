import { User } from "../models/user.model.js";
import Redis from "ioredis";
const redis = new Redis({
  host: '127.0.0.1', 
  port: 6379         
});
export const follow = async(req,res)=>{
  try {
     const targetUserId = req.params.id;
     const currentUserId = req.user.userId;
     if(targetUserId === currentUserId){
      return res.status(400).json({code:0,error:"cannot follow yourself"})
     }
     const targetUser = await User.findById(targetUserId);
     const currentUser = await User.findById(currentUserId);

     if(!targetUser ||!currentUser){
      return res.status(404).json({code:0,error:"User not found"})
     }
     if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ code: 0, error: "You are already following this user" });
    }
     currentUser.following.push(targetUserId);
     targetUser.followers.push(currentUserId);

     await currentUser.save();
     await targetUser.save();

     return res.status(200).json({ code: 1, message: 'User followed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in follow controller' });
  }
}

export const unfollow = async(req,res)=>{
  try {
    const targetUserId = req.params.id;
     const currentUserId = req.user.userId;
     if(targetUserId === currentUserId){
      return res.status(400).json({code:0,error:"cannot unfollow yourself"})
     }
     const targetUser = await User.findById(targetUserId);
     const currentUser = await User.findById(currentUserId);
     if(!targetUser ||!currentUser){
      return res.status(404).json({code:0,error:"User not found"})
     }
     if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ code: 0, error: "You are not following this user" });
    }
    currentUser.following.pop(targetUserId);
    targetUser.followers.pop(currentUserId);

    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);

    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({ code: 1, message: 'User unfollowed successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in unfollow controller' });
  }
}
export const getFollowersList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `followers:${userId}`;
    const cachedFollowers = await redis.get(cacheKey);
    if (cachedFollowers) {
      return res.status(200).json({ code: 1, followers: JSON.parse(cachedFollowers) });
    }
    const user = await User.findById(userId).populate({
      path: 'followers',
      select: 'username',
    });

    if (!user) {
      return res.status(404).json({ code: 0, error: "User not found" });
    }
    await redis.set(cacheKey, JSON.stringify(user.followers), 'EX', 3600);
    return res.status(200).json({ code: 1, followers: user.followers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in getFollowersList controller' });
  }
};

export const getFollowingList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cacheKey = `following:${userId}`;
    const cachedFollowing = await redis.get(cacheKey);
    if (cachedFollowing) {
      return res.status(200).json({ code: 1, following: JSON.parse(cachedFollowing) });
    }
    const user = await User.findById(userId).populate({
      path: 'following',
      select: 'username',
    });

    if (!user) {
      return res.status(404).json({ code: 0, error: "User not found" });
    }
    await redis.set(cacheKey, JSON.stringify(user.following), 'EX', 3600);
    return res.status(200).json({ code: 1, following: user.following });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in getFollowingList controller' });
  }
};