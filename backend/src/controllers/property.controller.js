const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const propertyService = require('../services/property.service');

class PropertyController {
  createProperty = asyncHandler(async (req, res) => {
    const property = await propertyService.createProperty(
      req.body,
      req.user.id,
      req.files
    );

    res
      .status(201)
      .json(new ApiResponse(201, property, 'Property created successfully'));
  });

  getPropertyById = asyncHandler(async (req, res) => {
    const property = await propertyService.getPropertyById(
      parseInt(req.params.id)
    );

    res
      .status(200)
      .json(new ApiResponse(200, property, 'Property fetched successfully'));
  });

  getAllProperties = asyncHandler(async (req, res) => {
    const properties = await propertyService.getAllProperties(req.query);

    res
      .status(200)
      .json(new ApiResponse(200, properties, 'Properties fetched successfully'));
  });

  getSimilarProperties = asyncHandler(async (req, res) => {
    const properties = await propertyService.getSimilarProperties(
      parseInt(req.params.id)
    );

    res
      .status(200)
      .json(new ApiResponse(200, properties, 'Similar properties fetched successfully'));
  });

  updateProperty = asyncHandler(async (req, res) => {
    const property = await propertyService.updateProperty(
      parseInt(req.params.id),
      req.body,
      req.user.id
    );

    res
      .status(200)
      .json(new ApiResponse(200, property, 'Property updated successfully'));
  });

  deleteProperty = asyncHandler(async (req, res) => {
    await propertyService.deleteProperty(
      parseInt(req.params.id),
      req.user.id
    );

    res
      .status(200)
      .json(new ApiResponse(200, null, 'Property deleted successfully'));
  });

  getMyProperties = asyncHandler(async (req, res) => {
    const { page, limit } = req.query;
    const properties = await propertyService.getMyProperties(
      req.user.id,
      page,
      limit
    );

    res
      .status(200)
      .json(new ApiResponse(200, properties, 'My properties fetched successfully'));
  });
}

module.exports = new PropertyController();
