const express = require('express');
const router = express.Router();
const supplyDetailsController = require('../controllers/supplyDetailsController');

router.get('/', supplyDetailsController.getAllSupplyDetails);
router.get('/:id', supplyDetailsController.getSupplyDetailsById);
router.post('/', supplyDetailsController.createSupplyDetails);
router.put('/:id', supplyDetailsController.updateSupplyDetails);
router.delete('/:id', supplyDetailsController.deleteSupplyDetails);

module.exports = router;