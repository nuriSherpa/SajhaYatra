const asyncHandler = (fn, CustomError) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) =>
    CustomError(error, req, res, next),
  );

module.exports = asyncHandler;
