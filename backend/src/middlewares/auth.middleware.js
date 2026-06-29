const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const { JWT_SECRET } = require('../constants');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Please login to access this resource');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findUserById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'Invalid access token');
    }

    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired access token');
  }
});

module.exports = authenticate;
