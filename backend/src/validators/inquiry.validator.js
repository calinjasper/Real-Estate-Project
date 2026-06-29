const { body } = require('express-validator');

const inquiryValidator = [
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message must be less than 500 characters'),
];

module.exports = {
  inquiryValidator,
};
