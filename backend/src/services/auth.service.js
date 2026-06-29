const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const refreshTokenRepository = require('../repositories/refreshToken.repository');
const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} = require('../constants');
const ApiError = require('../utils/ApiError');

class AuthService {
  async register(name, email, password, phone) {
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'User already exists with this email');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const expiresInDays = parseInt(JWT_REFRESH_EXPIRES_IN) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await refreshTokenRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(email, password) {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const expiresInDays = parseInt(JWT_REFRESH_EXPIRES_IN) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await refreshTokenRepository.createRefreshToken({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token is required');
    }

    const storedToken = await refreshTokenRepository.findRefreshToken(refreshToken);
    if (!storedToken || new Date() > new Date(storedToken.expiresAt)) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await userRepository.findUserById(storedToken.userId);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const accessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user);

    const expiresInDays = parseInt(JWT_REFRESH_EXPIRES_IN) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await refreshTokenRepository.deleteRefreshToken(refreshToken);
    await refreshTokenRepository.createRefreshToken({
      userId: user.id,
      token: newRefreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken) {
    if (refreshToken) {
      await refreshTokenRepository.deleteRefreshToken(refreshToken);
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }
}

module.exports = new AuthService();
