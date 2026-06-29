const prisma = require('../config/prismaClient');

class PropertyImageRepository {
  async createPropertyImage(data) {
    return prisma.propertyImage.create({
      data,
    });
  }

  async createManyPropertyImages(data) {
    return prisma.propertyImage.createMany({
      data,
    });
  }

  async findImagesByPropertyId(propertyId) {
    return prisma.propertyImage.findMany({
      where: { propertyId },
    });
  }

  async deletePropertyImage(id) {
    return prisma.propertyImage.delete({
      where: { id },
    });
  }

  async deleteImagesByPropertyId(propertyId) {
    return prisma.propertyImage.deleteMany({
      where: { propertyId },
    });
  }
}

module.exports = new PropertyImageRepository();
