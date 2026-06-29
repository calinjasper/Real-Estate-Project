const prisma = require('../config/prismaClient');

class PropertyRepository {
  async createProperty(data) {
    return prisma.property.create({
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        propertyImages: true,
      },
    });
  }

  async findPropertyById(id) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        propertyImages: true,
      },
    });
  }

  async findAllProperties(filters = {}) {
    const {
      city,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const where = {};

    if (city) {
      where.city = city;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (bedrooms !== undefined) {
      where.bedrooms = parseInt(bedrooms);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          propertyImages: true,
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.property.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return {
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages,
      },
    };
  }

  async findSimilarProperties(propertyId, city, propertyType, price) {
    const minPrice = price * 0.8;
    const maxPrice = price * 1.2;

    return prisma.property.findMany({
      where: {
        id: { not: propertyId },
        city,
        propertyType,
        price: { gte: minPrice, lte: maxPrice },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        propertyImages: true,
      },
      take: 5,
    });
  }

  async updateProperty(id, data) {
    return prisma.property.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        propertyImages: true,
      },
    });
  }

  async deleteProperty(id) {
    return prisma.property.delete({
      where: { id },
    });
  }

  async findPropertiesByOwner(ownerId, page = 1, limit = 20) {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where: { ownerId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          propertyImages: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.property.count({ where: { ownerId } }),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    return {
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages,
      },
    };
  }
}

module.exports = new PropertyRepository();
