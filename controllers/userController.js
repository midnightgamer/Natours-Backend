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

const filterObj = (obj, ...allowedFields) => {
   const newObj = {};
   Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
   });
   return newObj;
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.createUser = createOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {
   console.log(req.file);
   console.log(req.body);
   // 1) Create error if user POSTs password data
   if (req.body.password || req.body.passwordConfirm) {
      return next(
         new AppError(
            'This route is not for password updates. Please use /updateMyPassword.',
            400
         )
      );
   }

   // 2) Filtered out unwanted fields names that are not allowed to be updated
   const filteredBody = filterObj(req.body, 'name', 'email');
   if (req.file) filteredBody.photo = req.file.filename;

   // 3) Update user document
   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
   });

   res.status(200).json({
      status: 'success',
      data: {
         user: updatedUser,
      },
   });
});

exports.getMe = (req, res, next) => {
   req.params.id = req.user.id;
   next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
   await User.findByIdAndUpdate(req.user.id, { active: false });
   res.status(204).json({
      status: 'success',
   });
});
