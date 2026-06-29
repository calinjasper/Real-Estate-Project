const prisma = require('../config/prismaClient');

class RefreshTokenRepository {
  async createRefreshToken(data) {
    return prisma.refreshToken.create({
      data,
    });
  }

  async findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  async deleteRefreshToken(token) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteRefreshTokensByUserId(userId) {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}

module.exports = new RefreshTokenRepository();
