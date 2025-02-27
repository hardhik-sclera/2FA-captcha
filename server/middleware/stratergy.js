import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
/* import  {GoogleAuthenticator as GoogleAuthenticator} from "passport-2fa-totp";
import {Strategy as TwoFAStartegy} from 'passport-2fa-totp'; */
/* import { mockUsers } from "../constants/userModel.js"; */
import { users } from "../constants/database.js";
import bcrypt from 'bcrypt'

passport.use(new localStrategy({usernameField:"email",passwordField:"password"},
    async(email,password,done)=>{
        if(!email || !password)
        {
            return done(null,false,{message:"Both fields are required"})
        }
        console.log(email);
        console.log(password);
        
        const user = await users.findOne({email}) ;   
        console.log("user strategy: ",user);
        
        if(!user)
        {
            console.log("User not found");
            return done(null,false,{message:"User not found"})
        }
        const Pass= await bcrypt.compare(password,user.password)
        if(user.email === email && Pass)
            return done(null,user)
        return done(null,false,{message:"Username or password incorrect"})
        /* console.log(process.env.JWT_SECRET); */
        /* console.log(user); */
        
        
    }
))


passport.serializeUser((user,done)=>{
    if(!user) return done(null,false,{error:"No user"})
    return done(null,user.email)
})

passport.deserializeUser(async (email, done) => {
    if (!email) {
        return done(null, false, { error: "User not found" });
    }
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return done(null, false, { error: "User not found" });
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

/* 
passport.use(new TwoFAStartegy((username,password, done) => {
    const user = mockUsers.find((user)=>username===user.name && password==user.password)
    if(!user)
    {
        return done(null,false,{error:"User not found"})
    }
    return done(null,user)
}),(user,done)=>{
    if(user.)
}); */



export default passport