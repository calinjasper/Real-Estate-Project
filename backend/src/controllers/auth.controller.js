const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;
    const result = await authService.register(name, email, password, phone);

    res
      .status(201)
      .cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(new ApiResponse(201, result, 'User registered successfully'));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res
      .status(200)
      .cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(new ApiResponse(200, result, 'User logged in successfully'));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await authService.refreshAccessToken(refreshToken);

    res
      .status(200)
      .cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      })
      .cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(new ApiResponse(200, result, 'Access token refreshed successfully'));
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    await authService.logout(refreshToken);

    res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(new ApiResponse(200, null, 'User logged out successfully'));
  });

  getCurrentUser = asyncHandler(async (req, res) => {
    res
      .status(200)
      .json(new ApiResponse(200, req.user, 'Current user fetched successfully'));
  });
}

module.exports = new AuthController();
