const User = require('../modals/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const {
   deleteOne,
   updateOne,
   createOne,
   getOne,
   getAll,
} = require('./factoryController');

const filterObject = (obj, ...fileds) => {
   const newObj = {};
   Object.keys(obj).forEach((key) => {
      if (fileds.includes(key)) newObj[key] = obj[key];
   });
   return newObj;
};
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.createUser = createOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
   // Create error for password changes
   if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('You cannot update password', 400));
   }
   // Update user data
   const filteredBody = filterObject(req.body, 'name', 'email');
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidation: true,
   });

   res.status(200).json({
      status: 'success',
      data: {
         user: updatedUser,
      },
   });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
   await User.findByIdAndUpdate(req.user.id, { active: false });
   res.status(204).json({
      status: 'success',
   });
});
