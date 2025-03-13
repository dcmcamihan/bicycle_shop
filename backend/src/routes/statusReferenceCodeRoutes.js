const express = require('express');
const router = express.Router();
const statusReferenceCodeController = require('../controllers/statusReferenceCodeController');

router.get('/', statusReferenceCodeController.getAllStatusReferenceCodes);
router.get('/:status_reference_code', statusReferenceCodeController.getStatusReferenceCodeByCode);
router.post('/', statusReferenceCodeController.createStatusReferenceCode);
router.put('/:status_reference_code', statusReferenceCodeController.updateStatusReferenceCode);
router.delete('/:status_reference_code', statusReferenceCodeController.deleteStatusReferenceCode);

module.exports = router;