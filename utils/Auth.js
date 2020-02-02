const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
const {SECTARE}=require("../config/index")
const passport=require("passport")
// any register auth

const userRegistration = async (userData, role, res) => {
  // validate if its unique
  let usernameNotTaken = await validateUsername(userData.username);
  if (!usernameNotTaken) {
    return res.status(400).json({
      message: `Username is taken`,
      sucess: false
    });
  }
  let emailRegisted = await validateEmail(userData.email);
  if (!emailRegisted) {
    return res.status(400).json({
      message: `Email is taken`,
      sucess: false
    });
  }

  //   hashed the password
  const hashed = await bcrypt.hash(userData.password, 12);
  // create a new user
  const newUser = new User({ ...userData, password: hashed, role: role });
  await newUser.save();
  return res.status(201).json({
    message: "Hurry ! now you are sucessfully register, Please Login ",
    sucess: true
  });
};

const validateUsername = async username => {
  let userNameIsPresent =await User.findOne({ username });
  return userNameIsPresent ? false : true;
};

const validateEmail = async email => {
  let emailIsPresent =await User.findOne({ email });
  return emailIsPresent ? false : true;
};


const userLogin=async(userCreds,role,res)=>{
    let {username,password}=userCreds;
    // ckeck if username is in the databse 
    const user=await User.findOne({username:username})
    if (!user) {
      return res.status(404).json({
        message:"Username is not found. Invalid login cradintials.",
        sucess:false

      })
    }
    if(user.role!==role){
      return res.status(403).json({
        message:"not authroize to loginm from this portal ",
        sucess:false
      })
    }
    // user us present and it has the and trying to login from proper portol
    let isMatch=await bcrypt.compare(password,user.password);
    if(isMatch){
      //  sing in the token and issue it to the user

    let token=jwt.sign({user_id:user._id,role:user.role,username:user.name,email:user.email},SECTARE,{expiresIn:"7 days"})

    let result={
      userame:user.username,
      role:user.role,
      email:user.email,
      token:token,
      expiresIn:168
    }
    
    return res.status(200).json({...result})

    }else{
      return res.status(403).json({
        message:"user name or password missmatch",
        sucess:false
      })
    }
}

const userAuth=passport.authenticate("jwt",{session:false})

const serializeUser=user=>{
  return{
    username:user.username,
    email:user.email,
    _id:user._id,
    name:user.name
  }
}

// DESC 
const checkRolse=roles=>(req,res,next)=>{
  if(roles.include(req.user.role)){
    next()
  }
  return res.status(401).json({
    message:"Unauthorize",
    sucess:true
  })
}

module.exports = {checkRolse,userAuth, userRegistration ,userLogin,serializeUser};
