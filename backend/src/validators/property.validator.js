const { body, query } = require('express-validator');

const propertyValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').optional().trim(),
  body('country').optional().trim(),
  body('address').optional().trim(),
  body('propertyType').trim().notEmpty().withMessage('Property type is required'),
  body('bedrooms')
    .notEmpty()
    .withMessage('Bedrooms is required')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms')
    .notEmpty()
    .withMessage('Bathrooms is required')
    .isFloat({ min: 0 })
    .withMessage('Bathrooms must be a non-negative number'),
  body('area').optional().isFloat({ min: 0 }).withMessage('Area must be a positive number'),
];

const propertyQueryValidator = [
  query('city').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
  query('propertyType').optional().trim(),
  query('bedrooms').optional().isInt({ min: 0 }).withMessage('bedrooms must be a non-negative integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
  query('sortBy').optional().trim(),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('sortOrder must be either "asc" or "desc"'),
];

module.exports = {
  propertyValidator,
  propertyQueryValidator,
};
