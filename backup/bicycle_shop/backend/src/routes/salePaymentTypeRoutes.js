const express = require('express');
const router = express.Router();
const salePaymentTypeController = require('../controllers/salePaymentTypeController');

router.get('/', salePaymentTypeController.getAllSalePaymentTypes);
router.get('/:sale_payment_type_code', salePaymentTypeController.getSalePaymentTypeByCode);
router.post('/', salePaymentTypeController.createSalePaymentType);
router.put('/:sale_payment_type_code', salePaymentTypeController.updateSalePaymentType);
router.delete('/:sale_payment_type_code', salePaymentTypeController.deleteSalePaymentType);

module.exports = router;