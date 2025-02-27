import jwt from 'jsonwebtoken'

export const isAuthenticated =  (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    /* let userData; */
    /* console.log("accessToken",accessToken);
    console.log("refreshToken",refreshToken); */
    
    if (!accessToken && !refreshToken) {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        return res.status(400).json("Unauthoeized")
    }

    if (accessToken || refreshToken) {
        if(accessToken)
        {
            jwt.verify(accessToken, process.env.JWT_SECRET,(err,data)=>{
                if(err)
                {
                    console.log("accessToken: ",err);
                    res.clearCookie("accessToken")
                    if(refreshToken)
                    {
                        console.log("New access token");
                        jwt.verify(refreshToken,process.env.JWT_SECRET,(err,data)=>{
                            if(err)
                            {
                                console.log("refreshToken: ",err);
                                console.log("Invalid tokens");
                                res.clearCookie("refreshToken")
                                return res.status(400).json({error:"Unauthorized"})
                            }
                            else{
                                /* res.clearCookie("accessToken") */
                                const newAccessToken = jwt.sign(data,process.env.JWT_SECRET)
                                res.cookie("accessToken",newAccessToken,{httpOnly:true});
                                req.userData=data;
                                next();
                            }
                        })
                    }
                    
                    /* res.clearCookie("accessToken"); */
                }
                else{
                    req.userData=data;
                    return next()
                }
            })
        }
    }
       /*  jwt.verify(refreshToken, process.env.JWT_SECRET,(err,data)=>{
            if(err)
            {
                console.log("Invalid refresh token");
                return res.status(400).json({error:"Invalid refresh token"})
            }
            else{
                const newAccessToken = jwt.sign(data,process.env.JWT_SECRET,{expiresIn:'30s'})
                res.cookie("accessToken",newAccessToken,{httpOnly:true})
                req.userData=data;
                return next();
            }
        });
}
    if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET,(err,data)=>{
                if(err)
                {
                    console.log("accessToken: ",err);
                    res.clearCookie("accessToken");
                }
                else{
                    req.userData=data;
                    return next()
                }
            })
    } */

   
    
    

  /*   try {
        jwt.verify(accessToken, process.env.JWT_SECRET, (err) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid access token' });
            }
        });
    } catch (error) {
        console.log(error);
        
    } */
    return next();
}