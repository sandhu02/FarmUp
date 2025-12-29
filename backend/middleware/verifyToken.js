const jwt = require("jsonwebtoken");


verifyToken = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ success: false, message: "No token provided" });
    }

    jwt.verify(token , process.env.JWT_SECRET , (err,user)=>{
        if (err){
            res.json({success : false , message : "Invalid token"})
        }
        else {
            req.user = user
            next()
        }
    })
}

module.exports = verifyToken