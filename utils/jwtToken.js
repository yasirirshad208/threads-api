const jwt = require('jsonwebtoken');

// craeting token and saving in cookie

const sendToken = (data, statusCode, res)=>{
    
    const token = data.getJWTToken()

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true
        }
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        data,
        token
    })
}

module.exports=sendToken;