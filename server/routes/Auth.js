const express=require('express');
const router=express.Router();
const User= require('../models/User');
const tempUser= require('../models/tempUser');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET = "helloKaushikBeinLimit";
const fetchUser = require("../middleware/fetchUser");
const {body,validationResult}=require('express-validator');
// const fetchUser=require('../middleware/fetchUser')
const {uploadOnCloudinary}=require('../utils/cloudinary')
const nodemailer = require('nodemailer');

router.post('/', fetchUser,async (req,res)=>{
   console.log("i am called")
})

//Route 0 for email verification
router.post('/sendOtp',async (req,res)=>{
const email=req.body.email;
console.log("i am called",email)
let user=await User.findOne({email})
if(user){
    return res.status(400).json({msg:"Email already exists"})
}
let otp = Math.floor(1000 + Math.random() * 9000);
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'princegupta92349@gmail.com',
      pass: 'xqyy elef namz ghpg'
    }
  });
  
  var mailOptions = {
    from: 'dlnpriyanshu@gmail.com',
    to: `${email}`,
    subject: 'Welcome to MediaBook',
    html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Thankyou for showing intrest on Mediabook</h2>
            <p style="font-size: 16px; color: #555;">Your one time password (OTP) is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #333;">${otp}</p>
            <p style="font-size: 14px; color: #777;">Please use this OTP to complete your verification process.🙂</p>
        </div>
    `
    
  };
  otp=toString(otp);
  transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      const salt=await bcrypt.genSalt(10);
      const encOtp=await bcrypt.hash(otp,salt)
   
        let tmpuser= new tempUser({
        email,
        otp:encOtp
    }) 
    await tmpuser.save().then(()=>{
        // console.log("added")
        res.json({msg:"otp sended succesfully",status:true})
    })
    }
  });

})



//route 0.2 verifying the otp
router.post('/verifyOtp',async (req,res)=>{
    const email=req.body.email;
    const otp=req.body.otp;
    try{
    let user=await tempUser.findOne({email})
    if(!user){
        return res.status(400).json({msg:"Please try to login with correct credentials"})
    }
    const otpCompare=await bcrypt.compare(user.otp,otp)
  if(!otpCompare)
        res.json({status:true,msg:"Successfully Login"})
    else
    res.json({a:"jbh"})
    
} catch (error) {
    console.log(error.message)
    res.status(500).send({msg:"Internal server error occured"})
}

})





//Route1:create a user using :POST "/api/auth/createUser" no login required
router.post('/createUser', async (req, res) => {
    let signup = false;
    const { email, name, password } = req.body;
    let profilePhoto = '';
    let bgPhoto = '';

    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ msg: "Email already exists" });
    }

    // console.log("hhi"+req.files.profileImg+req.files.bgImg);
    // Upload profile image if provided
    if (req.files && req.files.profileImg) {
        const profileImg = req.files.profileImg;
        const uploadResponse = await uploadOnCloudinary(profileImg.tempFilePath);
        profilePhoto = uploadResponse;
    }

    // Upload background image if provided
    if (req.files && req.files.bgImg) {
        const bgImg = req.files.bgImg;
        const uploadResponse = await uploadOnCloudinary(bgImg.tempFilePath);
        bgPhoto = uploadResponse;
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    console.log("hello"+profilePhoto+bgPhoto);

    // User Creation
    user = await new User({
        name,
        email,
        password: secPass,
        profilePhoto,
        bgPhoto,
    });

    const data = {
        user: {
            id: user.id
        }
    };

    user.save().then(() => {
        const authToken = jwt.sign(data, JWT_SECRET);
        signup = true;
        res.json({ authToken, signup, msg: "User Created Successfully" });
    }).catch((error) => {
        console.error(error.message);
        res.status(500).send({ msg: "Internal server error occurred" });
    });
});

//Route2: Authenticate a user using :POST "/api/auth/login", no login required
router.post('/loginUser',async (req,res)=>{
    let login=false
        //if there are errors return bad request and the errors
    const result=validationResult(req)
    if(!result.isEmpty()){
    return res.json({errors:result.array()})
    }
    const {email,password}=req.body
    try {
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({msg:"Please try to login with correct credentials"})
        }
        const passwordCompare=await bcrypt.compare(password,user.password)
        if(!passwordCompare)
        {
            return res.status(400).json({msg:"Please try to login with correct credentials"})
        }
        login=true
        const data={
            user:{
                id:user.id
            }
        }
            const authToken =jwt.sign(data,JWT_SECRET);
            res.json({authToken,login,msg:"Successfully Login",userName:user.name,userId:user._id})
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({msg:"Internal server error occured"})
    }
})

// Route3: Get logged in user details using : POST "api/auth/getUser". Login Required
router.post('/getUser', fetchUser,async (req,res)=>{
    try {
         const userId=req.user.id;
        const user= await User.findById(userId).select("-password")
        // console.log(user)
        res.send({user})
    } catch (error) {
        console.error(error.message)
        res.status(500).send({msg:"Internal Server Error"})
    }
})
module.exports=router
