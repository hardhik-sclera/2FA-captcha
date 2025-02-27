export const mockUsers=[
    { id: 1, name: 'john doe', displayname: 'John Doe',password:'123'},
    { id: 2, name: 'jane doe', displayname: 'Jane Doe',password:'1234'},
    { id: 3, name: 'john smith', displayname: 'John Smith',password:'12345'},
    { id: 4, name: 'jane smith', displayname: 'Jane Smith',password:'123456'},
    { id: 5, name: 'john brown', displayname: 'John Brown',password:'1234567'},
    { id: 6, name: 'jane brown', displayname: 'Jane Brown',password:'12345678'},

]

/*   const accessToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"30m"})
    const refreshToken=jwt.sign(user,process.env.JWT_SECRET,{expiresIn:"7d"})

    res.cookie("accessToken",accessToken,{httpOnly:true})
    res.cookie("refreshToken",refreshToken,{httpOnly:true})
    return res.json(user.name) */