import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protectRoute=async (req,res,next)=>{
    try{
  const token=req.cookies.jwt;
 //console.log('Token from cookies:', token);
  if(!token){
    return res.status(401).json({error:'UnAuthorized - No token is Provided'})
  }
  const decoded=jwt.verify(token,process.env.JWT_SECRET);
  //console.log(decoded);

 if(!decoded){ return res.status(401).json({error:'UnAuthorized - No token is Provided'})}
 //console.log('Searching for user with ID:', decoded.id);
 

  const user=await User.findById(decoded.id).select('-password')
  
   if(!user)
   { return res.status(404).json({error:'User Not found'})}

   req.user=user;

   next();

}catch(err){
        console.log("Error Occured at server Side")
    res.status(500).json({err:"Internal Server Error"})
    }
}

export default protectRoute