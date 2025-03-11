const express = require('express');
const router = express.Router();
const stockoutController = require('../controllers/stockoutController');

router.get('/', stockoutController.getAllStockouts);
router.get('/:id', stockoutController.getStockoutById);
router.post('/', stockoutController.createStockout);
router.put('/:id', stockoutController.updateStockout);
router.delete('/:id', stockoutController.deleteStockout);

module.exports = router;