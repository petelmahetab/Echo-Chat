import User from "../models/userModels.js";
import bcrypt from 'bcryptjs'
import generateTokenANDSetCookie from '../utils/generateToken.js'


export const signUp = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    //console.log(req.body)
    // CHeck both passwprd and confirmPassword are not Equal
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password didn't match" })
    }
    //If User Is present in DB already..
    const user = await User.findOne({ userName })
    if (user) {
      return res.status(400).json({ error: 'Username is Aleready Exists.' })
    }

    //For hasing the Password we need to use bcrypt
    const salt = await bcrypt.genSalt(10);//by default we take it as 10
    const hashedPass = await bcrypt.hash(password, salt)

    const profilePicMale = `https://avatar.iran.liara.run/public/boy?username=${userName}`

    const profilePicFemale = `https://avatar.iran.liara.run/public/girl?username=${userName}`

    const newUser = new User({
      fullName, userName, password: hashedPass, gender, profilePic: gender === 'male' ? profilePicMale : profilePicFemale
    })

    //Now save the User to DB
    await newUser.save()
    generateTokenANDSetCookie(newUser._id, res)
    res.status(201).json({
      __id: newUser.id,
      fullName: newUser.fullName, userName: newUser.userName, profilePic: newUser.profilePic
    })

  } catch (err) {
    console.log("Error in Sign In Route..", err.message)
    res.status(500).json({ error: 'Internal Server error.' })
  }
}



export const loginUser = async (req, res) => {
  try {

    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid UserName or Password ..' })
    }
    generateTokenANDSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
    });

  } catch (err) {

    console.log("Error While finding User.")
    res.status(500).json({ err: 'Internal Server Error' })
  }
}

export const logOutUser = (req, res) => {
  try {
    
  res.cookie('jwt','',{maxAge:0});
  res.status(200).json({message:'Successfully Logged-Out.'})

  } catch (error) {
    console.log('Error During Log Out')
    res.status(500).json({error:'Internal Server Error..'})
  }
}