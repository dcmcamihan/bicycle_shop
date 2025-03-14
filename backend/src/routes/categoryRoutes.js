const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getAllCategories);
router.get('/:category_code', categoryController.getCategoryByCode);
router.post('/', categoryController.createCategory);
router.put('/:category_code', categoryController.updateCategory);
router.delete('/:category_code', categoryController.deleteCategory);

module.exports = router;