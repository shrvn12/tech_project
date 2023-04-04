const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
require("dotenv").config();

const { userModel } = require("../models/user.model");
const { IdValidator } = require("../middlewares/id.validator");
const { layoutModel } = require("../models/custmization");
const { authenticate } = require("../middlewares/authenticator");
const { validate } = require("../middlewares/validatedata");
const { auhtorizor } = require("../middlewares/authorizor");
const { codeModel } = require("../models/verifications.model");

const userRouter = express.Router();
const saltRounds = process.env.saltRounds;

var transporter = nodemailer.createTransport({
  service:"gmail",
  host:"smtp.gmail.com",
  secure:false,
  auth:{
    user:process.env.from_email,
    pass:process.env.email_password
  }
});

userRouter.post("/register",validate(["email","password","name"]), async (req, res) => {
  let data = req.body;

  let account = await userModel.findOne({"email":data.email});

  if(account){
    res.send({msg:"account already exists"});
    return;
  }

  const mail = {
    from:process.env.from_email,
    to: req.body.email,
    subject:"Welcome message",
    text:"welcome to app"
  }
  if (data.name == "admin1") {
    data.role = "superadmin";
  } 
  else {
    data.role = "user";
  }

  bcrypt.hash(data.password, +saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.send({ msg: "something went wrong" ,error:err.message});
    } else {
      data.password = hash;
      const user = new userModel(data);
      await user.save();

      transporter.sendMail(mail,(err,res)=>{
        if(err){
          console.log(err);
        }
        else{
          console.log(res);
        }
      })

      res.send({ msg: `registration successful as ${data.role}`, registered:true });
    }
  });
});

userRouter.post("/login",validate(["email","password"]),auhtorizor, async (req, res) => {
  const data = req.body;
  const dbdata = await userModel.findOne({ email: data.email });
  const token = jwt.sign(dbdata.toJSON(), process.env.key);
  const refresh_token = jwt.sign(dbdata.toJSON(),process.env.refreshkey,{expiresIn:"7d"})
  res.send({ msg: `login successful as ${dbdata.role}`, token, refresh_token, logged_in:true, name:dbdata.name});
});

userRouter.post("/getcode", async (req,res)=>{
  const email = req.body.email;
  let code = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets:false ,specialChars: false });

  const exp_time = 5*60*1000;

  const expires = Date.now() + exp_time;
  console.log(code,expires,email);

  const payload = {
    code : await bcrypt.hash(code.toString(),+saltRounds),
    email,
    expires
  }

  console.log(payload);

  let prevcodes = await codeModel.find({email})

  // console.log("PREVCODES**************")
  // console.log(prevcodes);
  // console.log("---------------------------------------------------")

  for(let elem of prevcodes){
    await codeModel.findByIdAndDelete(elem._id);
  }
  
  const verification_code = new codeModel(payload);
  await verification_code.save();
  console.log("saved to db");

  const mail = {
    from:process.env.from_email,
    to: email,
    subject: "Reset your password",
    text: `Your code is ${code} \n This code is only valid for 5 minutes`
  }

  transporter.sendMail(mail,(err,result)=>{
    if(err){
      console.log(err);
      res.send({msg:"something went wrong", error:err.message})
    }
    else{
      console.log(result);
      res.send({code,msg:`verification code is sent to ${email}`});
    }
  });

})

userRouter.post("/verifycode",async(req,res)=>{
  const data = req.body;
  const verification_data = await codeModel.findOne({email:data.email});
  if(!verification_data){
    res.send({msg:"access denied, get the code again"});
    return;
  }

  bcrypt.compare(data.code, verification_data.code, async(err,result)=>{
    if(err){
      console.log(err);
      res.send({msg:"something went wrong"});
    }
    else{
      if(result){
        await codeModel.findByIdAndUpdate(verification_data.id,{verified:true});
        res.send({msg:"verification successful",verification:true});
      }
      else{
        res.send({msg:"your code is incorrect",verification:false});
      }
    }
  })
})

userRouter.patch("/resetpswd",async(req,res)=>{
  const data = req.body;
  console.log(data);
  const user = await codeModel.findOne({email:data.email});
  console.log(user);
  if(!user || !user.verified){
    res.send({msg:"acess denied"});
    return;
  }
  bcrypt.hash(data.new_password,+saltRounds,async(err,hash)=>{
    if(err){
      console.log("error while updating your password, try again");
      console.log(err);
      res.send({msg:"something went wrong"});
    }
    else{
      const user_details = await userModel.findOne({email:data.email});
      await userModel.findByIdAndUpdate(user_details.id,{password:hash});
      res.send({msg:"successfully updated the password"});
      await codeModel.findByIdAndDelete(user.id);
    }
  })
})

// userRouter.get("/getnewtoken",(req,res)=>{
//   const refresh_token = req.headers.authorization;
//   if(!refresh_token){
//     res.send({msg:"login again"});
//     return;
//   }
//   jwt.verify(refresh_token,process.env.refreshkey,(err,decoded)=>{
//     if(err){
//       res.send({"msg":"something went wrong, token can't be generated", "err":err.message});
//     }
//     else{
//       const payload = {
//         _id : decoded._id,
//         name : decoded.name,
//         email : decoded.email,
//         password : decoded.password,
//         role: decoded.role
//       }
//       console.log(decoded);
//       console.log(payload)
//       const token = jwt.sign(payload, process.env.key, {expiresIn:3600});
//       res.send({msg:"token generated successfully",token});
//     }
//   })
// })

// userRouter.use(adminValidator);

userRouter.get("/users",authenticate("admin"), async (req, res) => {
  let data = await userModel.find();
  res.send(data);
});

userRouter.get("/users/:id",IdValidator(userModel),authenticate("admin"), async (req, res) => {
  const id = req.params.id;
  let data = await userModel.findById(id);
  res.send(data);
});

userRouter.patch("/promotetoadmin/:id",IdValidator(userModel),authenticate("admin"), async (req, res) => {
  const id = req.params.id;
  const dbdata = await userModel.findById(id);
    if(dbdata.role == "admin"){
      res.send({msg:"user is already an admin"})
    }
    else{
      await userModel.findByIdAndUpdate(id,{role:"admin"});
      res.send({msg:"promoted to admin"});
    }
});

userRouter.patch("/promotetosuperadmin/:id",IdValidator(userModel),authenticate("superadmin"), async (req, res) => {
  const id = req.params.id;
  const dbdata = await userModel.findById(id);
    if(dbdata.role == "superadmin"){
      res.send({msg:"user is already an superadmin"})
    }
    else{
      await userModel.findByIdAndUpdate(id,{role:"superadmin"});
      res.send({msg:"promoted to superadmin"});
    }
});

userRouter.patch("/removeadminaccess/:id",IdValidator(userModel),authenticate("admin"), async (req, res) => {
  const id = req.params.id;
  const dbdata = await userModel.findById(id);
  if(dbdata.role !== "admin"){
    res.send({msg:"user is not an admin"});
  }
  else{
    await userModel.findByIdAndUpdate(id,{role:"user"});
    res.send({msg:"removed admin access"});
  }
});

userRouter.patch("/users/update/:id",IdValidator(userModel),authenticate("admin"),async(req,res)=>{
  const id = req.params.id;
  const updates = req.body;
  await userModel.findByIdAndUpdate(id,updates);
  res.send({msg:"successfully updated the data"});
})

userRouter.delete("/users/delete/:id",IdValidator(userModel),authenticate("admin"),async(req,res)=>{
  const id = req.params.id;
  await userModel.findByIdAndDelete(id);
  res.send({msg:"successfully deleted the data"});
})

userRouter.post("/customize",authenticate("admin"), async (req,res)=>{
  const data = req.body;
  await layoutModel.deleteMany({});
  const layout = new layoutModel(data);
  console.log(data);
  await layout.save();
  res.send({msg:"your customizations are being published"});
})

userRouter.get("/figma",authenticate("admin"), async (req,res)=>{
  const data = await layoutModel.find();
  res.send({data});
})

userRouter.get("/wishlist",async (req,res)=>{
    const token = req.headers.authorization;
    if(!token){
      return res.send({msg:"please login to continue"});
    }
    jwt.verify(token,process.env.key,async (err,decoded) => {
    if(err){
      res.send({msg:"something went wrong, try logging in again"});
      console.log(err);
    }
    else{
      const user = await userModel.findOne({email:decoded.email});
      const wishlist = user.wishlist;
      res.send(wishlist);
    }
  })
})

userRouter.patch("/addtowishlist/:id",(req,res)=>{
  const id = req.params.id;
  const token = req.headers.authorization;
  if(!token){
    return res.send({msg:"You are not logged in"});
  }
  jwt.verify(token,process.env.key,async (err,decoded) => {
    if(err){
      res.send({msg:"something went wrong, try logging in again"});
      console.log(err);
    }
    else{
      const user = await userModel.findOne({email:decoded.email});
      const wishlist = user.wishlist;
      if(wishlist.includes(id)){
        return res.send({msg:"item already exists in wishlist"})
      }
      wishlist.push(id);
      await userModel.findByIdAndUpdate(user.id,{wishlist});
      res.send({msg:"added to wishlist"});
    }
  })
})

userRouter.delete("/removefromwishlist/:id",(req,res)=>{
  const id = req.params.id;
  const token = req.headers.authorization;
  if(!token){
    return res.send({msg:"You are not logged in"});
  }
  jwt.verify(token,process.env.key,async (err,decoded) => {
    if(err){
      res.send({msg:"something went wrong, please try again"})
    }
    else{
      const user = await userModel.findOne({email:decoded.email});
      const prevwishlist = user.wishlist;
      const wishlist = []
      for(let elem of prevwishlist){
        if(elem !== id){
          wishlist.push(elem);
        }
      }
      await userModel.findByIdAndUpdate(user.id,{wishlist});
      res.send({msg:"removed from wishlist"});
    }
  })
})

module.exports = {
  userRouter,
};
