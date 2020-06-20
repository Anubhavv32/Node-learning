const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema =  new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 250,
      unique: true,
  },
  phoneNo: {
      type: Number,
      required: true,
      length: 10,
      
  },
  password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,

  },
  isAdmin : Boolean,
  roles:[],
  operations:[]
});

userSchema.methods.genrateAuthToken = function(){
  const token = jwt.sign({_id:this._id, isAdmin: this.isAdmin},config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    phoneNo: Joi.number().required(),
    password: Joi.string().min(3).max(50).required(),
   

  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;