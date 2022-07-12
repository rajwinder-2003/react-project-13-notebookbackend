const express = require('express');
const router = express.Router();
// import model user Schema
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
//bcrypt for password secuire
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');
const JWT_SECRET = 'rajisagoodb$oy';
// Route 1: Create a User using: POST "api/auth/createuser".No login required
router.post('/createuser',[
  // this code are fore express validation
    body('username','Enter a valid username').isLength({ min: 5 }),
    body('password','Enter a valid password').isLength({ min: 6 }),
    body('email','password must be atleast 5 characters').isEmail(),
], async (req,res)=>{
    let success = false;
  // if there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      return res.status(400).json({success,errors: errors.array()});
    }
    // check whether the username with this email exists already
    try {
      //use this async await
      let err = await User.findOne({username: req.body.username,email: req.body.email});
      if(err){
        return res.status(400).json({success,error: "Sorry a user with this username or email already exists"})
      }
    let emailerr = await User.findOne({email: req.body.email});
    if(emailerr){
      return res.status(400).json({success,error: "Sorry a user with this email already exists"})
    }
    let usererr = await User.findOne({username: req.body.username});
    if(usererr){
      return res.status(400).json({success,error: "Sorry a user with this username already exists"})
    }
  
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    //creat a new user
    user = await User.create({
      username: req.body.username,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    // res.json(user)
    success= true;
    res.json({success,authtoken});
    //catch errors
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error"); 
  }
});

// Route 2: login a User using: POST "api/auth/login" login required
router.post('/login',[
  // if there are errors, return bad request and errors
    body('username','Enter a valid username').exists(),
    body('password','Password Cannot be blank').exists(),
], async (req,res)=>{
  let success = false;
   // if there are errors, return bad request and errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({success,errors: errors.array() });
   }

   const {username,password} = req.body;
   try {
     let user = await User.findOne({username});
     if(!user){
       return res.status(400).json({success,error: "Please try to login with correct Credentials"});
     }
     const passwordCompare = await bcrypt.compare(password, user.password);
     if(!passwordCompare){
       return res.status(400).json({success, error: "Please try to login with correct Credentials"});
     }
     const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data,JWT_SECRET);
    // res.json(user)
    success = true;
    res.json({success, authtoken});
   } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error"); 
   }

});

// Route 3: Get loggedin  User Details  using: POST "api/auth/getuser" login required
router.post('/getuser', fetchuser, async (req,res)=>{
try {
  userid = req.user.id;
  const user = await User.findById(userid).select("-password")
  res.send(user);
} catch (error) {
  console.error(error.message);
    res.status(500).send("Internal Server Error");
}

})
module.exports = router;