import jwt from 'jsonwebtoken';

export const genToken = async(userId,res)=>{
  try {
    const token = await jwt.sign({userId:userId},process.env.JWT_SECRET,{
      expiresIn: '7d'
    })
    res.cookie("social-token",token,{
      maxAge:  1000 * 60 * 60 * 24 * 10,
      httpOnly: true,
      secure: false,
      sameSite: 'none'  // for cross-site requests
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({cod: 0,error: 'error in generating token'});
  }
}