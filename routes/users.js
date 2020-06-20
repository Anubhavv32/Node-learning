const auth = require('../middleware/auth');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/me',auth,async ( req,res )=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)

})

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email:req.body.email})
    if(user) return res.status(400).send("User already exists")


    user = new User(_.pick(req.body,['email','password','phoneNo','name']))
    const salt = await bcrypt.genSalt();
    user.password= await bcrypt.hash(user.password,salt);
    await user.save();
    const token = user.genrateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name','email','phoneNo']));
});



module.exports = router;