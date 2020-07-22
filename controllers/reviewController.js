const Review = require('../modals/reviewModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
   const reviews = await Review.find();
   console.log(reviews.length);
   if (reviews.length === 0) {
      next(new AppError('No reviews found'));
   }
   res.status('200').json({
      status: 'success',
      data: {
         reviews,
      },
   });
});

exports.createReview = catchAsync(async (req, res, next) => {
   const newTour = await Review.create(req.body);
   res.status('200').json({
      data: {
         newTour,
      },
   });
   next();
});