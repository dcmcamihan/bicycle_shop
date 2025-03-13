const express = require('express');
const router = express.Router();
const supplierAddressController = require('../controllers/supplierAddressController');

router.get('/', supplierAddressController.getAllSupplierAddresses);
router.get('/:id', supplierAddressController.getSupplierAddressById);
router.post('/', supplierAddressController.createSupplierAddress);
router.put('/:id', supplierAddressController.updateSupplierAddress);
router.delete('/:id', supplierAddressController.deleteSupplierAddress);

module.exports = router;