const propertyRepository = require('../repositories/property.repository');
const propertyImageRepository = require('../repositories/propertyImage.repository');
const ApiError = require('../utils/ApiError');

class PropertyService {
  async createProperty(data, ownerId, imageFiles = []) {
    const property = await propertyRepository.createProperty({
      ...data,
      ownerId,
    });

    if (imageFiles.length > 0) {
      const imageData = imageFiles.map((file) => ({
        propertyId: property.id,
        imageUrl: `/uploads/${file.filename}`,
      }));
      await propertyImageRepository.createManyPropertyImages(imageData);
    }

    return propertyRepository.findPropertyById(property.id);
  }

  async getPropertyById(id) {
    const property = await propertyRepository.findPropertyById(id);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    return property;
  }

  async getAllProperties(filters) {
    return propertyRepository.findAllProperties(filters);
  }

  async getSimilarProperties(propertyId) {
    const property = await propertyRepository.findPropertyById(propertyId);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    return propertyRepository.findSimilarProperties(
      property.id,
      property.city,
      property.propertyType,
      property.price
    );
  }

  async updateProperty(id, data, ownerId) {
    const property = await propertyRepository.findPropertyById(id);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ApiError(403, 'You are not authorized to update this property');
    }
    return propertyRepository.updateProperty(id, data);
  }

  async deleteProperty(id, ownerId) {
    const property = await propertyRepository.findPropertyById(id);
    if (!property) {
      throw new ApiError(404, 'Property not found');
    }
    if (property.ownerId !== ownerId) {
      throw new ApiError(403, 'You are not authorized to delete this property');
    }
    return propertyRepository.deleteProperty(id);
  }

  async getMyProperties(ownerId, page, limit) {
    return propertyRepository.findPropertiesByOwner(ownerId, page, limit);
  }
}

module.exports = new PropertyService();
