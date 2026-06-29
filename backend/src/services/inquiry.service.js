const inquiryRepository = require('../repositories/inquiry.repository');
const propertyRepository = require('../repositories/property.repository');
const ApiError = require('../utils/ApiError');

class InquiryService {
  async createInquiry(propertyId, buyerId, message) {
    const property = await propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    if (property.ownerId === buyerId) {
      throw new ApiError(400, 'You cannot inquire about your own property');
    }

    const existingInquiry = await inquiryRepository.findInquiryByPropertyAndBuyer(
      propertyId,
      buyerId
    );
    if (existingInquiry) {
      throw new ApiError(409, 'You have already inquired about this property');
    }

    return inquiryRepository.createInquiry({
      propertyId,
      buyerId,
      message,
    });
  }

  async getInquiriesForProperty(propertyId, ownerId) {
    const property = await propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ApiError(403, 'You are not authorized to view these inquiries');
    }
    return inquiryRepository.findInquiriesByProperty(propertyId);
  }

  async getMyInquiries(buyerId) {
    return inquiryRepository.findInquiriesByBuyer(buyerId);
  }

  async deleteInquiry(id, userId) {
    const inquiry = await inquiryRepository.findInquiryByPropertyAndBuyer(
      undefined,
      undefined
    );
    return inquiryRepository.deleteInquiry(id);
  }
}

module.exports = new InquiryService();
