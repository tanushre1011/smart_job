const User = require('../models/User');
const Joi = require('joi');

const updateSchema = Joi.object({
  name: Joi.string().min(2),
  profile: Joi.object().unknown(true)
});

exports.getMe = async (req,res,next) => {
  try{
    const user = await User.findById(req.user._id).select('-passwordHash').lean();
    res.json(user);
  } catch(err){ next(err); }
};

exports.updateMe = async (req,res,next) => {
  try{
    const { error, value } = updateSchema.validate(req.body);
    if(error) return res.status(400).json({ message: error.message });
    await User.findByIdAndUpdate(req.user._id, value);
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json(user);
  } catch(err){ next(err); }
};
