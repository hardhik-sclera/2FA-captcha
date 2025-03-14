import e, { Router } from "express";
import '../middleware/stratergy.js'
import passport from "passport";
import jwt from 'jsonwebtoken'
import {users} from '../constants/database.js'
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import speakeasy from "speakeasy";
/* import util from 'util'; */

import qrcode from 'qrcode'
import bcrypt from 'bcrypt'
/* import { transporter,mailOptions } from "../helpers/email.js"; */
import nodemailer from 'nodemailer'
import axios from "axios";

const router = Router();

router.post('/register',async(req,res)=>{    
    
    const {body:{username,password,email, captchaToken}}=req;
    if(!username || !password || !email)
        {
            return res.status(400).json({error:"All fields are required"})
        }
        
    const user = await users.findOne({email});

    
        // console.log(secretKey);
        
        
    try {
        const response = await 
        axios.post(`https://www.google.com/recaptcha/api/siteverify`,
            null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaToken
            }
        })

        if (response.data.success && response.data.score > 0.8) {
            // console.log("Score: ", response.data.score);
            
            if(user)
                {
                    console.log("User: ",user);
                    
                    return res.status(400).json("User already exists ")
                }
                const hashedPassword= await bcrypt.hash(password,12);
                const secret=speakeasy.generateSecret();
                // console.log(secret);
                
                            let twoFactorSecret = secret.base32; 
                            let istwoFaAuthActive = true;
                             /*const newUser = {
                                _id:user._id,
                                username: user.username,
                                password: user.password,
                                email: user.email,
                                istwoFaAuthActive,
                                twoFactorSecret
                            }; */
                            /* users.insert(newUser, (err, savedUser) => {
                                if (err) {
                                    console.error("Insert Error:", err);
                                    return res.status(500).json({ error: "Database error" });
                                } */
                    const newUser = await users.insert({
                    username,
                    password:hashedPassword,
                    email,
                    istwoFaAuthActive,
                    twoFactorSecret
                })
                const url = speakeasy.otpauthURL({
                    secret: secret.base32,
                    issuer: "www.doogle.com",
                    encoding: "base32",
                    label: newUser.username,
                    
                });
                console.log(url);
            
                const qrUrlImage = await qrcode.toDataURL(url);
                const ss = await users.findOne({ email });
                console.log(ss);
            
                return res.status(200).json({ secret, qrUrlImage, newUser });
               /*  return res.status(200).json(newUser); */
        } else {
            res.status(400).json({success: false, error: response.data['error-codes']})
        }
    } catch (error) {
        console.error('Error verifying reCAPTCHA: ', error)
        res.status(500).json({success: false, error: 'Internal server error'})        
    }   
    
})
const verifyRecaptcha = async (captchaToken) => {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: captchaToken
        }
    });

    return response.data;
};
router.post('/login', async (req, res, next) => {
    console.log("Login Request: ", req.body);
    const { username, password, captchaToken } = req.body;

    const captchaResponse = await verifyRecaptcha(captchaToken);
    console.log(captchaResponse)
    if (captchaResponse.success===false) {
        return res.status(400).json({ error: "Captcha verification failed", details: captchaResponse['error-codes'] });
    }
        const { success, score } = captchaResponse;
    //  console.log(captchaVerifyResponse.data);
        if (!success || score < 0.5) {  // Adjust score threshold if needed
            return res.status(401).json({ error: "Captcha verification failed" });
        }

        // If Captcha is valid, proceed with authentication
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ error: "Invalid credentials" });

            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.status(200).json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                });
            });
        })(req, res, next);
});

router.post('/2fa/setup',async(req,res)=>{
    /* const accessToken=req.cookies.accessToken; */
  /* let refreshToken="" */
    /* console.log("From session un: ",req.user); */
   /*  let user=req.user  */
    const {email} =req.body;
    console.log(email);
    console.log("email type: ", typeof email);
    
    

   
/* const findOneAsync = util.promisify(users.findOne.bind(users));

const user = await findOneAsync({ email }); */

const user = await users.find({email})    
    const currentUser=user[0]
    console.log("User: ", currentUser);
    
    if(!currentUser)
    return res.status(400).json({error:"User not found"})

    const secret=speakeasy.generateSecret();
    let twoFactorSecret = secret.base32; 
    let istwoFaAuthActive = true;
    const newUser = {
       _id:currentUser._id,
       username: currentUser.username,
       password: currentUser.password,
       email: currentUser.email,
       istwoFaAuthActive,
       twoFactorSecret
   };
    users.remove({ email });
     users.insert(newUser)
     console.log("newUser: ",newUser);
     
    console.log("setup, " ,user);
    const url= speakeasy.otpauthURL({
    secret:twoFactorSecret,
    issuer:"www.doogle.com",
    encoding:"base32",
    label:newUser.username,
 })
 const qrUrlImage=await qrcode.toDataURL(url)

    /* if(accessToken)
    {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, data) => {
            if(err)
            {
                console.log("Error: ", err);
            }
            else{
                user = data;
                 res.clearCookie("accessToken");
                res.clearCookie("refreshToken"); 
            }
        });
    } */
   
    
    /* console.log("From token: ",user); */
   /*  try {
        if(user) {
                 console.log(user.username);    
                 const secret=speakeasy.generateSecret();
                 let twoFactorSecret = secret.base32; 
                 let istwoFaAuthActive = true;
                 const newUser = {
                    _id:user._id,
                    username: user.username,
                    password: user.password,
                    email: user.email,
                    istwoFaAuthActive,
                    twoFactorSecret
                };
                users.remove({ email: newUser.email });
                if(accessToken || refreshToken)
                {
                    res.clearCookie("accessToken")
                    res.clearCookie("refreshToken")
                    const accessToken = jwt.sign(newUser, process.env.JWT_SECRET, { expiresIn: "30m" });
                    const refreshToken = jwt.sign(newUser, process.env.JWT_SECRET, { expiresIn: "7d" });
                    res.cookie("accessToken", accessToken, { httpOnly: true });
                    res.cookie("refreshToken", refreshToken, { httpOnly: true });
                }
                users.insert(newUser)  
                 const url= speakeasy.otpauthURL({
                    secret:secret.base32,
                    issuer:"www.doogle.com",
                    encoding:"base32",
                    label:newUser.username,
                
                 })
                 const qrUrlImage=await qrcode.toDataURL(url) */
                /*  const transporter = nodemailer.createTransport({
                     service: "gmail",
                     auth: {
                         user: "chihardhik@gmail.com",
                         pass: process.env.EMAIL_PASSWORD
                     }
                 }); */
               /*   const mailOptions = {
                    from: "chihardhik@gmail.com",
                    to: newUser.email,
                    subject: "Set Up Two-Factor Authentication",
                    html: `<p>Scan this QR code in Google Authenticator:</p>
                           <img src="${qrUrlImage}" alt="Google Authenticator QR Code" />`
                }; */
                
                 

                /*  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("Error sending email:", error);
                        return res.send("Error sending 2FA email");
                    }
                    console.log("Email sent:", info.response);
                    res.send("2FA setup email sent. Please check your inbox.");
                }); */
                 
                 
                 
      /*       }

    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"Could not setup 2fa",message:error})
    } */
    return res.status(200).json({secret, qrUrlImage})
    
})


router.post('/2fa/verify', async(req, res) => {
    const { token } = req.body;
    /* let accessToken = req.cookies.accessToken; */
    let {email} = req.body;
    let user=await users.findOne({email})
    console.log("token type: ",typeof token);
    
   /*  if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                user = data;
                /* res.clearCookie("accessToken");
                res.clearCookie("refreshToken"); 
                 
            }
        });
    }
 */
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token
    });
    console.log("verified: ",verified);
    
    if (verified) {
      /*   if(!accessToken)
        {
            accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30m" });
            refreshToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
            res.cookie("accessToken", accessToken, { httpOnly: true });
            res.cookie("refreshToken", refreshToken, { httpOnly: true });
        } */
        
       /*  if(req.session)
        {
            console.log("req.session ",req.session);
            
            req.session.destroy((err) => {
                if (err) {
                    console.log('err', err);
                    return res.status(400).json({ error: "error deleting session" });
                }
            });
            res.clearCookie('connect.sid');
        } */
        
        return res.status(200).json({ message: "2FA successful"});
    }
    return res.status(400).json({ error: "Wrong token !!!" });
});

router.post('/2fa/reset/', isAuthenticated, (req, res) => {
    const user = req.userData;
    console.log("Reset 2FA Request - User Data:", user); // Debugging line
    try {
        if (user) {
            let twoFactorSecret = ""; 
            let istwoFaAuthActive = false;
            const newUser = {
                _id: user._id,
                username: user.username,
                password: user.password,
                email: user.email,
                istwoFaAuthActive,
                twoFactorSecret
            };

            users.remove({ email: newUser.email });
            users.insert(newUser);

            console.log("New User after Reset:", newUser);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(200).json({ message: "2FA reset successful",email:newUser.email});
        } else {
            return res.status(400).json({ error: "User not authenticated" });
        }
    } catch (error) {
        console.log("2FA Reset Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post('/otp',(req,res)=>{
    const {token} = req.body;
    if(!token)
    {
        return res.status(400).json({error:"Invalid OTP"})
    }
    let accessToken = req.cookies.accessToken;
    let user = req.user;
    

    /* if (accessToken) {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                console.log("Error: ", err);
            } else {
                user = data;
                /* res.clearCookie("accessToken");
                res.clearCookie("refreshToken");  
            }
        });
    } */

    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    console.log("otp type: ",typeof token);
    
    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token
    });
    console.log("verified: ",verified);
   /*  let refreshToken=undefined; */
    if (verified) {
        if(!accessToken)
        {
            const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30m" });
            const refreshToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("accessToken", accessToken, { httpOnly: true,secure:true,sameSite:"Strict"  });
            res.cookie("refreshToken", refreshToken, { httpOnly: true,secure:true,sameSite:"Strict"  });
        }
        
        
        req.session.destroy((err) => {
            if (err) {
                console.log('err', err);
                return res.status(400).json({ error: "error deleting session" });
            }
        });
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: "2FA successful"});
    }
    return res.status(400).json({ error: "Wrong token !!!" });

})

router.get('/protected/home',isAuthenticated,(req,res)=>{
    const {username}= req.userData;
    console.log(username);
    if(!username)
    {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(200).json({error:"Unauthorized"})
    }
        
    return res.status(200).json(username);
})

router.get('/logout',isAuthenticated,(req,res)=>{
    const {username}= req.userData;
    console.log(username);
    
    if(username)
    {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        console.log("name of",username);
        
        return res.status(200).json(username);
    }
    return res.status(400).json({error:"Logout failed"})
})

export default router