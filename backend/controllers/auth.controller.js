import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { genToken } from "../utils/JWT.js";

export const register = async(req,res)=>{
  try {
    const {username ,password,email} = req.body;
    if(!username || !password || !email){
      return res.status(400).json({code: 0,error: 'All fields are required'});
    }
    const ifAlreadyExists = await User.findOne({email:email});
    if(ifAlreadyExists){
      return res.status(400).json({code: 0,error: 'Email already exists'});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
      username,
      password: hashedPassword,
      email
    })
    await user.save();
    genToken(user._id,res);
    const userInfo = user.toObject();
    delete userInfo.password;
    return res.status(200).json({code: 1,message: "user registered successfully",user: userInfo})
  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 0,error: 'error in register controller '});
  }
}
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ code: 0, error: 'All fields are required' });
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ code: 0, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 0, error: 'Invalid credentials' });
    }

   
    await genToken(user._id, res);

   
    const userInfo = user.toObject();
    delete userInfo.password;

    
    return res.status(200).json({ code: 1, message: 'Login successful', user: userInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ code: 0, error: 'Error in login controller' });
  }
};
export const logout = async(req,res)=>{
  try {
    res.clearCookie('social-token');
    return res.status(200).json({code: 1,message: "logout successful"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({code: 0,error: 'error in logout controller'});
  }
}

export const resetPassword = async (req, res) => {
  try {
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ code: 0, error: 'Unauthorized access' });
    }

    const { currentPassword, updatedPassword } = req.body;
    const userId = req.user.userId;
    
   
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ code: 0, error: 'User not found' });
    }

   
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 0, error: 'Invalid current password' });
    }

  
    if (currentPassword === updatedPassword) {
      return res.status(400).json({ code: 0, error: 'New password cannot be the same as current password' });
    }

   
    const hashedPassword = await bcrypt.hash(updatedPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ code: 1, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in resetPassword controller:', error);
    return res.status(500).json({ code: 0, error: 'Error in reset password controller' });
  }
};