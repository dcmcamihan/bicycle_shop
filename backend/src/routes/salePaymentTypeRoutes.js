const express = require('express');
const router = express.Router();
const salePaymentTypeController = require('../controllers/salePaymentTypeController');

router.get('/', salePaymentTypeController.getAllSalePaymentTypes);
router.get('/:sale_payment_type_code', salePaymentTypeController.getSalePaymentTypeByCode);
router.post('/', salePaymentTypeController.createSalePaymentType);
router.put('/:sale_payment_type_code', salePaymentTypeController.updateSalePaymentType);
router.delete('/:sale_payment_type_code', salePaymentTypeController.deleteSalePaymentType);

// New route to get sale payment type by sale_id
router.get('/sale/:sale_id', salePaymentTypeController.getSalePaymentTypeBySaleId);

module.exports = router;