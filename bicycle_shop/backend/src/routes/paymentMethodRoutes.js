const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

router.get('/', paymentMethodController.getAllPaymentMethods);
router.get('/:paymentMethodCode', paymentMethodController.getPaymentMethodByCode);
router.post('/', paymentMethodController.createPaymentMethod);
router.put('/:paymentMethodCode', paymentMethodController.updatePaymentMethod);
router.delete('/:paymentMethodCode', paymentMethodController.deletePaymentMethod);

module.exports = router;