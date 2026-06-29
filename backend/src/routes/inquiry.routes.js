const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiry.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { inquiryValidator } = require('../validators/inquiry.validator');

router.post(
  '/property/:propertyId',
  authenticate,
  inquiryValidator,
  validate,
  inquiryController.createInquiry
);
router.get(
  '/property/:propertyId',
  authenticate,
  inquiryController.getInquiriesForProperty
);
router.get('/my', authenticate, inquiryController.getMyInquiries);

module.exports = router;
