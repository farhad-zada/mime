const User = require(`${__dirname}/../models/userModel`)
const catchAsync = require('../utils/catchAsync')



exports.deleteUser = catchAsync(async (req, res, next) => {

    const { email } = req.params
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
  
    res.status(204).json(); 
  });