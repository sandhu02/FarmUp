const express = require("express");
const { Router } = express;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const verifyToken = require("../middleware/verifyToken");
const router = Router()

const User = require("../model/user")

router.post("/login" , async (req ,res) => {
    try{
        const {role , username , password} = req.body

        const mongodbUser = await User.findOne( {role , username} );
        if (!mongodbUser) {
            return res.status(400).send(
                {
                    success: false,
                    message: "User not found"
                }
            );
        }
        const isPasswordMatch = await bcrypt.compare(password, mongodbUser.password);
        
        if(!isPasswordMatch){
            return res.json(
                {
                    success: false,
                    message: "Incorrect password"
                }
            )
        }
        
        const token = jwt.sign({ id: mongodbUser._id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        res.status(200).json(
            { 
                success: true,
                message: "Login successful",
                token : token
            }
        );
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }    

})


router.post("/register" , async (req,res)=> {
    try {
        console.log(req.body)
        const {name, role, username, password} = req.body
        
        // if (role == "admin"){
        //     return res.send({
        //         success : false ,
        //         message : "Admin Cannot Register"
        //     })
        // }

        const alreadyExists = await User.findOne({role,username})
        if (alreadyExists){ 
            return res.send({
                success : false ,
                message : "User already exists"
            }) 
        } 
        
        const hash = await bcrypt.hash(password, 10);
        try {
            await User.create({ name, role, username, password: hash });
            res.send({
                success : true ,
                message : "User created successfully"
            })
        } catch (err) {
            res.status(400).send({
                success : false ,
                message : 'Error creating user'
            });
        }
    }
    catch(err){
        console.error(err);
        res.status(400).send({
            success: false,
            message: "Error creating user",
        });
    }
})

router.delete("/logout" , verifyToken ,(req,res) => {
    res.clearCookie('token', { httpOnly: true });
    
    console.log("in logout")
    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
})


module.exports = router