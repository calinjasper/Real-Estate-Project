const prisma = require('../config/prismaClient');

class InquiryRepository {
  async createInquiry(data) {
    return prisma.inquiry.create({
      data,
      include: {
        property: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findInquiryByPropertyAndBuyer(propertyId, buyerId) {
    return prisma.inquiry.findFirst({
      where: {
        propertyId,
        buyerId,
      },
    });
  }

  async findInquiriesByProperty(propertyId) {
    return prisma.inquiry.findMany({
      where: { propertyId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async findInquiriesByBuyer(buyerId) {
    return prisma.inquiry.findMany({
      where: { buyerId },
      include: {
        property: true,
      },
    });
  }

  async deleteInquiry(id) {
    return prisma.inquiry.delete({
      where: { id },
    });
  }
}

module.exports = new InquiryRepository();
