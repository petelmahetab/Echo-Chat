import jwt from 'jsonwebtoken'

const generateTokenANDSetCookie=(userId,res)=>{

     const token=jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN || '7d'})

     res.cookie('jwt',token,{
        maxAge:15*24*60*1000,
        httpOnly:true, //Xss attacks
        sameSite:'strict',
        secured:process.env.JWT_SECRET==='production',
       secure:process.env.NODE_ENV !=='development'
     })
}

export default generateTokenANDSetCookie;