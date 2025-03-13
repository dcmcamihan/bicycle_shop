const express = require('express');
const router = express.Router();
const customerContactController = require('../controllers/customerContactController');

router.get('/', customerContactController.getAllCustomerContacts);
router.get('/:id', customerContactController.getCustomerContactById);
router.post('/', customerContactController.createCustomerContact);
router.put('/:id', customerContactController.updateCustomerContact);
router.delete('/:id', customerContactController.deleteCustomerContact);

module.exports = router;