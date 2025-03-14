const express = require('express');
const router = express.Router();
const saleDetailsController = require('../controllers/saleDetailsController');

router.get('/', saleDetailsController.getAllSaleDetails);
router.get('/:id', saleDetailsController.getSaleDetailsById);
router.get('/sale/:saleId', saleDetailsController.getSaleDetailsBySaleId); // New route
router.post('/', saleDetailsController.createSaleDetails);
router.put('/:id', saleDetailsController.updateSaleDetails);
router.delete('/:id', saleDetailsController.deleteSaleDetails);

module.exports = router;