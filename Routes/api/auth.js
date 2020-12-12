const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config");
const {check, validationResult} = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route  GET api/auth
//@desc   Test Route
//@access Public
router.get("/", auth, async(req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");  //select method filters password or given parameter
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//@route  POST api/auth
//@desc   Authenticate user and get token
//@access Public
router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
],async (req, res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }

    const {email, password} = req.body;
    
    try{
        //see if user exist 
        let user = await User.findOne({email});

        if(!user){
        return res
         .status(400)
         .json({errors: [{ msg: "Invalid Credentials"}]})
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res
                .status(400)
                .json({errors: [{ msg: "Invalid Credentials"}]})
        }      
        //return json web token
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            {expiresIn: 360000 },
            (err, token)=>{
             if(err) throw err;
             res.json({ token })});
        
        
    
    
    }catch(err){
        console.error(err.message);
        res.status(500).send("Server Error")
    }
    
    });

module.exports = router;