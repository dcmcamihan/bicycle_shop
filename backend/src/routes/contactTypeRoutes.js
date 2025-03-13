const express = require('express');
const router = express.Router();
const contactTypeController = require('../controllers/contactTypeController');

router.get('/', contactTypeController.getAllContactTypes);
router.get('/:contact_type_code', contactTypeController.getContactTypeByCode);
router.post('/', contactTypeController.createContactType);
router.put('/:contact_type_code', contactTypeController.updateContactType);
router.delete('/:contact_type_code', contactTypeController.deleteContactType);

module.exports = router;