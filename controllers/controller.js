const User=require('../models/user');


exports.getAllUser = async (req, res) => {
    const user= await User.find({});
        res.status(200).json({user});
};
  


