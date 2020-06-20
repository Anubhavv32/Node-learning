const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Joi = require('joi');

router.post('/', async (req, res) => {
    console.log(req.body)
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).send("Invalid Username and Password")

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send("Invalid Username and Password")
    const token = user.genrateAuthToken();
    
    res.send(token)
});


function validate(user) {
    console.log(user)
    const schema = {
      email: Joi.string().min(5).max(50).required().email(),
      password: Joi.string().min(3).max(50).required()
  
    };
  
    return Joi.validate(user, schema);
  }


module.exports = router;