const express = require('express');
const router = express.Router();
const returnAndReplacementController = require('../controllers/returnAndReplacementController');

router.get('/', returnAndReplacementController.getAllReturnAndReplacements);
router.get('/:id', returnAndReplacementController.getReturnAndReplacementById);
router.post('/', returnAndReplacementController.createReturnAndReplacement);
router.put('/:id', returnAndReplacementController.updateReturnAndReplacement);
router.delete('/:id', returnAndReplacementController.deleteReturnAndReplacement);

module.exports = router;