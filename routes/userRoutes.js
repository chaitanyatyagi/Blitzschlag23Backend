const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const userController = require("../controller/userController")
const Registration=require('../model/registrations');
const User=require("../model/userModel")
router.route('/register').post(authController.register)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.protect, authController.logout)
router.route('/forgotpassword').post(authController.forgotPassword)
router.route('/resetpassword').post(authController.resetPassword)
router.route('/getuser').get(authController.protect, userController.getUser)
router.post('/registration',async(req,res)=>{
    // console.log(req.body);
    const users=await User.find({blitzId:req.body.blitzID});
    if(users.length!=1){
        return res.json({status:"error",message:"User not found in records"})
    }
    try{
        await (new Registration({userId:users[0].blitzId,eventName:req.body.eventName,teamName:req.body.teamName,members:req.body.Nmembers,registrationTime:Date.now()})).save()
        return res.json({status:"success"});
    }
    catch(err){
        console.log(err);
        return res.json({status:"error",message:"Error in registration . Please try again after some time"})
    }
})
module.exports = router