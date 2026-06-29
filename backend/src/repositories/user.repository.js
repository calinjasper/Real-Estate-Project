const prisma = require('../config/prismaClient');

class UserRepository {
  async createUser(data) {
    return prisma.user.create({
      data,
    });
  }

  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = new UserRepository();
