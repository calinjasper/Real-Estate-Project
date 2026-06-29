const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const inquiryService = require('../services/inquiry.service');

class InquiryController {
  createInquiry = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const { message } = req.body;
    const inquiry = await inquiryService.createInquiry(
      parseInt(propertyId),
      req.user.id,
      message
    );

    res
      .status(201)
      .json(new ApiResponse(201, inquiry, 'Inquiry created successfully'));
  });

  getInquiriesForProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;
    const inquiries = await inquiryService.getInquiriesForProperty(
      parseInt(propertyId),
      req.user.id
    );

    res
      .status(200)
      .json(new ApiResponse(200, inquiries, 'Inquiries fetched successfully'));
  });

  getMyInquiries = asyncHandler(async (req, res) => {
    const inquiries = await inquiryService.getMyInquiries(req.user.id);

    res
      .status(200)
      .json(new ApiResponse(200, inquiries, 'My inquiries fetched successfully'));
  });
}

module.exports = new InquiryController();
