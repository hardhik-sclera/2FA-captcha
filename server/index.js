import express from 'express'
import cors from 'cors'
import passport from 'passport'
import routes from './routes/index.route.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import session from 'express-session'
const app = express()
const PORT = 3000
dotenv.config();
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"

}))
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:60000,
        secure:false
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(routes)

/* const currentTime = Math.floor(Date.now() / 1000);
console.log(currentTime/30); */

app.listen(PORT,()=>{
    console.log("server is listening on 3000");
})