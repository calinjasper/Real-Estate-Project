const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  propertyValidator,
  propertyQueryValidator,
} = require('../validators/property.validator');
const upload = require('../config/multer');

router.get(
  '/',
  propertyQueryValidator,
  validate,
  propertyController.getAllProperties
);
router.get('/my', authenticate, propertyController.getMyProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/:id/similar', propertyController.getSimilarProperties);
router.post(
  '/',
  authenticate,
  upload.array('images', 10),
  propertyValidator,
  validate,
  propertyController.createProperty
);
router.put(
  '/:id',
  authenticate,
  propertyValidator,
  validate,
  propertyController.updateProperty
);
router.delete('/:id', authenticate, propertyController.deleteProperty);

module.exports = router;
